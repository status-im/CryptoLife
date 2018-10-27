pragma solidity ^0.4.24;

contract Life {

  // 0x01 == 00000001 = white
  // 0x02 == 00000010 = black
    
  function life(bytes32[] _dish) public pure returns (bytes32[] _newGen) {
    _newGen = new bytes32[](_dish.length);
    uint256 color;
    uint256 aN; // neighbours of alice
    uint256 bN; // neighbours of bob
    bytes32 prevRow;
    bytes32 nextRow;
    uint256 prevCell;
    uint256 nextCell;
    for (uint256 row = 0; row < _dish.length; row++) { //each row
      for (uint256 cell = 0; cell < _dish.length * 2; cell+=2) { //each cell
        color = (uint8(_dish[row] >> cell) & 0x03);
        prevRow = (row > 0) ? _dish[row - 1] : _dish[_dish.length-1];
        nextRow = (row < _dish.length - 1) ? _dish[row + 1] : _dish[0];
        prevCell = (cell > 0) ? cell - 2 : 255;
        nextCell = (cell < _dish.length - 2) ? cell + 2 : 0;
        aN = 0;
        bN = 0;
        // above
        aN += uint8(prevRow >> prevCell) & 0x01;
        aN += uint8(prevRow >> cell) & 0x01;
        aN += uint8(prevRow >> nextCell) & 0x01;
        bN += uint8(prevRow >> prevCell) & 0x02;
        bN += uint8(prevRow >> cell) & 0x02;
        bN += uint8(prevRow >> nextCell) & 0x02;
        // same
        aN += uint8(_dish[row] >> prevCell) & 0x01;
        aN += uint8(_dish[row] >> nextCell) & 0x01;
        bN += uint8(_dish[row] >> prevCell) & 0x02;
        bN += uint8(_dish[row] >> nextCell) & 0x02;
        // below
        aN += uint8(nextRow >> prevCell) & 0x01;
        aN += uint8(nextRow >> cell) & 0x01;
        aN += uint8(nextRow >> nextCell) & 0x01;
        bN += uint8(nextRow >> prevCell) & 0x02;
        bN += uint8(nextRow >> cell) & 0x02;
        bN += uint8(nextRow >> nextCell) & 0x02;
        if (color == 0) { // empty
          if (aN == 3) {
            if (bN == 3) {
              // random
            } else {
              _newGen[row] = _newGen[row] | bytes32(0x01 << cell);
            }
          } else if (bN == 3) {
            _newGen[row] = _newGen[row] | bytes32(0x02 << cell);
          }
        }
        prevCell = (aN > bN) ? aN - bN : bN - aN;
        if (color == 1) { // alice  
          if (prevCell == 2 || prevCell == 3) {
            _newGen[row] = _newGen[row] | bytes32(0x01 << cell);
          }
          if (prevCell == 1 && aN >= 2) {
            _newGen[row] = _newGen[row] | bytes32(0x01 << cell);
          }
        }
        if (color == 2) { // bob
          if (prevCell == 2 || prevCell == 3) {
            _newGen[row] = _newGen[row] | bytes32(0x02 << cell);
          }
          if (prevCell == 1 && bN >= 2) {
            _newGen[row] = _newGen[row] | bytes32(0x02 << cell);
          }
        }
      }
    }
  }

}