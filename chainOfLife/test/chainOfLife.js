import chai from 'chai';
const ChainOfLife = artifacts.require("./ChainOfLife.sol");


const should = chai
  .use(require('chai-as-promised'))
  .should();



contract('ChainOfLife', (accounts) => {
  let game;
  const alice = accounts[0];
  const bob = accounts[1];
  const gameId = '0x1100000000000000000000000000000000000000000000000000000000000000';
  const bobField = ['0x00','0x0000000000000000000000000000000000000000000000000000000000000070','0x00','0x00','0x00','0x00','0x00','0x00',
  '0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00',
  '0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00',
  '0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00'];

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
    console.log(tx.receipt.logs);
    let eventField = tx.receipt.logs[0].data;
    eventField = eventField.slice(2);
    eventField = eventField.match(/.{1,64}/g);
    eventField = eventField.slice(2);
    eventField = eventField.map(i => '0x' + i );
    console.log(eventField);
  	assert.deepEqual(eventField.map(Number), bobField.map(Number)); // check that Alice can get Bob's field in the event
  	const rsp = await game.games(gameId);
    assert.equal(rsp[1], bob);
    assert.equal(rsp[3],1);
  });

  it("alice should be able to submit solution", async () => {
  	assert(false);
  });

  it("anyone should be able to finalize game after timeout", async () => {
  	assert(false);
  });

  it("should prevent finalization before timeout", async () => {
  	assert(false);
  });
});