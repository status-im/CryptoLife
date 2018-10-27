import chai from 'chai';
const ChainOfLife = artifacts.require("./ChainOfLife.sol");
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const Utils = require('ethereumjs-utils');


const should = chai
  .use(require('chai-as-promised'))
  .should();



contract('ChainOfLife', (accounts) => {
  let game;
  const alice = accounts[0];
  const bob = accounts[1];
  const bobField = ['0x00','0x0000000000000000000000000000000000000000000000000000000000000070','0x00','0x00','0x00','0x00','0x00','0x00',
  '0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00',
  '0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00',
  '0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00'];
  const aliceField = ['0x0000000000000000000000000000000000000000000000000000000000000070',
  '0x0000000000000000000000000000000000000000000000000000000000000070',
  '0x0000000000000000000000000000000000000000000000000000000000000070',
  '0x0000000000000000000000000000000000000000000000000000000000000070',
  '0x0000000000000000000000000000000000000000000000000000000000000070',
  '0x0000000000000000000000000000000000000000000000000000000000000070',
  '0x0000000000000000000000000000000000000000000000000000000000000070',
  '0x0000000000000000000000000000000000000000000000000000000000000070',
  '0x0000000000000000000000000000000000000000000000000000000000000070',
  '0x0000000000000000000000000000000000000000000000000000000000000070',
  '0x0000000000000000000000000000000000000000000000000000000000000070',
  '0x0000000000000000000000000000000000000000000000000000000000000070',
  '0x0000000000000000000000000000000000000000000000000000000000000070',
  '0x0000000000000000000000000000000000000000000000000000000000000070',
  '0x0000000000000000000000000000000000000000000000000000000000000070',
  '0x0000000000000000000000000000000000000000000000000000000000000070',
  '0x0000000000000000000000000000000000000000000000000000000000000070',
  '0x0000000000000000000000000000000000000000000000000000000000000070',
  '0x0000000000000000000000000000000000000000000000000000000000000070',
  '0x0000000000000000000000000000000000000000000000000000000000000070',
  '0x0000000000000000000000000000000000000000000000000000000000000070',
  '0x0000000000000000000000000000000000000000000000000000000000000070',
  '0x0000000000000000000000000000000000000000000000000000000000000070',
  '0x0000000000000000000000000000000000000000000000000000000000000070',
  '0x0000000000000000000000000000000000000000000000000000000000000070',
  '0x0000000000000000000000000000000000000000000000000000000000000070',
  '0x0000000000000000000000000000000000000000000000000000000000000070',
  '0x0000000000000000000000000000000000000000000000000000000000000070',
  '0x0000000000000000000000000000000000000000000000000000000000000070',
  '0x0000000000000000000000000000000000000000000000000000000000000070',
  '0x0000000000000000000000000000000000000000000000000000000000000070'];
  
  const aliceBuffer = Buffer.alloc(aliceField.length * 32);
  for(let i = 0; i < aliceField.length; i++) {
    Buffer.from(aliceField[i].replace("0x",""),"hex").copy(aliceBuffer, i * 32, 0, 32);
  }
  //console.log(aliceBuffer.toString('hex'));
  //const gameId = web3.utils.soliditySha3(aliceBuffer);
  const gameId = "0x" + Utils.sha3(aliceBuffer).toString('hex');
  //console.log("gameId: " + gameId);

  before(async() => {
  	game = await ChainOfLife.new();
  });

  it('alice should be able to register a new game', async () => {
  	const tx = await game.register(gameId, {from: alice}).should.be.fulfilled;
  	assert.equal(tx.receipt.logs[0].topics[1], gameId); // check that hash in event
  	const rsp = await game.games(gameId);
  	assert.equal(rsp[0], alice); 	
  });

  it('bob should allow to be able to join registered game', async () => {
    const tx = await game.join(gameId, bobField, {from: bob}).should.be.fulfilled;
    //console.log(tx.receipt.logs);
    let eventField = tx.receipt.logs[0].data;
    eventField = eventField.slice(2);
    eventField = eventField.match(/.{1,64}/g);
    eventField = eventField.slice(2);
    eventField = eventField.map(i => '0x' + i );
    //console.log(eventField);
  	assert.deepEqual(eventField.map(Number), bobField.map(Number)); // check that Alice can get Bob's field in the event
  	const rsp = await game.games(gameId);
    assert.equal(rsp[1], bob);
    assert.equal(rsp[3],1);
  });

  it("alice should be able to submit solution", async () => {
    const isWinner = true;
    const tx = await game.resolve(gameId, aliceField, isWinner, {from: alice}).should.be.fulfilled;

    //console.log(tx.receipt.logs);
    assert.equal(parseInt(tx.receipt.logs[0].topics[2]), parseInt(alice)); // check winner is in the event
  	const rsp = await game.games(gameId);
  	assert.equal(rsp[3], 2);
  });

  it("anyone should be able to finalize game after timeout", async () => {
  	assert(false);
  });

  it("should prevent finalization before timeout", async () => {
  	assert(false);
  });
});