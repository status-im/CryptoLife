import { assert } from 'chai';
import P2life from './p2life';

describe('P2life', () => {

  const halfA = ['0xeb109d51e450de9c8f4f06e24f7c9d2c09d5c96a9c29a83bdc4f2514763489e5',
      '0xaa109d51e450de9c8f4f06e24f7c9d2c09d5c96a9c29a83bdc4f2514763489aa',
      '0xbb109d51e450de9c8f4f06e24f7c9d2c09d5c96a9c29a83bdc4f2514763489bb',
      '0xcc109d51e450de9c8f4f06e24f7c9d2c09d5c96a9c29a83bdc4f2514763489cc'];
  const z = '0x66c13038a65109a35a0f96de5a3de14336181341118f8dedbd260655a525529b';
  const halfB = [z,z,z,z];

  it('should allow to init', () => {
    const p2life = new P2life(halfA, halfB);
    assert.deepEqual(p2life.getHalf(0), halfA);
    assert.deepEqual(p2life.getHalf(1), halfB);
  });
});