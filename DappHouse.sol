pragma solidity ^0.4.23;

// ----------------------------------------------------------------------------
// Housemates DApp Project
//
// https://github.com/apguerrera/housemates
// https://github.com/bokkypoobah/DecentralisedFutureFundDAO
//
// Enjoy.
//
// (c) Adrian Guerrera / www.deepyr.com
// (c) BokkyPooBah / Bok Consulting Pty Ltd and
// the Babysitters Club DApp Project and 2018. The MIT Licence.
// ----------------------------------------------------------------------------



// ----------------------------------------------------------------------------
// ERC Token Standard #20 Interface
// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md
// ----------------------------------------------------------------------------
contract ERC20Interface {
    function totalSupply() public view returns (uint);
    function balanceOf(address tokenOwner) public view returns (uint balance);
    function allowance(address tokenOwner, address spender) public view returns (uint remaining);
    function transfer(address to, uint tokens) public returns (bool success);
    function approve(address spender, uint tokens) public returns (bool success);
    function transferFrom(address from, address to, uint tokens) public returns (bool success);

    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
}


// ----------------------------------------------------------------------------
// HouseToken Interface = ERC20 + symbol + name + decimals + mint + approveAndCall
// ----------------------------------------------------------------------------
contract HouseTokenInterface is ERC20Interface {
    function symbol() public view returns (string);
    function name() public view returns (string);
    function decimals() public view returns (uint8);
    function approveAndCall(address spender, uint tokens, bytes data) public returns (bool success);
    function mint(address addr, uint tokens) public returns (bool success);
}

contract OtcInterface {
    function sellAllAmount(address, uint, address, uint) public returns (uint);
    function buyAllAmount(address, uint, address, uint) public returns (uint);
    function getPayAmount(address, address, uint) public constant returns (uint);
}

contract TokenInterface {
    function balanceOf(address) public returns (uint);
    function allowance(address, address) public returns (uint);
    function approve(address, uint) public;
    function transfer(address,uint) public returns (bool);
    function transferFrom(address, address, uint) public returns (bool);
    function deposit() public payable;
    function withdraw(uint) public;
}


// ----------------------------------------------------------------------------
// Contract function to receive approval and execute function in one call
//
// Borrowed from MiniMeToken
// ----------------------------------------------------------------------------
contract ApproveAndCallFallBack {
    function receiveApproval(address from, uint256 tokens, address token, bytes data) public;
}

// MakerDAO

// Oasis.direct contract -> 0x793EbBe21607e4F04788F89c7a9b97320773Ec59
// "createAndBuyAllAmountPayEth(0x4678f0a6958e4d2bc4f1baf7bc52e8f3564f3fe4,0x14fbca95be7e99c15cc2996c6c9d841e54b79425,0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359,1000)",
//exchange = OasisInterface(0x793EbBe21607e4F04788F89c7a9b97320773Ec59);
// exchange.createAndBuyAllAmountPayEth(0x4678f0a6958e4d2bc4f1baf7bc52e8f3564f3fe4,0x14fbca95be7e99c15cc2996c6c9d841e54b79425,0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359,1000);


contract OasisInterface {
      function createAndBuyAllAmountPayEth(address factory, address otc, address buyToken, uint buyAmt) public payable returns (address proxy, uint wethAmt);
}


contract DSMath {

    function add(uint x, uint y) internal pure returns (uint z) {
        require((z = x + y) >= x);
    }
    function sub(uint x, uint y) internal pure returns (uint z) {
        require((z = x - y) <= x);
    }
    function mul(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x);
    }
    function min(uint x, uint y) internal pure returns (uint z) {
        return x <= y ? x : y;
    }
    function max(uint x, uint y) internal pure returns (uint z) {
        return x >= y ? x : y;
    }
}

// ----------------------------------------------------------------------------
// Safe maths
// ----------------------------------------------------------------------------
library SafeMath {
    function add(uint a, uint b) internal pure returns (uint c) {
        c = a + b;
        require(c >= a);
    }
    function sub(uint a, uint b) internal pure returns (uint c) {
        require(b <= a);
        c = a - b;
    }
    function mul(uint a, uint b) internal pure returns (uint c) {
        c = a * b;
        require(a == 0 || c / a == b);
    }
    function div(uint a, uint b) internal pure returns (uint c) {
        require(b > 0);
        c = a / b;
    }
    function min(uint x, uint y) internal pure returns (uint z) {
        return x <= y ? x : y;
    }
    function max(uint x, uint y) internal pure returns (uint z) {
        return x >= y ? x : y;
    }
}


