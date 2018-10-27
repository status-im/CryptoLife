import chai from 'chai';
const Life = artifacts.require("./Life.sol");

const should = chai
  .use(require('chai-as-promised'))
  .should();



contract('Life', (accounts) => {
  let life;
  const z = '0x0000000000000000000000000000000000000000000000000000000000000000';
  const initField = [z, '0x0000000000000000000000000000000000000000000000000000000000000015', z, z,
                        z,
                        '0x000000000000000000000000000000000000000000000000000000000000002a',
                        z,
                        z, 
                        z, z, z, z, z, z, z, z, 
                        z, z, z, z, z, z, z, z, 
                        z, z, z, z, z, z, z, z, ];


  before(async() => {
  	life = await Life.new();
  });

  it('should oscilate', async () => {
    const state = await life.life(initField).should.be.fulfilled;
    assert(state[0] !== initField[0]);
    const resultField = await life.life(state).should.be.fulfilled;
    assert.deepEqual(resultField, initField);
    
  });
});