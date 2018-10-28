pragma solidity ^0.4.24;

import "./BrandieERC721.sol";
import "./Ownable.sol";
import "./ECVerify.sol";

contract BrandiePlatform is Ownable {

    struct Company {
        string name;
        bool active;
        address owner;
        string website;
    }

    event TokenCreated(string companyName, address tokenAddress, string tokenName);
    event CompanyRegistred(string companyName, address companyOwner, string companyWebsite);
    event TokenGenerated(string tokenName, address to, uint uniqueNumber);

    mapping (address => bytes32[]) private ownersToCompanies;
    mapping (bytes32 => Company) public companies;
    mapping (bytes32 => address[]) private listOfTokensByCompany;
    mapping (bytes32 => bool) private tokenExists;
    mapping (address => address[]) private addresses;

    constructor() public {
    
    }

    function registerCompany(string companyName, string companyWebsite) public {
        require(isCompanyNameAvailable(companyName), "Name is not available");
        bytes32 companyIndex = keccak256(abi.encodePacked(companyName));
        companies[companyIndex] = Company({
            name: companyName,
            active: true,
            owner: msg.sender,
            website: companyWebsite
        });
        ownersToCompanies[msg.sender].push(companyIndex);
        emit CompanyRegistred(companyName, msg.sender, companyWebsite);
    }

    function isCompanyNameAvailable(string companyName) public view returns (bool) {
        bytes32 companyIndex = keccak256(abi.encodePacked(companyName));
        return !companies[companyIndex].active;
    }

    function isTokenNameAvailable(string tokenName) public view returns (bool) {
        bytes32 tokenIndex = keccak256(abi.encodePacked(tokenName));
        return !tokenExists[tokenIndex];
    }

    function issueToken(string companyName, string tokenName, string tokenSymbol, uint tokenSupply, uint tokenTime) public {
        bytes32 companyIndex = keccak256(abi.encodePacked(companyName));
        require(companies[companyIndex].active && companies[companyIndex].owner == msg.sender);
        require(isTokenNameAvailable(tokenName));
        BrandieERC721 newContract = new BrandieERC721(tokenName, tokenSymbol, tokenSupply, tokenTime);
        listOfTokensByCompany[companyIndex].push(address(newContract));
        emit TokenCreated(companyName, address(newContract), tokenName);
    }

    function deployAddresses(address tokenContract, address newAddress) public {
        uint tokenSupply = BrandieERC721(tokenContract).tokenSupply();
        if (tokenSupply == 0) {
            require(addresses[tokenContract].length == 0);
            addresses[tokenContract].push(newAddress);
        } else {
            require(addresses[tokenContract].length < tokenSupply);
            addresses[tokenContract].push(newAddress);
        }
    }

    function receiveToken(bytes message, bytes32 hash, bytes sig, address tokenContract) public {
        bool correct;
        address addr;
        (correct, addr) = ECVerify.ecverify(hash, sig);
        require(correct && hash == keccak256(abi.encodePacked(message)));
        require(findAddress(tokenContract, addr));
        removeAddress(tokenContract, addr);
        address receiver = fallbackMessageConverter(message);
        require(msg.sender == receiver);
        uint tokenIndex;
        bool confirmed;
        (confirmed, tokenIndex) = BrandieERC721(tokenContract).createToken(msg.sender);
        require(confirmed);
        emit TokenGenerated(BrandieERC721(tokenContract).name(), msg.sender, tokenIndex);
    }

    function deleteCompany(string companyName) public {
        bytes32 companyIndex = keccak256(abi.encodePacked(companyName));
        require(companies[companyIndex].active && (companies[companyIndex].owner == msg.sender || owner == msg.sender));
        companies[companyIndex].active = false;
    }

    function getCompanies(address from) public view returns (bytes32[]) {
        return ownersToCompanies[from];
    }

    function getTokenInformation(string companyName, address tokenAddress) public view returns (string, string, uint, uint, uint) {
        bytes32 companyIndex = keccak256(abi.encodePacked(companyName));
        //require(companies[companyIndex].owner == msg.sender);
        string memory name = BrandieERC721(tokenAddress).name();
        string memory symbol = BrandieERC721(tokenAddress).symbol();
        uint tokenSupply = BrandieERC721(tokenAddress).tokenSupply();
        uint startTime = BrandieERC721(tokenAddress).startTime();
        uint timeOfMinted = BrandieERC721(tokenAddress).timeOfMinted();
        return (name, symbol, tokenSupply, startTime, timeOfMinted);
    }

    function getAddressesOfTokens(string companyName) public view returns (address[]) {
        bytes32 companyIndex = keccak256(abi.encodePacked(companyName));
        //require(companies[companyIndex].owner == msg.sender);
        return listOfTokensByCompany[companyIndex];
    }

    function getCompanyIndexByCompanyName(string companyName) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(companyName));
    }

    function findAddress(address tokenContract, address guyAddress) internal view returns (bool found) {
        for (uint i = 0; i < addresses[tokenContract].length; i++) {
            if (addresses[tokenContract][i] == guyAddress) {
                found = true;
            }
        }
    }

    function removeAddress(address tokenContract, address guyAddress) internal {
        require(findAddress(tokenContract, guyAddress));
        uint addressIndex;
        for (uint i = 0; i < addresses[tokenContract].length; i++) {
            if (addresses[tokenContract][i] == guyAddress) {
                addressIndex = i;
            }
        }
        if (addressIndex == addresses[tokenContract].length - 1) {
            delete addresses[tokenContract][addressIndex];
        } else {
            addresses[tokenContract][addressIndex] = addresses[tokenContract][addresses[tokenContract].length - 1];
            delete addresses[tokenContract][addresses[tokenContract].length - 1];
        }
    }

    function fallbackMessageConverter(bytes message) internal pure returns (address) {
        uint160 m = 0;
        uint160 b = 0;
        for (uint8 i = 0; i < 20; i++) {
            m *= 256;
            b = uint160(message[message.length - 20 + i]);
            m += b;
        }
        return address(m);
    }
}
