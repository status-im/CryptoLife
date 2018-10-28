pragma solidity ^0.4.24;

import "./ens/ENS.sol";
import "./DAI.sol";

contract MarkerResolver {

    bytes4 constant INTERFACE_META_ID = 0x01ffc9a7;
    bytes4 constant ADDR_INTERFACE_ID = 0x3b3b57de;
    bytes4 constant CONTENT_INTERFACE_ID = 0xd8389dc5;
    bytes4 constant NAME_INTERFACE_ID = 0x691f3431;
    bytes4 constant ABI_INTERFACE_ID = 0x2203ab56;
    bytes4 constant PUBKEY_INTERFACE_ID = 0xc8690233;
    bytes4 constant TEXT_INTERFACE_ID = 0x59d1d43c;
    bytes4 constant MULTIHASH_INTERFACE_ID = 0xe89401a1;

    event AddrChanged(bytes32 indexed node, address a);
    event ContentChanged(bytes32 indexed node, bytes32 hash);
    event NameChanged(bytes32 indexed node, string name);
    event ABIChanged(bytes32 indexed node, uint256 indexed contentType);
    event PubkeyChanged(bytes32 indexed node, bytes32 x, bytes32 y);
    event TextChanged(bytes32 indexed node, string indexedKey, string key);
    event MultihashChanged(bytes32 indexed node, bytes hash);

    event MarkerAdded(bytes32 indexed node, string text, uint256 endTime);

    struct PublicKey {
        bytes32 x;
        bytes32 y;
    }

    struct Marker{
        string text;
        uint256 endTime;
    }

    struct Record {
        address addr;
        bytes32 content;
        string name;
        PublicKey pubkey;
        mapping(string=>string) text;
        mapping(string=>uint256) textEndTime;
        Marker[] markers;
        mapping(uint256=>bytes) abis;
        bytes multihash;
    }

    ENS ens;
    DAI dai;

    mapping (bytes32 => Record) records;
    mapping(address => uint256) ownerBalances; // TODO add withdraw method

    modifier only_owner(bytes32 node) {
        require(ens.owner(node) == msg.sender);
        _;
    }

    constructor(ENS ensAddr, DAI _dai) public {
        ens = ensAddr;
        dai = _dai;
    }

    function setAddr(bytes32 node, address addr) public only_owner(node) {
        records[node].addr = addr;
        emit AddrChanged(node, addr);
    }

    function setContent(bytes32 node, bytes32 hash) public only_owner(node) {
        records[node].content = hash;
        emit ContentChanged(node, hash);
    }

    function setMultihash(bytes32 node, bytes hash) public only_owner(node) {
        records[node].multihash = hash;
        emit MultihashChanged(node, hash);
    }
    
    function setName(bytes32 node, string name) public only_owner(node) {
        records[node].name = name;
        emit NameChanged(node, name);
    }

    function setABI(bytes32 node, uint256 contentType, bytes data) public only_owner(node) {
        // Content types must be powers of 2
        require(((contentType - 1) & contentType) == 0);
        
        records[node].abis[contentType] = data;
        emit ABIChanged(node, contentType);
    }
    
    function setPubkey(bytes32 node, bytes32 x, bytes32 y) public only_owner(node) {
        records[node].pubkey = PublicKey(x, y);
        emit PubkeyChanged(node, x, y);
    }

    
    function setText(bytes32 node, string key, string value) public payable {
        require(msg.value >= 10000000000000000, "need to pay at least 10000000000000000 wei for addign a marker");
        require(now > records[node].textEndTime[key], "existing text marker has not expired");
        ownerBalances[ens.owner(node)] += msg.value;
        records[node].text[key] = value;
        records[node].textEndTime[key] = now + 2 minutes;
        emit TextChanged(node, key, key);
    }

    // function setTextViaDAI(bytes32 node, string key, string value) public {
    //     dai.safeTransferFrom()
    //     require(now > records[node].textEndTime[key], "existing text marker has not expired");
    //     records[node].text[key] = value;
    //     records[node].textEndTime[key] = now + 2 minutes;
    //     emit TextChanged(node, key, key);
    // }
    function text(bytes32 node, string key) public view returns (string) {
        if(now > records[node].textEndTime[key]) {
            return "";
        }
        return records[node].text[key];
    }

    function _addMarker(bytes32 node, string _text, uint256 duration) internal{
        require(duration > 0, "cannot create a marker that finish right away");
        records[node].markers.push(Marker({
            text: _text,
            endTime: now + duration
        }));
        emit MarkerAdded(node, _text, now + duration);
    }

    function addMarker(bytes32 node, string _text, uint256 duration) public payable {
        require(msg.value >= (100000000000000 * duration) / 60, "need to pay at least 100000000000000 wei per minutes for adding a marker"); // less than 1 minute are free :)
        ownerBalances[ens.owner(node)] += msg.value;
        _addMarker(node, _text, duration);
    }

    function addMarkerFor2Minutes(bytes32 node, string _text) public payable {
        addMarker(node, _text, 2 minutes);
    }

    function addMarkerViaDAIFor2Minutes(address spender, bytes32 node, string _text) public payable {
        addMarkerViaDAI(spender, node, _text, 2 minutes);
    }

    function addMarkerViaDAI(address spender, bytes32 node, string _text, uint256 duration) public {
        dai.transferFrom(spender, this, (100000000000000 * duration) / 60); // less than 1 minute are free :)
        //TODO keep track of dai earned to withdraw them
        _addMarker(node, _text, now + duration);
    }

    function marker(bytes32 node, uint256 index) public view returns (string) {
        if(now > records[node].markers[index].endTime){
            return "";
        }
        return records[node].markers[index].text;
    }

    function numMarkers(bytes32 node) public view returns(uint256) {
        return records[node].markers.length;
    }

    function pubkey(bytes32 node) public view returns (bytes32 x, bytes32 y) {
        return (records[node].pubkey.x, records[node].pubkey.y);
    }

    function ABI(bytes32 node, uint256 contentTypes) public view returns (uint256 contentType, bytes data) {
        Record storage record = records[node];
        for (contentType = 1; contentType <= contentTypes; contentType <<= 1) {
            if ((contentType & contentTypes) != 0 && record.abis[contentType].length > 0) {
                data = record.abis[contentType];
                return;
            }
        }
        contentType = 0;
    }

    function name(bytes32 node) public view returns (string) {
        return records[node].name;
    }

    function content(bytes32 node) public view returns (bytes32) {
        return records[node].content;
    }

    function multihash(bytes32 node) public view returns (bytes) {
        return records[node].multihash;
    }

    function addr(bytes32 node) public view returns (address) {
        return records[node].addr;
    }

    function supportsInterface(bytes4 interfaceID) public pure returns (bool) {
        return interfaceID == ADDR_INTERFACE_ID ||
        interfaceID == CONTENT_INTERFACE_ID ||
        interfaceID == NAME_INTERFACE_ID ||
        interfaceID == ABI_INTERFACE_ID ||
        interfaceID == PUBKEY_INTERFACE_ID ||
        interfaceID == TEXT_INTERFACE_ID ||
        interfaceID == MULTIHASH_INTERFACE_ID ||
        interfaceID == INTERFACE_META_ID;
    }
}