import chai from 'chai';
const Life = artifacts.require("./Life.sol");

const should = chai
  .use(require('chai-as-promised'))
  .should();



contract('Life', (accounts) => {
  let life;
  const z = '0x0000000000000000000000000000000000000000000000000000000000000000';
  const initField = [z, '0x0000000000000000000000000000000000000000000000000000000000000070', z,
                        z, z, z, z, z, 
                        z, z, z, z, z, z, z, z, 
                        z, z, z, z, z, z, z, z, 
                        z, z, z, z, z, z, z, z, ];

  const expectedField = ['0x0000000000000000000000000000000000000000000000000000000000000020',
                        '0x0000000000000000000000000000000000000000000000000000000000000020',
                        '0x0000000000000000000000000000000000000000000000000000000000000020',
                        z, z, z, z, z, 
                        z, z, z, z, z, z, z, z, 
                        z, z, z, z, z, z, z, z, 
                        z, z, z, z, z, z, z, z, ];


  before(async() => {
  	life = await Life.new();
  });

  it('should oscilate', async () => {
    const resultField = await life.life(initField).should.be.fulfilled;
    console.log(resultField);
    assert.deepEqual(resultField, expectedField);
    
  });
});