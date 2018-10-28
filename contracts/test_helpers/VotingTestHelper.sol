pragma solidity ^0.4.24;

import "../Voting.sol";

contract VotingTestHelper is Voting {

    function time() internal view returns (uint) {
        return m_time;
    }

    function setTime(uint time_) external {
        m_time = time_;
    }

    uint m_time;
}
