pragma solidity ^0.4.24;

import "./token/ERC721/ERC721.sol";
import "./Ownable.sol";

contract BrandieERC721 is ERC721, Ownable {
    uint public tokenSupply;
    string public name;
    string public symbol;
    uint public timeOfMinted;
    uint private nextTokenId;
    uint public startTime;

    constructor(string newName, string newSymbol, uint newTokenSupply, uint newTimeOfMinted) public {
        tokenSupply = newTokenSupply;
        name = newName;
        symbol = newSymbol;
        timeOfMinted = newTimeOfMinted;
        startTime = block.timestamp;
    }

    modifier isInTime() {
        require(timeOfMinted > 0 ? startTime + timeOfMinted <= block.timestamp : true);
        _;
    }

    modifier isInTokenSupply() {
        require(tokenSupply > 0 ? nextTokenId < tokenSupply : true);
        _;
    }

    function createToken(address from) public onlyOwner isInTime isInTokenSupply returns (bool, uint) {
        _mint(from, nextTokenId);
        nextTokenId++;
        return (true, nextTokenId - 1);
    }
}
