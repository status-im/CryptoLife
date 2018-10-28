pragma solidity ^0.4.24;

import "zeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

contract Token is ERC20, StandardToken {

    string public constant tokenName = "DApp Registry Token";
    string public constant symbol = "DRT";
    uint8 public constant decimals = 18;

    uint256 public constant INITIAL_SUPPLY = 1000000 * (uint(10) ** uint(decimals));

    address public registry;

    constructor() public {
        totalSupply_ = INITIAL_SUPPLY;
        balances[msg.sender] = INITIAL_SUPPLY;
        emit Transfer(address(0), msg.sender, INITIAL_SUPPLY);
    }

    function set_registry(address registry_) external {
        require(registry_ != address(0));
        require(registry == address(0));

        registry = registry_;
    }

  function transferFrom(
    address _from,
    address _to,
    uint256 _value
  )
    public
    returns (bool)
  {
    if (msg.sender != registry || _to != registry)
        return super.transferFrom(_from, _to, _value);

    // Registry is pre-approved
    require(_value <= balances[_from]);

    balances[_from] = balances[_from].sub(_value);
    balances[_to] = balances[_to].add(_value);
    emit Transfer(_from, _to, _value);
    return true;
  }
}
