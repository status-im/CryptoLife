pragma solidity 0.4.25;
import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";


contract DAIToken is StandardToken {
    string public constant NAME = "Dai Stablecoin";
    string public constant SYMBOL = "DAI";
    uint8 public constant DECIMALS = 18;
    uint256 public constant INITIAL_SUPPLY = 100000 * (10 ** uint256(DECIMALS));

    constructor() public {
        totalSupply_ = INITIAL_SUPPLY;
        balances[msg.sender] = INITIAL_SUPPLY;
        emit Transfer(0x0, msg.sender, INITIAL_SUPPLY);
    }
}