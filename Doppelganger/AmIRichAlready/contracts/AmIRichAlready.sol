pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

contract AmIRichAlready {
    IERC20 private tokenContract;
    address private wallet;
    uint private constant RICHNES = 1000000 * 10 ** 18;

    constructor (IERC20 _tokenContract, address _wallet) public {
        tokenContract = _tokenContract;
        wallet = _wallet;
    }

    function check() public view returns(bool) {
        uint balance = tokenContract.balanceOf(wallet);
        return balance > RICHNES;
    }
}
