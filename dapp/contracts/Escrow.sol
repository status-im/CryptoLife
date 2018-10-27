pragma solidity ^0.4.24;
import 'openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';

contract Escrow {
    using SafeMath for uint256;
    
    uint256 usedGas = 90000; // 90000 is used gas by fundUser.
    ERC20 public tokenContract;
    mapping(address => bool) public isWhitelisted;
    address owner;

    event LogFundedUser(address _address, uint ethersAmount, uint tokensAmount, uint dateTimeStamp);
   
    modifier onlyWhiteListed() {
		require(isWhitelisted[msg.sender], "The message sender is not whitelisted");
        _;
	}

    modifier onlyOwner() {
        require(msg.sender == owner, "Unauthorized access."); 
        _;
	}
    
    constructor(address tokenAddress) public {
        isWhitelisted[msg.sender] = true;
        tokenContract = ERC20(tokenAddress); 
        owner = msg.sender;   
    }

    function fundUser(address user, uint weiAmount, uint tokenAmount) public onlyWhiteListed { 
        uint256 refundAmount = usedGas.mul(tx.gasprice);
        
        require(address(this).balance > weiAmount + refundAmount, "Insufficient Ether balance."); // usedGas * tx.gasprice = gas cost that will be refunded to the msg.sender
        require(tokenContract.balanceOf(address(this)) >= tokenAmount, "Insufficient Token balance.");
        
        user.transfer(weiAmount);
        tokenContract.transfer(user, tokenAmount);
        msg.sender.transfer(refundAmount);
        
        emit LogFundedUser(user, weiAmount, tokenAmount, now);
    }

    function withdraw() public onlyOwner {
        owner.transfer(address(this).balance);
        tokenContract.transfer(owner, tokenContract.balanceOf(address(this)));
    }

    function whitelist(address user, bool add) public onlyOwner{         
        isWhitelisted[user] = add;
    }

    function transferOwnership(address user) public onlyOwner{         
        owner = user;
        isWhitelisted[user] = true;
    }

    function () public payable {} 
}