import assert from 'assert';
import buffer from 'bitwise/buffer';

function readBit(buffer, i, bit){
  return (buffer[i] >> bit) % 2;
}

function setBit(buffer, i, bit, value){
  if(value == 0){
    buffer[i] &= ~(1 << bit);
  }else{
    buffer[i] |= (1 << bit);
  }
}

export default class P2life {
  constructor(half1, half2) {
    assert(Array.isArray(half1), 'half 1 needs to be array');
    assert(Array.isArray(half2), 'half 2 needs to be array');
    assert(half1.length == half2.length, 'half 2 needs to be array');

    // transfor 1 bit representation into 2 bit representation
    const half1Bufs = [];
    const half2Bufs = [];
    for (let i = 0; i < half1.length; i++) {
      half1Bufs.push(new Uint8Array(Buffer.from(half1[i].replace('0x', ''), 'hex')));
      half2Bufs.push(new Uint8Array(Buffer.from(half2[i].replace('0x', ''), 'hex')));
    }
    const dish = [];
    // itterate over alice
    for (let i = 0; i < half1Bufs.length; i++) {
        const buffer = [];
        // itterate over all arrays
        for (let j = 0; j < half1Bufs[i].length; j++) {
          // over all 8 bits 
          for (let k = 0; k < 8; k++) {
            buffer.push(readBit(half1Bufs[i], j, k));
          }
        }
        dish.push(new Uint8Array(buffer));
    }

    for (let i = 0; i < half2Bufs.length; i++) {
      const buffer = [];
      // itterate over all arrays
      for (let j = 0; j < half2Bufs[i].length; j++) {
        // over all 8 bits 
        for (let k = 0; k < 8; k++) {
          buffer.push((readBit(half2Bufs[i], j, k) === 1) ? 2 : 0);
        }
      }
      dish.push(new Uint8Array(buffer));
      // todo
    }
    this.dish = dish;
  }
  

  getAt(pos) {
    if (pos === 0) {
      return this.dish;
    }
    return `0x0${pos}`;
  }

  // trinary
  getHalf(half = 0) {
    const rsp = [];
    for(let row = 0; row < this.dish.length / 2; row++) {
      const buf = Buffer.alloc(32);
      const intBuffer = new Uint8Array(32);
      for(let ints = 0; ints < buf.length; ints++) {
        for (let bits = 0; bits < 8; bits++) {
          let bit = this.dish[row + (this.dish.length / 2) * half][ints * 8 + bits];
          setBit(intBuffer, ints, bits, (bit === 2) ? 1 : bit);
        }
        buf.writeUInt8(intBuffer[ints], ints);
      }
      rsp.push(`0x${buf.toString('hex')}`);
    }
    return rsp;
  }

  countNeighours(col, row) {
    const rowAbove = (row = 0) ? this.dish.length - 1 : row - 1;
    const rowBelow = (row = this.dish.length - 1) ? 0 : row + 1;
    const rows = [rowAbove,row,rowBelow];
    const colPrev = (col = 0) ? this.dish.length - 1 : col - 1;
    const colNext = (col = this.dish.length - 1) ? 0 : col + 1;
    const cols = [colPrev, col, colNext];

    let numA;
    let numB;

    for (let i; i < 3; i++) {
      for (let j; j < 3; j++) {
        if (i != 2 && j != 2) {
          const cell = this.dish[rows[i]][cols[j]];
          if(cell == 1) numA ++;
          if(cell == 2) numB ++;
        }
      }
    }
  }

  return [numA, numB];
}
