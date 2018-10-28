import { assert } from 'chai';
import P2life from './p2life';

describe('P2life', () => {

  const halfA = ['0xeb109d51e450de9c8f4f06e24f7c9d2c09d5c96a9c29a83bdc4f2514763489e5',
      '0xaa109d51e450de9c8f4f06e24f7c9d2c09d5c96a9c29a83bdc4f2514763489aa',
      '0xbb109d51e450de9c8f4f06e24f7c9d2c09d5c96a9c29a83bdc4f2514763489bb',
      '0xcc109d51e450de9c8f4f06e24f7c9d2c09d5c96a9c29a83bdc4f2514763489cc'];
  const z = '0x66c13038a65109a35a0f96de5a3de14336181341118f8dedbd260655a525529b';
  const a = '0xff00000000000000000000000000000000000000000000000000000000000001';
  const b = '0xf000000000000000000000000000000000000000000000000000000000000002';
  const o = '0xff00000000000000000000000000000000000000000000000000000000000070';
  const empty = '0xf000000000000000000000000000000000000000000000000000000000000000';
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

});