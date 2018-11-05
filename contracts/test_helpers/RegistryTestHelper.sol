pragma solidity ^0.4.24;

import "../Registry.sol";

contract RegistryTestHelper is Registry {

    constructor(address _token, address _voting, address _parameterizer) public
        Registry(_token, _voting, _parameterizer) {
    }

    function time() internal view returns (uint) {
        return m_time;
    }

    function setTime(uint time_) external {
        m_time = time_;
    }

    uint m_time;
}
