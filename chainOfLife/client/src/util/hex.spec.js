import { assert } from 'chai';
import { encodeConfigBytes32Array, unpack, getConfigHash } from './hex';

describe('Hex', () => {


  it('should allow to split', () => {
    assert.deepEqual(unpack(['0x04bca0774ff88ad9f4dba8e192f0c3d5435f233d004d46ed8351fe1b89b4a843']), 
    [ '0x00000000000000000000000000000000000000000000000004bca0774ff88ad9',
      '0x000000000000000000000000000000000000000000000000f4dba8e192f0c3d5',
      '0x000000000000000000000000000000000000000000000000435f233d004d46ed',
      '0x0000000000000000000000000000000000000000000000008351fe1b89b4a843' ]
    );
  });

  it('should hash', () => {
  	const rsp = getConfigHash([true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false]);
  	console.log(rsp);
  });
});