// ----------------------------------------------------------------------------
// Owned contract
// ----------------------------------------------------------------------------
contract Owned {
    address public owner;
    address public newOwner;

    event OwnershipTransferred(address indexed _from, address indexed _to);

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    constructor() public {
        owner = msg.sender;
    }
    function transferOwnership(address _newOwner) public onlyOwner {
        newOwner = _newOwner;
    }
    function acceptOwnership() public {
        require(msg.sender == newOwner);
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
        newOwner = address(0);
    }
    function transferOwnershipImmediately(address _newOwner) public onlyOwner {
        emit OwnershipTransferred(owner, _newOwner);
        owner = _newOwner;
    }
}


// ----------------------------------------------------------------------------
// HouseToken
// ----------------------------------------------------------------------------
contract HouseToken is HouseTokenInterface, Owned {
    using SafeMath for uint;

    string _symbol;
    string _name;
    uint8 _decimals;
    uint _totalSupply;

    mapping(address => uint) balances;
    mapping(address => mapping(address => uint)) allowed;


    constructor(string symbol, string name, uint8 decimals) public {
        _symbol = symbol;
        _name = name;
        _decimals = decimals;
    }
    function symbol() public view returns (string) {
        return _symbol;
    }
    function name() public view returns (string) {
        return _name;
    }
    function decimals() public view returns (uint8) {
        return _decimals;
    }
    function totalSupply() public constant returns (uint) {
        return _totalSupply  - balances[address(0)];
    }
    function balanceOf(address tokenOwner) public constant returns (uint balance) {
        return balances[tokenOwner];
    }
    function transfer(address to, uint tokens) public returns (bool success) {
        balances[msg.sender] = balances[msg.sender].sub(tokens);
        balances[to] = balances[to].add(tokens);
        emit Transfer(msg.sender, to, tokens);
        return true;
    }
    function approve(address spender, uint tokens) public returns (bool success) {
        allowed[msg.sender][spender] = tokens;
        emit Approval(msg.sender, spender, tokens);
        return true;
    }
    function transferFrom(address from, address to, uint tokens) public returns (bool success) {
        balances[from] = balances[from].sub(tokens);
        allowed[from][msg.sender] = allowed[from][msg.sender].sub(tokens);
        balances[to] = balances[to].add(tokens);
        emit Transfer(from, to, tokens);
        return true;
    }
    function allowance(address tokenOwner, address spender) public constant returns (uint remaining) {
        return allowed[tokenOwner][spender];
    }
    function approveAndCall(address spender, uint tokens, bytes data) public returns (bool success) {
        allowed[msg.sender][spender] = tokens;
        emit Approval(msg.sender, spender, tokens);
        ApproveAndCallFallBack(spender).receiveApproval(msg.sender, tokens, this, data);
        return true;
    }
    function mint(address addr, uint tokens) public onlyOwner returns (bool success) {
        balances[addr] = balances[addr].add(tokens);
        emit Transfer(address(0), addr, tokens);
        return true;
    }
    function () public payable {
        revert();
    }
    function transferAnyERC20Token(address tokenAddress, uint tokens) public onlyOwner returns (bool success) {
        return ERC20Interface(tokenAddress).transfer(owner, tokens);
    }
}


