pragma solidity ^0.4.25;

contract Mimimia {

    event Bid(
        address indexed _from,
        uint256 indexed _uid,
        uint _value
    );

    struct SellerData {
        string ipfs_hash;
        uint256 price;
        address owner;
    }

    mapping (uint256 => SellerData) public data;
    mapping (uint256 => address) public buyRequests;
    uint256 public auctionIds;
    

    function include(string ipfs_hash, uint256 price) public {
        data[auctionIds] = SellerData(ipfs_hash, price, msg.sender);
        auctionIds++;
    }

    function edit(uint256 uid, uint256 price) public {
        require(data[uid].owner == msg.sender, "Only owner of data");
        data[uid].price = price;
    }

    function bid(uint256 uid) public payable {
        require(buyRequests[uid] == address(0), "already bidded"); //prevent overwrite
        require(msg.value == data[uid].price, "wrong value"); //buyer needs to send right value
        buyRequests[uid] = msg.sender; //save address of buyer
        emit Bid(msg.sender, uid, msg.value); // emit the new bid
    }

    function acceptBid(uint256 uid) public {
        require(data[uid].owner == msg.sender, "Only owner of data");
        address seller = data[uid].owner;
        data[uid].owner = buyRequests[uid];
        delete buyRequests[uid];
        seller.transfer(data[uid].price);
    }

    function cancel(uint256 uid) public {
        require(data[uid].owner == msg.sender, "Only owner of data");
        delete data[uid];
        delete buyRequests[uid];
    }

}