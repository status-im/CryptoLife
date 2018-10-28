pragma solidity 0.4.24;

import "../eip721/EIP721.sol";


contract Synestic is EIP721 {
    struct Beat {
        uint256 parentA;
        uint256 parentB;
        uint256[] params;
    }

    address public owner;
    mapping (uint256 => uint256) public synId2beat;
    Beat[] beats;

    constructor() public {
        name = "synestic";
        symbol = "SYN";
        owner = msg.sender;

        Beat memory newBeat = Beat({
            parentA: 0,
            parentB: 0,
            params: new uint256[](4)
        });

        beats.push(newBeat);

        addToken(owner, 0);
        emit Transfer(0, owner, 0);
    }

    function mint() public returns (uint256) {
        return createBeat(0, 0, msg.sender);
    }

    function remix(
        uint256 tokenA,
        uint256 tokenB
    ) public allowedToOperate(tokenA) allowedToOperate(tokenB) returns (uint256) {
        return createBeat(tokenA, tokenB, msg.sender);
    }

    function getBeat(
        uint256 beatId
        ) public view returns (
            uint256,
            uint256,
            uint256[]
        ) {
        Beat memory b = beats[beatId];

        return (
            b.parentA,
            b.parentB,
            b.params
        );
    }

    function createBeat(
        uint256 parentA,
        uint256 parentB,
        address beatOwner
    ) internal returns (uint256) {

        Beat memory newBeat = Beat({
            parentA: parentA,
            parentB: parentB,
            params: new uint256[](4)
        });

        uint256 newBeatId = uint256(beats.push(newBeat) - 1);
        generateMix(beats[parentA].params, beats[parentB].params, beats[newBeatId].params);

        addToken(beatOwner, newBeatId);
        emit Transfer(0, beatOwner, newBeatId);

        return newBeatId;
    }

    function generateMix(uint256[] storage paramsA, uint256[] storage paramsB, uint256[] storage destination) internal {
        uint256 seed = uint256(keccak256(abi.encodePacked(blockhash(block.number-1))));

        for (uint256 i = 0; i < destination.length; i++) {
            uint256 shiftCount = i+1;
            destination[i] = uint256(paramsA[i] ^ paramsB[i] ^ seed);
            seed = (seed << shiftCount) | (seed >> (256-shiftCount));
        }
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    //function blankParams() internal returns (uint256[128]) {
    //  uint256[128] memory blank;
    //  return blank;
    //}
}