// ----------------------------------------------------------------------------
// Housemateship Data Structure
// ----------------------------------------------------------------------------
library Housemates {
    struct Housemate {
        bool exists;
        uint index;
        string name;
        bool bond;
    }
    struct Data {
        bool initialised;
        mapping(address => Housemate) entries;
        address[] index;
    }

    event HousemateAdded(address indexed housemateAddress, string name, uint totalAfter);
    event HousemateRemoved(address indexed housemateAddress, string name, uint totalAfter);
    event HousemateNameUpdated(address indexed housemateAddress, string oldName, string newName);

    function init(Data storage self) public {
        require(!self.initialised);
        self.initialised = true;
    }
    function isHousemate(Data storage self, address _address) public view returns (bool) {
        return self.entries[_address].exists;
    }
    function add(Data storage self, address _address, string _name) public {
        require(!self.entries[_address].exists);
        self.index.push(_address);
        self.entries[_address] = Housemate(true, self.index.length - 1, _name, false);
        emit HousemateAdded(_address, _name, self.index.length);
    }
    function remove(Data storage self, address _address) public {
        require(self.entries[_address].exists);
        uint removeIndex = self.entries[_address].index;
        emit HousemateRemoved(_address, self.entries[_address].name, self.index.length - 1);
        uint lastIndex = self.index.length - 1;
        address lastIndexAddress = self.index[lastIndex];
        self.index[removeIndex] = lastIndexAddress;
        self.entries[lastIndexAddress].index = removeIndex;
        delete self.entries[_address];
        if (self.index.length > 0) {
            self.index.length--;
        }
    }
    function setName(Data storage self, address housemateAddress, string _name) public {
        Housemate storage housemate = self.entries[housemateAddress];
        require(housemate.exists);
        emit HousemateNameUpdated(housemateAddress, housemate.name, _name);
        housemate.name = _name;
    }

    function length(Data storage self) public view returns (uint) {
        return self.index.length;
    }
}


