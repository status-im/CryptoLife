pragma solidity ^0.4.24;

interface IVoting {

    function pollEnded(uint _pollID) constant external returns (bool ended);

    function result(uint _pollID) constant external returns (bool passed);

    function isWinner(uint _pollId, address voter) external view returns (bool);

    function getOverallStake(uint _pollId) external view returns (uint);

    function getNumTokens(address _voter, uint _pollID) constant external returns (uint numTokens);

    function getTotalNumberOfTokensForWinningOption(uint _pollID) constant external returns (uint numTokens);

    function getStaticFees(uint _pollID) constant external returns (uint);

    function pollInfo(uint _pollID) external view returns
        (uint commitEndDate,
        uint revealEndDate,
        uint voteQuorum,
        uint votesFor,
        uint votesAgainst,
        bool commitPeriodActive,
        bool revealPeriodActive);

    /**
    @dev Initiates a poll with canonical configured parameters at pollID emitted by PollCreated event
    @param _itemId - item for voting
    @param _commitDuration Length of desired commit period in seconds
    @param _revealDuration Length of desired reveal period in seconds
    */
    function startPoll(uint _itemId, uint _commitDuration, uint _revealDuration) external returns (uint pollID);

    /**
    @notice Commits vote using hash of choice and secret salt to conceal vote until reveal
    @param _pollID Integer identifier associated with target poll
    @param _secretHash Commit keccak256 hash of voter's choice and salt (tightly packed in this order)
    */
    function commitVote(uint _pollID, bytes32 _secretHash, address voter, uint _staticFee) external;

    /**
    @notice Reveals vote with choice and secret salt used in generating commitHash to attribute committed tokens
    @param _pollID Integer identifier associated with target poll
    @param _voteOption Vote choice used to generate commitHash for associated poll. 0 - down, 1 - up
    @param _salt Secret number used to generate commitHash for associated poll
    */
    function revealVote(uint _pollID, uint _voteOption, uint _voteStake, uint _salt, address _voter) external;
}
