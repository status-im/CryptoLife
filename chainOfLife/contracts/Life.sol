pragma solidity ^0.4.24;

contract Life {
    
    function life(bytes32[] _dish) public pure returns (bytes32[] _newGen) {
        _newGen = new bytes32[](_dish.length);
        //for (uint8 row = 0; row < _dish.length; row++) { //each row
        for (uint8 row = 0; row < 8; row ++) { //each row
          //for (uint8 cell = 0; row < _dish.length; cell++) { //each cell
          for (uint8 cell = 1; cell < 8; cell ++) { //each cell
            bool isAlive = checkAlive(_dish[row], cell);
            uint256 neighbors = 3; //getNeighbours(_dish[row - 1], _dish[row], _dish[row +1], cell);
            if (!isAlive && neighbors == 3) {
                _newGen[row] = _newGen[row] | bytes32(0x01 << cell);
            } else {
                if (neighbors > 1 && neighbors < 4) {
                  _newGen[row] = _newGen[row] | bytes32(0x01 << cell);
                }
            }
          }
        }
    }
    
    function testOverflow(uint8 _pos) public pure returns (uint256 ret) {
        ret = _pos -1;
    }
    
    function checkAlive(bytes32 _same, uint256 _cell) public pure returns (bool isAlive) {
        isAlive = (uint8(_same >> _cell) & 0x01 == 1);
    }
    
    function countAncestors(bytes32 _field, uint256 _start, uint256 _count) internal pure returns (uint256 count) {
      for (uint i = _start; i < _start + _count; i++) {
        count += uint8(_field >> i) & 0x01;
      }
    }
    
    function getNeighbours(bytes32 _above, bytes32 _same,bytes32 _below, uint8 _pos) public pure returns (uint256 ancestors) {
		ancestors += countAncestors(_above, _pos - 1, 3);
		ancestors += countAncestors(_same, _pos - 1, 1);
		ancestors += countAncestors(_same, _pos + 1, 1);
		ancestors += countAncestors(_below, _pos - 1, 3);
    }
}