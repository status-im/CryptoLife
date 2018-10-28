import { assert } from 'chai';
import P2life from './p2life';

describe('P2life', () => {

  const halfA = ['0x00000000000000000000000000000000000000000000000000000000000000e5',
      '0x00000000000000000000000000000000000000000000000000000000000000aa',
      '0x00000000000000000000000000000000000000000000000000000000000000bb',
      '0x00000000000000000000000000000000000000000000000000000000000000cc'];
  const z = '0x000000000000000000000000000000000000000000000000000000000000009b';
  const a = '0x0000000000000000000000000000000000000000000000000000000000000001';
  const b = '0x0000000000000000000000000000000000000000000000000000000000000002';
  const o = '0x0000000000000000000000000000000000000000000000000000000000000070';
  const empty = '0x0000000000000000000000000000000000000000000000000000000000000000';
  const halfB = [z,z,z,z];

  it('should allow to init', () => {
    const p2life = new P2life(halfA, halfB);
    assert.deepEqual(p2life.getHalf(0), halfA);
    assert.deepEqual(p2life.getHalf(1), halfB);
  });

  it('should allow to init and read hex', () => {
    const p2life = new P2life([a,a,a,a], [b,b,b,b]);
    assert.deepEqual(p2life.getHalf(0), [a,a,a,a]);
    assert.deepEqual(p2life.getHalf(1), [b,b,b,b]);
  });

  it('should count neghbours', () => {
    const p2life = new P2life([a,a,a,a], [b,b,b,b]);
    assert.deepEqual(p2life.countNeighbours(3,1),[2,1]);
  });

  it('should oscilate like hell', () => {
    const p2life = new P2life([empty,o,empty,empty], [empty,empty,o,empty]);
    const nextGen = p2life.getNextGeneration();
    const nextGen2 = p2life.getNextGeneration(p2life.getNextGeneration(nextGen));
    assert.deepEqual(nextGen,nextGen2);
  })

  it('should use randomnes', () => {
    const a = '0x0000000000000000000000000000000000000000000000000000000000000002';
    const b = '0x0000000000000000000000000000000000000000000000000000000000000005';
    const c = '0x0000000000000000000000000000000000000000000000000000000000000007';
    const p2life = new P2life([empty,empty,a,b], [c,empty,empty,empty]);
    const nextGen = p2life.getNextGeneration();
    assert.deepEqual(p2life.getHalf(0, nextGen), [empty, empty, 
      '0x0000000000000000000000000000000000000000000000000000000000000002',
      '0x0000000000000000000000000000000000000000000000000000000000000002'
    ]);
    assert.deepEqual(p2life.getHalf(1, nextGen), [empty, empty, 
      '0x0000000000000000000000000000000000000000000000000000000000000002',
      '0x0000000000000000000000000000000000000000000000000000000000000002'
    ]);
    assert.equal(p2life.getWinner(nextGen), 1);
    console.log(p2life.getHalf(0, nextGen));
    console.log(p2life.getHalf(1, nextGen));
  })

});