// ----------------------------------------------------------------------------
// House
// ----------------------------------------------------------------------------
contract House is DSMath{
    using SafeMath for uint;
    using Housemates for Housemates.Data;

    enum ProposalType {
        EtherPayment,                      //  0 Ether payment
        DaiPayment,                      //  0 Ether payment
        TokenPayment,                      //  1 DFF Token payment
        OtherTokenPayment,                 //  2 Token payment
        MintTokens,                        //  3 Mint DFF tokens
        AddRule,                           //  4 Add governance rule
        DeleteRule,                        //  5 Delete governance rule
        UpdateBTTSToken,                   //  6 Update BTTS Token
        UpdateDAO,                         //  7 Update DAO
        AddHousemate,                         //  8 Add housemate
        RemoveHousemate                       // 9 Remove housemate
    }

    struct Proposal {
        ProposalType proposalType;
        address proposer;
        string description;
        address address1;
        address address2;
        address recipient;
        address tokenContract;
        uint amount;
        mapping(address => bool) voted;
        uint housemateVotedNo;
        uint housemateVotedYes;
        address executor;
        bool open;
        uint initiated;
        uint closed;
    }

    string public name;

    uint8 public constant TOKEN_DECIMALS = 18;
    uint public constant TOKEN_DECIMALSFACTOR = 10 ** uint(TOKEN_DECIMALS);

    HouseTokenInterface public token;
    Housemates.Data housemates;
    bool public initialised;
    Proposal[] proposals;

    uint public tokensForNewHousemates;

    uint public quorum = 80;
    uint public quorumDecayPerWeek = 10;
    uint public requiredMajority = 70;

    // Must be copied here to be added to the ABI
    event HousemateAdded(address indexed housemateAddress, string name, uint totalAfter);
    event HousemateRemoved(address indexed housemateAddress, string name, uint totalAfter);
    event HousemateNameUpdated(address indexed housemateAddress, string oldName, string newName);

    event TokenUpdated(address indexed oldToken, address indexed newToken);
    event TokensForNewHousematesUpdated(uint oldTokens, uint newTokens);
    event EtherDeposited(address indexed sender, uint amount);
    event DaiDeposited(address indexed sender, uint amount);

    event NewProposal(uint indexed proposalId, ProposalType indexed proposalType, address indexed proposer, address recipient, address tokenContract, uint amount);
    event Voted(uint indexed proposalId, address indexed voter, bool vote, uint housemateVotedYes, uint housemateVotedNo);
    event EtherPaid(uint indexed proposalId, address indexed sender, address indexed recipient, uint amount);
    event DaiPaid(uint indexed proposalId, address indexed sender, address indexed recipient, uint amount);

    constructor(string _name, address _token, uint _tokensForNewHousemates) public {
        housemates.init();
        name = _name;
        token = HouseTokenInterface(_token);
        tokensForNewHousemates = _tokensForNewHousemates;
    }
    function init(address _housemateAddr, string _housemateName) public {
        require(!initialised);
        initialised = true;
        housemates.add(_housemateAddr, _housemateName);
        token.mint(_housemateAddr, tokensForNewHousemates);
    }
    function setHousemateName(string housemateName) public {
        housemates.setName(msg.sender, housemateName);
    }
    function proposeEtherPayment(string description, address _recipient, uint _amount) public {
        require(address(this).balance >= _amount);
        require(housemates.isHousemate(msg.sender));
        Proposal memory proposal = Proposal({
            proposalType: ProposalType.EtherPayment,
            proposer: msg.sender,
            description: description,
            address1: address(0),
            address2: address(0),
            recipient: _recipient,
            tokenContract: address(0),
            amount: _amount,
            housemateVotedNo: 0,
            housemateVotedYes: 0,
            executor: address(0),
            open: true,
            initiated: now,
            closed: 0
        });
        proposals.push(proposal);
        emit NewProposal(proposals.length - 1, proposal.proposalType, msg.sender, _recipient, address(0), _amount);
    }
    function proposeDaiPayment(string description, address _recipient, uint _amount) public {
        require(address(this).balance >= _amount);
        require(housemates.isHousemate(msg.sender));
        Proposal memory proposal = Proposal({
            proposalType: ProposalType.DaiPayment,
            proposer: msg.sender,
            description: description,
            address1: address(0),
            address2: address(0),
            recipient: _recipient,
            tokenContract: address(0),
            amount: _amount,
            housemateVotedNo: 0,
            housemateVotedYes: 0,
            executor: address(0),
            open: true,
            initiated: now,
            closed: 0
        });
        proposals.push(proposal);
        emit NewProposal(proposals.length - 1, proposal.proposalType, msg.sender, _recipient, address(0), _amount);
    }

    function voteNo(uint proposalId) public {
        vote(proposalId, false);
    }
    function voteYes(uint proposalId) public {
        vote(proposalId, true);
    }
    function vote(uint proposalId, bool yesNo) public {
        require(housemates.isHousemate(msg.sender));
        Proposal storage proposal = proposals[proposalId];
        require(proposal.open);
        if (!proposal.voted[msg.sender]) {
            if (yesNo) {
                proposal.housemateVotedYes++;
            } else {
                proposal.housemateVotedNo++;
            }
            emit Voted(proposalId, msg.sender, yesNo, proposal.housemateVotedYes, proposal.housemateVotedNo);
            proposal.voted[msg.sender];
        }
        if (proposal.housemateVotedYes > 0 && proposal.open) {
            if (proposal.proposalType == ProposalType.EtherPayment) {
                proposal.recipient.transfer(proposal.amount);
                emit EtherPaid(proposalId, msg.sender, proposal.recipient, proposal.amount);
                proposal.executor = msg.sender;
                proposal.open = false;
            }
            if (proposal.proposalType == ProposalType.DaiPayment) {
                buyDaiPayEth(proposal.amount);
                emit DaiPaid(proposalId, msg.sender, proposal.recipient, proposal.amount);
                proposal.executor = msg.sender;
                proposal.open = false;
            }
        }
    }

    function setToken(address _token) internal {
        emit TokenUpdated(address(token), _token);
        token = HouseTokenInterface(_token);
    }
    function setTokensForNewHousemates(uint _newToken) internal {
        emit TokensForNewHousematesUpdated(tokensForNewHousemates, _newToken);
        tokensForNewHousemates = _newToken;
    }
    function addHousemate(address _address, string _name) internal {
        housemates.add(_address, _name);
        token.mint(_address, tokensForNewHousemates);
    }
    function removeHousemate(address _address) internal {
        housemates.remove(_address);
    }

    function numberOfHousemates() public view returns (uint) {
        return housemates.length();
    }
    function getHousemates() public view returns (address[]) {
        return housemates.index;
    }
    function getHousemateData(address _address) public view returns (bool _exists, uint _index, string _name) {
        Housemates.Housemate memory housemate = housemates.entries[_address];
        return (housemate.exists, housemate.index, housemate.name);
    }
    function getHousemateByIndex(uint _index) public view returns (address _housemate) {
        return housemates.index[_index];
    }

    function getQuorum(uint proposalTime, uint currentTime) public view returns (uint) {
        if (quorum > currentTime.sub(proposalTime).mul(quorumDecayPerWeek).div(1 weeks)) {
            return quorum.sub(currentTime.sub(proposalTime).mul(quorumDecayPerWeek).div(1 weeks));
        } else {
            return 0;
        }
    }
    function numberOfProposals() public view returns (uint) {
        return proposals.length;
    }
    function getProposalData1(uint proposalId) public view returns (uint _proposalType, address _proposer, string _description) {
        Proposal memory proposal = proposals[proposalId];
        _proposalType = uint(proposal.proposalType);
        _proposer = proposal.proposer;
        _description = proposal.description;
    }
    function getProposalData2(uint proposalId) public view returns (address _address1, address _address2, address _recipient, address _tokenContract, uint _amount) {
        Proposal memory proposal = proposals[proposalId];
        _address1 = proposal.address1;
        _address2 = proposal.address2;
        _recipient = proposal.recipient;
        _tokenContract = proposal.tokenContract;
        _amount = proposal.amount;
    }
    function getProposalData3(uint proposalId) public view returns (uint _housemateVotedNo, uint _housemateVotedYes, address _executor, bool _open) {
        Proposal memory proposal = proposals[proposalId];
        _housemateVotedNo = proposal.housemateVotedNo;
        _housemateVotedYes = proposal.housemateVotedYes;
        _executor = proposal.executor;
        _open = proposal.open;
    }

    function withdrawAndSend(TokenInterface wethToken, uint wethAmt) internal {
        wethToken.withdraw(wethAmt);
        msg.sender.transfer(wethAmt);

    }

    function buyAllAmountPayEth(OtcInterface otc, TokenInterface buyToken, uint buyAmt, TokenInterface wethToken) public payable returns (uint wethAmt) {
        // In this case user needs to send more ETH than a estimated value, then contract will send back the rest
        wethToken.deposit.value(msg.value)();
        if (wethToken.allowance(this, otc) < msg.value) {
            wethToken.approve(otc, uint(-1));
        }
        wethAmt = otc.buyAllAmount(buyToken, buyAmt, wethToken, msg.value);
        require(buyToken.transfer(msg.sender, min(buyAmt, buyToken.balanceOf(this)))); // To avoid rounding issues we check the minimum value
        withdrawAndSend(wethToken, sub(msg.value, wethAmt));
    }

    function buyDaiPayEth(uint buyAmt) public payable  returns (uint amount) {
        amount =  buyAllAmountPayEth(OtcInterface(0x14FBCA95be7e99C15Cc2996c6C9d841e54B79425), TokenInterface(0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359), buyAmt, TokenInterface(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2));
    }

    function () public payable {
        emit EtherDeposited(msg.sender, msg.value);

    }
}


