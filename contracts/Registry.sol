pragma solidity ^0.4.24;

import "./IRegistry.sol";
import "./Parameterizer.sol";
import "./IVoting.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "zeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract Registry is IRegistry {

    // ------
    // EVENTS
    // ------

    event _Application(bytes32 indexed listingHash, uint deposit, uint appEndDate, bytes ipfs_hash, address indexed applicant);
    event _EditApplication(bytes32 indexed listingHash, uint deposit, uint appEndDate, bytes ipfs_hash, address indexed applicant);
    event _Challenge(bytes32 indexed listingHash, uint challengeID, uint commitEndDate, uint revealEndDate, address indexed challenger);
    event _Deposit(bytes32 indexed listingHash, uint added, uint newTotal, address indexed owner);
    event _Withdrawal(bytes32 indexed listingHash, uint withdrew, uint newTotal, address indexed owner);
    event _ApplicationWhitelisted(bytes32 indexed listingHash);
    event _EditApplicationWhitelisted(bytes32 indexed listingHash);
    event _ApplicationRemoved(bytes32 indexed listingHash);
    event _ListingRemoved(bytes32 indexed listingHash);
    event _ListingWithdrawn(bytes32 indexed listingHash, address indexed owner);
    event _TouchAndRemoved(bytes32 indexed listingHash);
    event _ChallengeFailed(bytes32 indexed listingHash, uint indexed challengeID, uint rewardPool, uint totalTokens);
    event _ChallengeSucceeded(bytes32 indexed listingHash, uint indexed challengeID, uint rewardPool, uint totalTokens);
    event _RewardClaimed(uint indexed challengeID, uint reward, address indexed voter);
    event _ExitInitialized(bytes32 indexed listingHash, uint exitTime, uint exitDelayEndDate, address indexed owner);
    event _StateChanged(bytes32 indexed listing_id, DAppState new_state);

    // ============
    // DATA STRUCTURES:
    // ============

    enum DAppState {
        // registry does not know about the dapp
        NOT_EXISTS,

        // application for inclusion to the registry is in progress
        APPLICATION,

        // dapp exists in the registry
        EXISTS,

        // application for edit of registry dapp is in progress
        EDIT,

        // submitter is calling of the dapp
        DELETING
    }

    using SafeMath for uint;

    struct Listing {
        uint ids_position;
        bytes ipfs_hash;
        address owner;          // Owner of Listing

        DAppState state;

        uint applicationExpiry; // Expiration date of apply stage

        bytes proposed_ipfs_hash;
        address proposal_author;

        uint challengeID;       // Corresponds to a PollID in Voting

        uint exitTime;          // Time the listing may leave the registry
        uint exitTimeExpiry;    // Expiration date of exit period
    }

    struct Challenge {
        uint rewardPool;        // (remaining) Pool of tokens to be distributed to winning voters
        address challenger;     // Owner of Challenge
        bool resolved;          // Indication of if challenge is resolved
        uint totalTokens;       // (remaining) Number of tokens used in voting by the winning side
        mapping(address => bool) tokenClaims; // Indicates whether a voter has claimed a reward yet
    }

    // ============
    // MODIFIERS:
    // ============

    modifier requiresState(bytes32 listing_id, Registry.DAppState state) {
        require(dappState(listing_id) == state);
        _;
    }

    modifier notChallenged(bytes32 listing_id) {
        require(!challengeExists(listing_id));
        _;
    }

    modifier isChallenged(bytes32 listing_id) {
        require(challengeExists(listing_id));
        _;
    }

    // ============
    // GLOBAL STATE:
    // ============

    // Maps challengeIDs to associated challenge data
    mapping(uint => Challenge) public challenges;

    // Maps listingHashes to associated listingHash data
    mapping(bytes32 => Listing) public listings;

    bytes32[] public ids;

    // Global Variables
    ERC20 public token;
    IVoting public voting;
    Parameterizer public parameterizer;

    uint nonce;


    function Registry(address _token, address _voting, address _parameterizer) public {
        require(_token != 0 && address(token) == 0);
        require(_voting != 0 && address(voting) == 0);
        require(_parameterizer != 0 && address(parameterizer) == 0);

        token = ERC20(_token);
        voting = IVoting(_voting);
        parameterizer = Parameterizer(_parameterizer);
    }

    // --------------------
    // PUBLISHER INTERFACE:
    // --------------------

    function apply(bytes ipfs_hash) external {
        bytes32 listing_id = keccak256(abi.encode(++nonce));
        assert(dappState(listing_id) == DAppState.NOT_EXISTS);

        // Sets owner
        Listing storage listing = listings[listing_id];
        listing.ipfs_hash = ipfs_hash;
        listing.owner = msg.sender;

        // Sets apply stage end time
        listing.applicationExpiry = time().add(parameterizer.get("applyStageLen"));

        // Transfers tokens from user to Registry contract
        require(token.transferFrom(listing.owner, this, this.deposit_size()));

        // ids <-> listings linkage
        listing.ids_position = ids.length;
        ids.push(listing_id);

        changeState(listing_id, DAppState.APPLICATION);
        emit _Application(listing_id, this.deposit_size(), listing.applicationExpiry, ipfs_hash, msg.sender);
    }

    function edit(bytes32 listing_id, bytes new_ipfs_hash)
        external
        requiresState(listing_id, DAppState.EXISTS)
        notChallenged(listing_id)
    {
        checkDAppInvariant(listing_id);
        Listing storage listing = listings[listing_id];

        // Sets proposal
        listing.proposed_ipfs_hash = new_ipfs_hash;
        listing.proposal_author = msg.sender;

        // Sets apply stage end time
        listing.applicationExpiry = time().add(parameterizer.get("applyStageLen"));

        // Transfers tokens from user to Registry contract
        // locking extra deposit even in case proposal_author == owner: he has to back his new proposal
        require(token.transferFrom(listing.proposal_author, this, this.deposit_size()));

        changeState(listing_id, DAppState.EDIT);
        emit _EditApplication(listing_id, this.deposit_size(), listing.applicationExpiry, new_ipfs_hash, msg.sender);
    }

    function init_exit(bytes32 listing_id)
        external
        requiresState(listing_id, DAppState.EXISTS)
        notChallenged(listing_id)
    {
        checkDAppInvariant(listing_id);
        Listing storage listing = listings[listing_id];

        require(msg.sender == listing.owner);

        // Set when the listing may be removed from the whitelist
        listing.exitTime = time().add(parameterizer.get("exitTimeDelay"));
        // Set exit period end time
        listing.exitTimeExpiry = listing.exitTime.add(parameterizer.get("exitPeriodLen"));
        changeState(listing_id, DAppState.DELETING);

        emit _ExitInitialized(listing_id, listing.exitTime, listing.exitTimeExpiry, msg.sender);
    }

    // -----------------------
    // VIEW:
    // -----------------------

    function deposit_size() external view returns (uint) {
        return parameterizer.get("minDeposit");
    }

    function list() external view returns (bytes32[]) {
        return ids;
    }

    function get_info(bytes32 listing_id) external view returns
            (uint state, bool is_challenged /* many states can be challenged */,
            bool status_can_be_updated /* if update_status should be called */,
            bytes ipfs_hash, bytes proposed_ipfs_hash /* empty if not editing */) {
        checkDAppInvariant(listing_id);

        state = uint(dappState(listing_id));
        is_challenged = challengeExists(listing_id);
        status_can_be_updated = this.can_update_status(listing_id);
        ipfs_hash = listings[listing_id].ipfs_hash;
        proposed_ipfs_hash = listings[listing_id].proposed_ipfs_hash;
    }

    // -----------------------
    // MAINTENANCE:
    // -----------------------

    function can_update_status(bytes32 listing_id) external view returns (bool) {
        checkDAppInvariant(listing_id);
        DAppState state = dappState(listing_id);
        Listing storage listing = listings[listing_id];

        if (challengeExists(listing_id) && challengeCanBeResolved(listing_id))
            return true;

        if (state == DAppState.APPLICATION) {
            if (listing.applicationExpiry < time() && !challengeExists(listing_id))
                return true;
        }
        else if (state == DAppState.DELETING) {
            if (msg.sender == listing.owner &&
                    listing.exitTime < time() && time() < listing.exitTimeExpiry)
                return true;
            if (msg.sender == listing.owner && time() >= listing.exitTimeExpiry)
                return true;
        }
        else if (state == DAppState.EXISTS) {
            // FIXME FIXME finish challenge?
            return false;
        }
        else if (state == DAppState.EDIT) {
            if (listing.applicationExpiry < time() && !challengeExists(listing_id))
                return true;
        }
        else {
            // FIXME FIXME more states
            assert(state == DAppState.NOT_EXISTS);
            return false;
        }

        return false;
    }

    // finish current operation
    function update_status(bytes32 listing_id) external {
        checkDAppInvariant(listing_id);
        DAppState state = dappState(listing_id);
        Listing storage listing = listings[listing_id];

        bool process_challenge = challengeExists(listing_id) && challengeCanBeResolved(listing_id);
        uint challengeID = process_challenge ? listings[listing_id].challengeID : 0;
        bool challenger_won;
        uint reward;

        if (state == DAppState.APPLICATION) {
            if (listing.applicationExpiry < time() && !challengeExists(listing_id)) {
                whitelistApplication(listing_id);
                return;
            }

            if (process_challenge) {
                (challenger_won, reward) = resolveChallenge(listing_id);
                if (!challenger_won) {
                    whitelistApplication(listing_id);
                    // transfer of reward, but minimal deposit must remain stacked
                    token.transfer(listing.owner, reward.sub(this.deposit_size()));
                }
                else {
                    resetListing(listing_id, false);
                    // Transfer the reward to the challenger
                    require(token.transfer(challenges[challengeID].challenger, reward));
                }
                return;
            }
        }
        else if (state == DAppState.DELETING) {
            if (msg.sender == listing.owner &&
                    listing.exitTime < time() && time() < listing.exitTimeExpiry) {
                resetListing(listing_id, true);
                emit _ListingWithdrawn(listing_id, msg.sender);
                return;
            }
            if (msg.sender == listing.owner && time() >= listing.exitTimeExpiry) {
                listing.exitTime = 0;
                listing.exitTimeExpiry = 0;
                changeState(listing_id, DAppState.EXISTS);
                return;
            }
        }
        else if (state == DAppState.EDIT) {
            if (listing.applicationExpiry < time() && !challengeExists(listing_id)) {
                whitelistEditProposal(listing_id);
                return;
            }

            if (process_challenge) {
                (challenger_won, reward) = resolveChallenge(listing_id);
                if (!challenger_won) {
                    // transfer of reward, but proposal deposit must remain stacked
                    token.transfer(listing.proposal_author, reward.sub(this.deposit_size()));
                    whitelistEditProposal(listing_id);
                }
                else {
                    // Transfer the reward to the challenger
                    require(token.transfer(challenges[challengeID].challenger, reward));
                    delete listing.proposal_author;
                    delete listing.proposed_ipfs_hash;
                    listings[listing_id].applicationExpiry = 0;
                    changeState(listing_id, DAppState.EXISTS);
                }
                return;
            }
        }
        else if (state == DAppState.EXISTS) {
            if (process_challenge) {
                (challenger_won, reward) = resolveChallenge(listing_id);
                if (!challenger_won) {
                    // transfer of reward, but minimal deposit must remain stacked
                    token.transfer(listing.owner, reward.sub(this.deposit_size()));
                }
                else {
                    resetListing(listing_id, false);
                    // Transfer the reward to the challenger
                    require(token.transfer(challenges[challengeID].challenger, reward));
                }
                return;
            }
        }
        else {
            assert(state == DAppState.NOT_EXISTS);
        }

        revert();
    }

    // -----------------------
    // TOKEN HOLDER INTERFACE:
    // -----------------------

    function challenge(bytes32 listing_id, uint state_check /* pass state seen by you to prevent race condition */)
        external
        notChallenged(listing_id)
    {
        checkDAppInvariant(listing_id);
        DAppState state = dappState(listing_id);
        Listing storage listing = listings[listing_id];

        require(state == DAppState(state_check));
        require(state == DAppState.APPLICATION || state == DAppState.EXISTS || state == DAppState.EDIT);

        // Starts poll
        uint pollID = voting.startPoll(
            parameterizer.get("voteQuorum"),
            parameterizer.get("commitStageLen"),
            parameterizer.get("revealStageLen")
        );

        challenges[pollID] = Challenge({
            challenger: msg.sender,
            rewardPool: ((uint(100).sub(parameterizer.get("dispensationPct"))).mul(this.deposit_size())).div(100),
            resolved: false,
            totalTokens: 0
        });

        // Updates listingHash to store most recent challenge
        listing.challengeID = pollID;

        // Takes tokens from challenger
        require(token.transferFrom(msg.sender, this, this.deposit_size()));

        (uint commitEndDate, uint revealEndDate,,,,,) = voting.pollInfo(pollID);

        emit _Challenge(listing_id, pollID, commitEndDate, revealEndDate, msg.sender);
    }

    function challenge_status(bytes32 listing_id)
        external
        view
        isChallenged(listing_id)
        returns
            (uint challenge_id, bool is_commit, bool is_reveal, uint votesFor /* 0 for commit phase */,
            uint votesAgainst /* 0 for commit phase */,
            uint commitEndDate, uint revealEndDate)
    {
        checkDAppInvariant(listing_id);

        challenge_id = listings[listing_id].challengeID;
        (commitEndDate,
        revealEndDate,
        ,
        votesFor,
        votesAgainst,
        is_commit,
        is_reveal) = voting.pollInfo(challenge_id);
    }

    function commit_vote(bytes32 listing_id, bytes32 secret_hash)
        external
        isChallenged(listing_id)
    {
        checkDAppInvariant(listing_id);
        require(token.transferFrom(msg.sender, this, this.deposit_size()));
        voting.commitVote(listings[listing_id].challengeID, secret_hash, msg.sender, this.deposit_size());
    }

    function reveal_vote(bytes32 listing_id, uint vote_option /* 1: for, other: against */, uint vote_stake, uint salt)
        external
        isChallenged(listing_id)
    {
        checkDAppInvariant(listing_id);
        require(token.transferFrom(msg.sender, this, vote_stake));
        voting.revealVote(listings[listing_id].challengeID, vote_option, vote_stake, salt, msg.sender);
    }

    // ----------------
    // TOKEN FUNCTIONS:
    // ----------------

    function claim_reward(uint challenge_id) external {
        Challenge storage challengeInstance = challenges[challenge_id];
        require(challengeInstance.resolved == true);
        require(challengeInstance.tokenClaims[msg.sender] == false);

        (uint reward, uint voterTokens) = voterReward(msg.sender, challenge_id);

        // Ensures a voter cannot claim tokens again
        challengeInstance.tokenClaims[msg.sender] = true;

        // Subtracts the voter's information to preserve the participation ratios
        // of other voters compared to the remaining pool of rewards
        challengeInstance.totalTokens = challengeInstance.totalTokens.sub(voterTokens);
        challengeInstance.rewardPool = challengeInstance.rewardPool.sub(reward);

        require(token.transfer(msg.sender, reward));

        emit _RewardClaimed(challenge_id, reward, msg.sender);
    }

    // --------
    // GETTERS:
    // --------

    function voterReward(address _voter, uint _challengeID)
        public
        view
        returns (uint reward, uint voterTokens)
    {
        Challenge storage challengeInstance = challenges[_challengeID];
        require(voting.isWinner(_challengeID, _voter));

        voterTokens = voting.getNumTokens(_voter, _challengeID);
        assert(voterTokens <= challengeInstance.totalTokens);

        reward = voterTokens.mul(challengeInstance.rewardPool).div(challengeInstance.totalTokens);
        assert(reward >= voterTokens);
    }

    /**
    @dev                Returns true if the application/listingHash has an unresolved challenge
    @param listing_id The listingHash whose status is to be examined
    */
    function challengeExists(bytes32 listing_id) view public returns (bool) {
        return listings[listing_id].challengeID > 0;
    }

    /**
    @dev                Determines whether voting has concluded in a challenge for a given
                        listingHash. Throws if no challenge exists.
    @param listing_id A listingHash with an unresolved challenge
    */
    function challengeCanBeResolved(bytes32 listing_id)
        public
        view
        isChallenged(listing_id)
        returns (bool)
    {
        uint challengeID = listings[listing_id].challengeID;
        return voting.pollEnded(challengeID);
    }

    /**
    @dev                Determines the number of tokens awarded to the winning party in a challenge.
                        This reward is for author or challenger only. For other voter rewards see claim_reward.
                        Reward is: (winner's full stake) + (dispensationPct * loser's stake).
    @param _challengeID The challengeID to determine a reward for
    */
    function determineReward(uint _challengeID) private view returns (uint) {
        // Edge case, nobody voted, give all tokens to the winner.
        if (voting.getTotalNumberOfTokensForWinningOption(_challengeID) == 0) {
            return 2 * this.deposit_size();
        }

        return (2 * this.deposit_size()).sub(challenges[_challengeID].rewardPool);
    }

    /**
    @dev                Getter for Challenge tokenClaims mappings
    @param _challengeID The challengeID to query
    @param _voter       The voter whose claim status to query for the provided challengeID
    */
    function tokenClaims(uint _challengeID, address _voter) external view returns (bool) {
        return challenges[_challengeID].tokenClaims[_voter];
    }

    // ----------------
    // PRIVATE FUNCTIONS:
    // ----------------

    /**
    @dev                Determines the winner in a challenge. Rewards the winner tokens and
                        either whitelists or de-whitelists the listingHash.
    @param listing_id A listingHash with a challenge that is to be resolved
    */
    function resolveChallenge(bytes32 listing_id) private returns (bool challenger_won, uint reward) {
        uint challengeID = listings[listing_id].challengeID;

        // Calculates the winner's reward,
        reward = determineReward(challengeID);

        // Sets flag on challenge being processed
        challenges[challengeID].resolved = true;
        listings[listing_id].challengeID = 0;

        // Stores the total tokens used for voting by the winning side for reward purposes
        challenges[challengeID].totalTokens =
            voting.getTotalNumberOfTokensForWinningOption(challengeID);

        // stakes of voters that chose the wrong side are slashed!
        // also here we are returning winners stake as rewards
        challenges[challengeID].rewardPool += voting.getOverallStake(challengeID);
        challenges[challengeID].rewardPool += voting.getStaticFees(challengeID);

        challenger_won = !voting.result(challengeID);

        if (!challenger_won) {
            emit _ChallengeFailed(listing_id, challengeID, challenges[challengeID].rewardPool, challenges[challengeID].totalTokens);
        }
        // Case: challenge succeeded or nobody voted
        else {
            emit _ChallengeSucceeded(listing_id, challengeID, challenges[challengeID].rewardPool, challenges[challengeID].totalTokens);
        }
    }

    /**
    @dev                Called by updateStatus() if the applicationExpiry date passed without a
                        challenge being made. Called by resolveChallenge() if an
                        application/listing beat a challenge.
    @param listing_id The listingHash of an application/listingHash to be whitelisted
    */
    function whitelistApplication(bytes32 listing_id) private {
        listings[listing_id].applicationExpiry = 0;
        changeState(listing_id, DAppState.EXISTS);
        emit _ApplicationWhitelisted(listing_id);
    }

    function whitelistEditProposal(bytes32 listing_id) private {
        Listing storage listing = listings[listing_id];

        // changing owner - freeing deposit
        require(token.transfer(listing.owner, this.deposit_size()));
        listing.owner = listing.proposal_author;
        delete listing.proposal_author;

        listing.ipfs_hash = listing.proposed_ipfs_hash;
        delete listing.proposed_ipfs_hash;

        listings[listing_id].applicationExpiry = 0;
        changeState(listing_id, DAppState.EXISTS);
        emit _EditApplicationWhitelisted(listing_id);
    }

    /**
    @dev                Deletes a listingHash from the whitelist and transfers tokens back to owner
    @param listing_id The listing hash to delete
    */
    function resetListing(bytes32 listing_id, bool refund_owner) private {
        Listing storage listing = listings[listing_id];
        DAppState state_was = dappState(listing_id);

        // Deleting listing to prevent reentry
        address owner = listing.owner;
        assert(owner != address(0));
        listing.owner = address(0);

        // ids <-> listings linkage
        uint removed_position = listings[listing_id].ids_position;
        assert(removed_position < ids.length);
        if (removed_position != ids.length - 1) {
            listings[ids[ids.length - 1]].ids_position = removed_position;
            ids[removed_position] = ids[ids.length - 1];
        }
        ids[ids.length - 1] = bytes32(0);
        ids.length--;

        delete listings[listing_id];    // resetting everything
        listing.state = state_was;      // except state
        changeState(listing_id, DAppState.NOT_EXISTS);

        // Transfers any remaining balance back to the owner
        if (refund_owner) {
            require(token.transfer(owner, this.deposit_size()));
        }

        if (DAppState.APPLICATION == state_was) {
            emit _ApplicationRemoved(listing_id);
        } else {
            emit _ListingRemoved(listing_id);
        }
    }

    // ----------------
    // STATE & INVARIANTS:
    // ----------------

    function dappState(bytes32 listing_id) internal view returns (Registry.DAppState) {
        return listings[listing_id].state;
    }

    function checkDAppInvariant(bytes32 listing_id) internal view {
        Listing storage listing = listings[listing_id];

        assert((listing.state == DAppState.NOT_EXISTS) == (listing.owner == address(0)));
        assert((listing.state == DAppState.APPLICATION || listing.state == DAppState.EDIT)
                == (listing.applicationExpiry != 0));

        assert((listing.state == DAppState.DELETING) == (listing.exitTime != 0));
        assert((listing.state == DAppState.DELETING) == (listing.exitTimeExpiry != 0));

        assert((listing.state == DAppState.EDIT) == (listing.proposed_ipfs_hash.length != 0));
        assert((listing.state == DAppState.EDIT) == (listing.proposal_author != address(0)));

        if (listing.state == DAppState.DELETING || listing.state == DAppState.NOT_EXISTS)
            assert(!challengeExists(listing_id));

        if (listing.state != DAppState.NOT_EXISTS) {
            assert(listing.ids_position < ids.length);
            assert(ids[listing.ids_position] == listing_id);
        }
    }

    function changeState(bytes32 listing_id, DAppState new_state) internal {
        DAppState state = dappState(listing_id);
        assert(state != new_state);

        if (DAppState.NOT_EXISTS == state) {    assert(DAppState.APPLICATION == new_state); }
        else if (DAppState.APPLICATION == state) {    assert(DAppState.EXISTS == new_state || DAppState.NOT_EXISTS == new_state); }
        else if (DAppState.EXISTS == state) {   assert(DAppState.EDIT == new_state || DAppState.DELETING == new_state || DAppState.NOT_EXISTS == new_state); }
        else if (DAppState.EDIT == state) {     assert(DAppState.EXISTS == new_state); }
        else if (DAppState.DELETING == state) { assert(DAppState.NOT_EXISTS == new_state || DAppState.EXISTS == new_state); }
        else assert(false);

        listings[listing_id].state = new_state;
        emit _StateChanged(listing_id, new_state);
        checkDAppInvariant(listing_id);
    }

    // ----------------
    // FOR UNIT TESTING:
    // ----------------

    function time() internal view returns (uint) {
        return now;
    }
}
