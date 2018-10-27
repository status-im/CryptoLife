pragma solidity ^0.4.24;
import 'openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/MintableToken.sol';

contract Token is StandardToken {
    string public constant name = "Dai Stablecoin";
    string public constant symbol = "DAI";
    uint8 public constant decimals = 18;
    uint256 public constant INITIAL_SUPPLY = 100000 * (10 ** uint256(decimals));

    constructor() public {
        totalSupply_ = INITIAL_SUPPLY;
        balances[msg.sender] = INITIAL_SUPPLY;
        emit Transfer(0x0, msg.sender, INITIAL_SUPPLY);
    }
}