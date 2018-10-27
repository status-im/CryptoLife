pragma solidity ^0.4.24;

contract Life {
    
  function life(bytes32[] _dish) public pure returns (bytes32[] _newGen) {
    _newGen = new bytes32[](_dish.length);
    bool isAlive;
    uint256 neighbors;
    bytes32 prevRow;
    bytes32 nextRow;
    uint256 prevCell;
    uint256 nextCell;
    for (uint256 row = 0; row < _dish.length; row++) { //each row
      for (uint256 cell = 0; cell < _dish.length / 2; cell++) { //each cell
        isAlive = (uint8(_dish[row] >> cell) & 0x01 == 1);
        prevRow = (row > 0) ? _dish[row - 1] : _dish[_dish.length-1];
        nextRow = (row < _dish.length - 1) ? _dish[row + 1] : _dish[0];
        prevCell = (cell > 0) ? cell - 1 : 255;
        nextCell = (cell < _dish.length - 1) ? cell + 1 : 0;
        neighbors = 0;
        // above
        neighbors += uint8(prevRow >> prevCell) & 0x01;
        neighbors += uint8(prevRow >> cell) & 0x01;
        neighbors += uint8(prevRow >> nextCell) & 0x01;
        // same
        neighbors += uint8(_dish[row] >> prevCell) & 0x01;
        neighbors += uint8(_dish[row] >> nextCell) & 0x01;
        // below
        neighbors += uint8(nextRow >> prevCell) & 0x01;
        neighbors += uint8(nextRow >> cell) & 0x01;
        neighbors += uint8(nextRow >> nextCell) & 0x01;
        if (isAlive) {
          if (neighbors > 1 && neighbors < 4) {
            _newGen[row] = _newGen[row] | bytes32(0x01 << cell);
          }
        } else {
          if (neighbors == 3) {
            _newGen[row] = _newGen[row] | bytes32(0x01 << cell);
          }
        }
      }
    }
  }

}