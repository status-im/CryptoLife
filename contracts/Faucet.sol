pragma solidity ^0.4.24;

import 'zeppelin-solidity/contracts/token/ERC20/StandardToken.sol';
import 'zeppelin-solidity/contracts/math/SafeMath.sol';


contract Faucet {
    using SafeMath for uint;

    event FaucetSended(
        address receiver,
        uint amount
    );

    StandardToken token;
    uint256 public faucetSize;

    constructor(uint256 _faucetSize) public {
        faucetSize = _faucetSize;
    }

    function getBalance()
        view
        public
        returns (uint)
    {
        return token.balanceOf(this);
    }

    function faucet()
        public
    {
        require(faucetSize <= getBalance(), "faucet balance not enough");

        require(token.transfer(msg.sender, faucetSize));
        emit FaucetSended(msg.sender, faucetSize);
    }
}
