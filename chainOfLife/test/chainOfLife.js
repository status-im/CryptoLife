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

  before(async() => {
  	game = await ChainOfLife.new();
  });

  it('alice should be able to register a new game', async () => {
  	const tx = await game.register(gameId, {from: alice}).should.be.fulfilled;
  	assert.equal(tx.receipt.logs[0].topics[1], gameId); // check that hash in event
  	const rsp = await game.games('0x11');
  	assert.equal(rsp[0], alice);
  	
  });

  it('bob should allow to be able to join registered game', async () => {
  	assert(false);
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