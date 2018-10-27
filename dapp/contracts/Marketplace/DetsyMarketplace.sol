pragma solidity 0.4.25;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";


// Simple Detsy  marketplace contract
contract DetsyMarketplace is Ownable {
    using SafeMath for uint256;

    uint256 public detsyFeePercent = 5;
    StandardToken public daiToken;

    struct Item {
        address seller;
        uint256 price;
        uint256 quantity;
        uint256 arrayIndex;
    }

    mapping(bytes32 => Item) public items;
    bytes32[] public itemIpfsHashes;

    constructor(address _daiToken) public {
        daiToken = StandardToken(_daiToken);
    }

    modifier onlyItemOwner(bytes32 _ipfsHash) {
        require(items[_ipfsHash].seller == msg.sender, "This Item is not owned by you");
        _;
    }

    modifier onlyNewItem(bytes32 _ipfsHash) {
        require(items[_ipfsHash].seller == address(0), "This Item already exists");
        _;
    }

    function listItem(bytes32 _ipfsHash, uint256 _itemPrice, uint256 _quantity) public onlyNewItem(_ipfsHash) {
        itemIpfsHashes.push(_ipfsHash);

        items[_ipfsHash] = Item({
            seller : msg.sender,
            price : _itemPrice,
            quantity : _quantity,
            arrayIndex : itemIpfsHashes.length - 1});

        // Emit Event
    }

    function getItemsCount() public view returns (uint256) {
        return itemIpfsHashes.length;
    }

    function getItem(bytes32 _ipfsHash) public view returns (address _seller, uint256 _price, uint256 _quantity, uint256 _index) {
        Item localItem = items[_ipfsHash];

        return (localItem.seller, localItem.price, localItem.quantity, localItem.arrayIndex);
    }

    function changeItemQuantity(bytes32 _ipfsHash, uint256 _newQuantity) public onlyItemOwner(_ipfsHash) {
        items[_ipfsHash].quantity = _newQuantity;

        // Emit Event
    }

    function buyItem(bytes32 _ipfsHash, uint256 _quantity) public {
        Item storage sellingItem = items[_ipfsHash];
        require(sellingItem.quantity >= _quantity, "Not enough quantity from this item");

        uint256 cost = _quantity.mul(sellingItem.price);
        uint256 detsyFee = (cost.mul(detsyFeePercent)).div(100);

        daiToken.transferFrom(msg.sender, this, detsyFee);
        daiToken.transferFrom(msg.sender, sellingItem.seller, cost.sub(detsyFee));

        sellingItem.quantity = sellingItem.quantity.sub(_quantity);

        // Emit Event
    }

    function buyItemCustomPrice(bytes32 _itemId, uint256 _quantity, uint256 _customPrice, bytes signedDataByOwner) public {
        // with ecrecover
        // Emit Event
    }

    function withdrawFees() public onlyOwner {
        uint256 contractBalance = daiToken.balanceOf(this);
        daiToken.transfer(owner, contractBalance);

        // Emit Event
    }
}
