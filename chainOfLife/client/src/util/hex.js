import getWeb3 from './getWeb3';

import Buffer from 'buffer';

Buffer = Buffer.Buffer;

const binToHex = {
  '0000' : '0',
  '0001' : '1',
  '0010' : '2',
  '0011' : '3',
  '0100' : '4',
  '0101' : '5',
  '0110' : '6',
  '0111' : '7',
  '1000' : '8',
  '1001' : '9',
  '1010' : 'a',
  '1011' : 'b',
  '1100' : 'c',
  '1101' : 'd',
  '1110' : 'e',
  '1111' : 'f'
}

function getConfigHash(boolArray) {
  return getWeb3().utils.soliditySha3(encodeConfig(boolArray));
}

function encodeConfig(boolArray) {
  let bin = boolArray.reduce((acc, curr) => {
      return acc + (curr ? '1' : '0');
    }, "");
  let hex = splitIntoSubArray(bin, 4).map(bin => {
    return binToHex[bin];
  }).reduce((acc, curr) => {
    return acc + curr;
  }, "");
  return '0x' + hex;
}

function encodeConfigBytes32Array(boolArray) {
  const str = encodeConfig(boolArray).replace('0x', '');
  return splitIntoSubArray(str, 32).map(bytes32 => '0x' + bytes32);
}

function splitIntoSubArray(arr, count) {
    let newArray = [];
    const numIter = Math.floor(arr.length/count);
    let offset = 0;
    for (var i = 0; i < numIter; i++) {
      newArray.push(arr.slice(offset, offset + count));
      offset += count;
    }
    return newArray;
}

function unpack(packed, size = 8) {
  console.log(Buffer);
  const rsp = [];
  for (var i = 0; i < packed.length; i++) {
    const buf = Buffer.from(packed[i].replace('0x', ''), 'hex');
    for (var j = 0; j < buf.length / size; j++) {
      const elem = Buffer.alloc(32);
      buf.slice(j * size, (j + 1) * size).copy(elem, 32 - size);
      rsp.push(`0x${elem.toString('hex')}`);
    }
  }
  return rsp;
}

export { encodeConfig, splitIntoSubArray, getConfigHash, encodeConfigBytes32Array, unpack };