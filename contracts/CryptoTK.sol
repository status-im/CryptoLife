pragma solidity ^0.4.24;

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol';
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract CryptoTK is ERC721Full, Ownable {

    event EthDeposited(uint amount);


    
    // Mapping from token ID to the creator's address
    mapping(uint256 => address) private tokenCreator;
  
    // Mapping from token ID to the metadata uri
    mapping(uint256 => string) private tokenToURI;
    
    // Mapping from metadata uri to the token ID
    mapping(string => uint256) private uriOriginalToken;
    
    // dynamic size later  
    uint256[] vUp = new uint64[] (55);

    mapping(uint256 => uint256) public vDown;

    // Mapping from token ID to whether the token has been sold before.
    mapping(uint256 => bool) private tokenSold;


    constructor() ERC721Full("CryptoTeka NFT Token", "CRTK") public {
    }

    function addNewToken(string _uri) public uniqueURI(_uri)  {
        uint256 newId = createToken(_uri, msg.sender);
        uriOriginalToken[_uri] = newId;
    }

    function createToken(string _uri, address _creator) private  returns (uint256){
      uint256 newId = totalSupply() + 1;
      _mint(_creator, newId);
      tokenCreator[newId] = _creator;
      tokenToURI[newId] = _uri;
      return newId;
    }

    function voteUp(uint256 _tokenId) public {
	  vUp[_tokenId] = vUp[_tokenId] + 1;
    }
    
    function voteDown(uint256 _tokenId) public {
	  vDown[_tokenId] = vDown[_tokenId] + 1;
    }
    
    function voteReset() public {
	 for(uint i=0; i < vUp.length; i++) {
	  	vUp[i] = 0;
	 }
    }

    function getVoteDown(uint256 _tokenId) public view returns (uint256){
	  return vDown[_tokenId];
    }
    
    function getVoteUp(uint256 _tokenId) public view returns (uint256){
	  return vUp[_tokenId];
    }

    function deposit() public payable  {
        emit EthDeposited(msg.value);
    }

    function songPlayed(uint256 _tokenId)  public {
	  // require sender to be the owner of the contract
	  address creator = creatorOfToken(_tokenId);
	  vUp[_tokenId] = 0 ;
	  vDown[_tokenId] = 0 ;
          creator.transfer(1e6);
    }
    
    struct for_sort {
      uint id;
      uint votes;
    }

    function sort() public view  returns (uint256, uint256, uint256, uint256) {
	for_sort[] memory data = new for_sort[](55);

	for(uint i=0;i<vUp.length;i++) {
	  data[i] = for_sort({id:i, votes:vUp[i]});
	}

	// Bubble sort. L33t.
	for(i = 0; i < vUp.length-1; i++) {
	    for(uint j = i+1; j < vUp.length ; j++) {
		   if(data[i].votes < data[j].votes)  {
		     for_sort memory temp = data[j];
		     data[j] = data[i];
		     data[i] = temp;
		  }
	    }
	}
	// will break if have less than four
	return (data[0].id, data[1].id, data[2].id, data[3].id);
    }


    // NFTS 
    modifier uniqueURI(string _uri) {
        require(uriOriginalToken[_uri] == 0);
        _;
    }

    modifier notOwnerOf(uint256 _tokenId) {
        require(ownerOf(_tokenId) != msg.sender);
        _;
    }

    function transfer(address _to, uint256 _tokenId) public {
        tokenSold[_tokenId] = true;
        transferFrom(msg.sender, _to, _tokenId);
    }

    function tokenURI(uint256 _tokenId) view returns (string) {
        ownerOf(_tokenId);
        return tokenToURI[_tokenId];
    }

    function originalTokenOfUri(string _uri) public view returns (uint256) {
        uint256 tokenId = uriOriginalToken[_uri];
        ownerOf(tokenId);
        return tokenId;
    }

    function creatorOfToken(uint256 _tokenId) public view returns (address) {
        return tokenCreator[_tokenId];
    }

    
    
}


