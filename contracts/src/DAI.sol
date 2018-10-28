pragma solidity ^0.4.24;

import "./erc20/ERC20.sol";
import "./BytesUtil.sol";

contract DAI is ERC20{
    string public constant symbol = "DAI";
    string public constant name = "DAI";
    uint8 public constant decimals = 18;
    uint256 _totalSupply = 1000000000000000000000000000000;
    
    mapping(address => uint256) balances;
    mapping(address => mapping (address => uint256)) allowed;

    address public owner;
    modifier onlyOwner() {
        if (msg.sender != owner) {
            require(msg.sender == owner);
        }
        _;
    }

    constructor() public {
        owner = msg.sender;
        balances[owner] = _totalSupply;
    }

    function totalSupply() external constant returns (uint256){
        return _totalSupply;
    }
 
    function balanceOf(address _owner) external constant returns (uint256 balance){
        return balances[_owner];
    }

    function transferWithAlsoETH(address _to, uint256 _value) external payable returns (bool success){
        require(transfer(_to, _value), "failed to transfer DAI");
        _to.transfer(msg.value);
        return true;
    }
 
    function transfer(address _to, uint256 _value) public returns (bool success){
        if (balances[msg.sender] >= _value 
            && _value > 0
            && balances[_to] + _value > balances[_to]) {
            balances[msg.sender] -= _value;
            balances[_to] += _value;
            emit Transfer(msg.sender, _to, _value);
            return true;
        } else {
            return false;
        }
    }

    function approveAndCall(uint256 _amount, address _target, bytes _data) public payable {
        if(approve(_target, _amount)){
            require(_target.call.value(msg.value)(BytesUtil.overrideFirst32BytesWithAddress(_data, msg.sender)), "Something went wrong with the extra call.");
        }
    }
 
    function transferFrom(address _from, address _to, uint256 _value) external returns (bool success){
        if (balances[_from] >= _value
            && allowed[_from][msg.sender] >= _value
            && _value > 0
            && balances[_to] + _value > balances[_to]) {
            balances[_from] -= _value;
            allowed[_from][msg.sender] -= _value;
            balances[_to] += _value;
            emit Transfer(_from, _to, _value);
            return true;
        } else {
            return false;
        }
    }
 
    function approve(address _spender, uint256 _value) public returns (bool success){
        //TODO ensure zero first ?
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
 
    function allowance(address _owner, address _spender) external constant returns (uint256 remaining){
        return allowed[_owner][_spender];
    }


}