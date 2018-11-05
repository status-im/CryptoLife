pragma solidity ^0.4.24;

import "./AttributeStore.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "./IVoting.sol";
/**
@title Partial-Lock-Commit-Reveal Voting scheme with ERC20 tokens
@author Team: Aspyn Palatnick, Cem Ozer, Yorke Rhodes
*/
contract Voting is IVoting {


    // ============
    // EVENTS:
    // ============

    event _VoteCommitted(uint indexed pollID, address indexed voter);
    event _VoteRevealed(uint indexed pollID, uint numTokens, uint votesFor, uint votesAgainst, uint indexed choice, address indexed voter, uint salt);
    event _PollCreated(uint commitEndDate, uint revealEndDate, uint indexed pollID);
    event _VotingRightsGranted(uint numTokens, address indexed voter);
    event _VotingRightsWithdrawn(uint numTokens, address indexed voter);
    event _TokensRescued(uint indexed pollID, address indexed voter);
    event _StakeWithdrawed(uint indexed pollID, address indexed voter, uint numTokens);

    // ============
    // MODIFIERS:
    // ============

    modifier onlyRegistry {
        require(msg.sender == registry);
        _;
    }

    // ============
    // DATA STRUCTURES:
    // ============

    using AttributeStore for AttributeStore.Data;
    using SafeMath for uint;

    mapping(uint => Poll) public pollMap; // maps pollID to Poll struct

    struct Poll {
        uint commitEndDate;     /// expiration date of commit period for poll
        uint revealEndDate;     /// expiration date of reveal period for poll
        uint voteQuorum;	    /// number of votes required for a proposal to pass
        uint votesFor;          /// tally of votes supporting proposal
        uint votesAgainst;      /// tally of votes countering proposal
        uint staticFees;        /// amount of fees paid for commits
        mapping(address => bool) didCommit;   /// indicates whether an address committed a vote for this poll
        mapping(address => bool) didReveal;   /// indicates whether an address revealed a vote for this poll
        mapping(address => uint) voteOptions; /// stores the voteOption of an address that revealed
    }

    // ============
    // STATE VARIABLES:
    // ============

    uint public pollNonce;
    address public registry;

    AttributeStore.Data store;

    function set_registry(address registry_) external {
        require(registry_ != address(0));
        require(registry == address(0));

        registry = registry_;
    }

    // =================
    // VOTING INTERFACE:
    // =================
    /**
    @notice Commits vote using hash of choice and secret salt to conceal vote until reveal
    @param _pollID Integer identifier associated with target poll
    @param _secretHash Commit keccak256 hash of voter's choice and salt (tightly packed in this order)
    */
    function commitVote(uint _pollID, bytes32 _secretHash, address voter, uint _staticFee) external onlyRegistry {
        require(commitPeriodActive(_pollID));

        // prevent user from committing to zero node placeholder
        require(_pollID != 0);
        // prevent user from committing a secretHash of 0
        require(_secretHash != 0);

        bytes32 UUID = attrUUID(voter, _pollID);

        store.setAttribute(UUID, "commitHash", uint(_secretHash));

        pollMap[_pollID].didCommit[voter] = true;
        pollMap[_pollID].staticFees += _staticFee;

        emit _VoteCommitted(_pollID, voter);
    }


    /**
    @notice Reveals vote with choice and secret salt used in generating commitHash to attribute committed tokens
    @param _pollID Integer identifier associated with target poll
    @param _voteOption Vote choice used to generate commitHash for associated poll
    @param _salt Secret number used to generate commitHash for associated poll
    */

    function revealVote(uint _pollID, uint _voteOption, uint _voteStake, uint _salt, address _voter) external onlyRegistry {

        // Make sure the reveal period is active
        require(revealPeriodActive(_pollID));
        require(pollMap[_pollID].didCommit[_voter]);                         // make sure user has committed a vote for this poll
        require(!pollMap[_pollID].didReveal[_voter]);                        // prevent user from revealing multiple times
        require(keccak256(abi.encode(_voteOption, _voteStake, _salt)) == getCommitHash(_voter, _pollID)); // compare resultant hash from inputs to original commitHash

        //  uint numTokens = getNumTokens(msg.sender, _pollID);
        bytes32 UUID = attrUUID(_voter, _pollID);

        assert(0 == getNumTokens(_voter, _pollID));
        store.setAttribute(UUID, "numTokens", _voteStake);

        if (_voteOption == 1) {// apply numTokens to appropriate poll choice
            pollMap[_pollID].votesFor += _voteStake;
        } else {
            pollMap[_pollID].votesAgainst += _voteStake;
        }

        pollMap[_pollID].didReveal[_voter] = true;
        pollMap[_pollID].voteOptions[_voter] = _voteOption;

        emit _VoteRevealed(_pollID, _voteStake, pollMap[_pollID].votesFor, pollMap[_pollID].votesAgainst, _voteOption, _voter, _salt);
    }


    // ==================
    // POLLING INTERFACE:
    // ==================

    /**
    @dev Initiates a poll with canonical configured parameters at pollID emitted by PollCreated event
    @param _commitDuration Length of desired commit period in seconds
    @param _revealDuration Length of desired reveal period in seconds
    */
    function startPoll(uint voteQuorum, uint _commitDuration, uint _revealDuration) external onlyRegistry returns (uint pollID) {
        pollNonce = pollNonce + 1;

        uint commitEndDate = time().add(_commitDuration);
        uint revealEndDate = commitEndDate.add(_revealDuration);

        pollMap[pollNonce] = Poll({
            voteQuorum: voteQuorum,
            commitEndDate: commitEndDate,
            revealEndDate: revealEndDate,
            votesFor: 0,
            votesAgainst: 0,
            staticFees: 0
        });

        emit _PollCreated(commitEndDate, revealEndDate, pollNonce);
        return pollNonce;
    }

    /**
    @notice Determines if proposal has passed
    @dev Check if votesFor out of totalVotes exceeds votesQuorum (requires pollEnded)
    @param _pollID Integer identifier associated with target poll
    */
    function result(uint _pollID) external view returns (bool passed) {
        require(pollEnded(_pollID));

        Poll storage poll = pollMap[_pollID];
        return (100 * poll.votesFor) > (poll.voteQuorum * (poll.votesFor + poll.votesAgainst));
    }

    function getOverallStake(uint _pollId) external view returns (uint) {
        require(pollExists(_pollId));
        Poll storage poll = pollMap[_pollId];
        return poll.votesFor + poll.votesAgainst;
    }

    function isWinner(uint _pollId, address voter) external view returns (bool) {
        require(pollEnded(_pollId));
        Poll storage poll = pollMap[_pollId];

        if (!poll.didReveal[voter])
            return false;

        bool vote = poll.voteOptions[voter] == 1;

        return vote == this.result(_pollId);
    }

    function getTotalNumberOfTokensForWinningOption(uint _pollID) constant external returns (uint numTokens) {
        Poll storage poll = pollMap[_pollID];
        return this.result(_pollID) ? poll.votesFor : poll.votesAgainst;
    }

    function getStaticFees(uint _pollID) constant external returns (uint) {
        return pollMap[_pollID].staticFees;
    }

    // ----------------
    // POLLING HELPERS:
    // ----------------

    function pollInfo(uint _pollID) external view returns
        (uint commitEndDate,
        uint revealEndDate,
        uint voteQuorum,
        uint votesFor,
        uint votesAgainst,
        bool commitPeriodActive_,
        bool revealPeriodActive_)
    {
        Poll storage poll = pollMap[_pollID];
        commitEndDate = poll.commitEndDate;
        revealEndDate = poll.revealEndDate;
        voteQuorum = poll.voteQuorum;
        votesFor = poll.votesFor;
        votesAgainst = poll.votesAgainst;
        commitPeriodActive_ = commitPeriodActive(_pollID);
        revealPeriodActive_ = revealPeriodActive(_pollID);
    }

    /**
    @notice Determines if poll is over
    @dev Checks isExpired for specified poll's revealEndDate
    @return Boolean indication of whether polling period is over
    */
    function pollEnded(uint _pollID) constant public returns (bool ended) {
        require(pollExists(_pollID));

        return isExpired(pollMap[_pollID].revealEndDate);
    }

    /**
    @notice Checks if the commit period is still active for the specified poll
    @dev Checks isExpired for the specified poll's commitEndDate
    @param _pollID Integer identifier associated with target poll
    @return Boolean indication of isCommitPeriodActive for target poll
    */
    function commitPeriodActive(uint _pollID) constant public returns (bool active) {
        require(pollExists(_pollID));

        return !isExpired(pollMap[_pollID].commitEndDate);
    }

    /**
    @notice Checks if the reveal period is still active for the specified poll
    @dev Checks isExpired for the specified poll's revealEndDate
    @param _pollID Integer identifier associated with target poll
    */
    function revealPeriodActive(uint _pollID) constant public returns (bool active) {
        require(pollExists(_pollID));

        return !isExpired(pollMap[_pollID].revealEndDate) && !commitPeriodActive(_pollID);
    }

    /**
    @dev Checks if user has committed for specified poll
    @param _voter Address of user to check against
    @param _pollID Integer identifier associated with target poll
    @return Boolean indication of whether user has committed
    */
    function didCommit(address _voter, uint _pollID) constant public returns (bool committed) {
        require(pollExists(_pollID));

        return pollMap[_pollID].didCommit[_voter];
    }

    /**
    @dev Checks if user has revealed for specified poll
    @param _voter Address of user to check against
    @param _pollID Integer identifier associated with target poll
    @return Boolean indication of whether user has revealed
    */
    function didReveal(address _voter, uint _pollID) constant public returns (bool revealed) {
        require(pollExists(_pollID));

        return pollMap[_pollID].didReveal[_voter];
    }

    /**
    @dev Checks if a poll exists
    @param _pollID The pollID whose existance is to be evaluated.
    @return Boolean Indicates whether a poll exists for the provided pollID
    */
    function pollExists(uint _pollID) constant public returns (bool exists) {
        return (_pollID != 0 && _pollID <= pollNonce);
    }

    // ---------------------------
    // DOUBLE-LINKED-LIST HELPERS:
    // ---------------------------

    /**
    @dev Gets the bytes32 commitHash property of target poll
    @param _voter Address of user to check against
    @param _pollID Integer identifier associated with target poll
    @return Bytes32 hash property attached to target poll
    */
    function getCommitHash(address _voter, uint _pollID) constant public returns (bytes32 commitHash) {
        return bytes32(store.getAttribute(attrUUID(_voter, _pollID), "commitHash"));
    }

    /**
    @dev Wrapper for getAttribute with attrName="numTokens"
    @param _voter Address of user to check against
    @param _pollID Integer identifier associated with target poll
    @return Number of tokens committed to poll in sorted poll-linked-list
    */
    function getNumTokens(address _voter, uint _pollID) constant public returns (uint numTokens) {
        return store.getAttribute(attrUUID(_voter, _pollID), "numTokens");
    }





    // ----------------
    // GENERAL HELPERS:
    // ----------------

    /**
    @dev Checks if an expiration date has been reached
    @param _terminationDate Integer timestamp of date to compare current timestamp with
    @return expired Boolean indication of whether the terminationDate has passed
    */
    function isExpired(uint _terminationDate) constant public returns (bool expired) {
        return (time() > _terminationDate);
    }

    /**
    @dev Generates an identifier which associates a user and a poll together
    @param _pollID Integer identifier associated with target poll
    @return UUID Hash which is deterministic from _user and _pollID
    */
    function attrUUID(address _user, uint _pollID) public pure returns (bytes32 UUID) {
        return keccak256(abi.encode(_user, _pollID));
    }

    // ----------------
    // FOR UNIT TESTING:
    // ----------------

    function time() internal view returns (uint) {
        return now;
    }
}