// ----------------------------------------------------------------------------
// House Factory
// ----------------------------------------------------------------------------
contract HouseFactory is Owned {

    mapping(address => bool) _verify;
    House[] public deployedHouses;
    HouseToken[] public deployedTokens;

    event HouseListing(address indexed house, string houseName,
        address indexed token, string tokenSymbol, string tokenName, uint8 tokenDecimals,
        address indexed housemateName, uint tokensForNewHousemates);

    function verify(address addr) public view returns (bool valid) {
        valid = _verify[addr];
    }
    
    function deployHouseContract(
        string houseName,
        string tokenSymbol,
        string tokenName,
        uint8 tokenDecimals,
        string housemateName,
        uint tokensForNewHousemates
    ) public returns (House house, HouseToken token) {
        token = new HouseToken(tokenSymbol, tokenName, tokenDecimals);
        _verify[address(token)] = true;
        deployedTokens.push(token);
        house = new House(houseName, address(token), tokensForNewHousemates);
        token.transferOwnershipImmediately(address(house));
        house.init(msg.sender, housemateName);
        _verify[address(house)] = true;
        deployedHouses.push(house);
        emit HouseListing(address(house), houseName, address(token), tokenSymbol, tokenName, tokenDecimals, msg.sender, tokensForNewHousemates);
    }
    function numberOfDeployedHouses() public view returns (uint) {
        return deployedHouses.length;
    }
    function numberOfDeployedTokens() public view returns (uint) {
        return deployedTokens.length;
    }
    function transferAnyERC20Token(address tokenAddress, uint tokens) public onlyOwner returns (bool success) {
        return ERC20Interface(tokenAddress).transfer(owner, tokens);
    }
    function () public payable {
        revert();
    }
}
