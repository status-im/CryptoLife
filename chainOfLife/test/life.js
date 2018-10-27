import chai from 'chai';
const Life = artifacts.require("./Life.sol");

const should = chai
  .use(require('chai-as-promised'))
  .should();



contract('Life', (accounts) => {
  let life;
  const initField = ['0x00','0x0000000000000000000000000000000000000000000000000000000000000070','0x00','0x00','0x00','0x00','0x00','0x00',
                     '0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00',
                     '0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00',
                     '0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00'];

  const expectedField = ['0x0000000000000000000000000000000000000000000000000000000000000020',
                        '0x0000000000000000000000000000000000000000000000000000000000000020',
                        '0x0000000000000000000000000000000000000000000000000000000000000020',
                        '0x00','0x00','0x00','0x00','0x00',
                        '0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00',
                        '0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00',
                        '0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00'];


  before(async() => {
  	life = await Life.new();
  });

  it('should oscilate', async () => {
    const resultField = await life.life(initField).should.be.fulfilled;
    console.log(resultField);
  });
});