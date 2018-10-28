const SynesticContract = artifacts.require('Synestic');

let synestic;

let owner;

let someAccount;

contract('Synestic', (accounts) => {
  beforeEach(async () => {
    owner = accounts[0];
    someAccount = accounts[1];
    synestic = await SynesticContract.new({ from: owner });
  });

  it('constructor: should mint one', async () => {
    const tokenCount = parseInt(await synestic.totalSupply.call(), 10);

    assert.equal(tokenCount, 1);
  });

  it('admin: should be able to mint tokens', async () => {
    const tokenCount = parseInt(await synestic.totalSupply.call(), 10);

    await synestic.mintForAdmin({ from: owner });

    const tokenCountAfterMint = parseInt(await synestic.totalSupply.call(), 10);

    assert.equal(
      tokenCount + 1,
      tokenCountAfterMint,
    );
  });

  it('token owner: should be able to remix 2 of his tokens to a new beat', async () => {
    let newCoin;
    newCoin = await synestic.mintForAdmin({ from: owner });
    const tok1 = newCoin.logs[0].args._tokenId;

    newCoin = await synestic.mintForAdmin({ from: owner });
    const tok2 = newCoin.logs[0].args._tokenId;

    await synestic.transferFrom(owner, someAccount, tok1);
    await synestic.transferFrom(owner, someAccount, tok2);

    const remixedCoin = await synestic.remix(tok1, tok2, { from: someAccount });

    assert.equal(
      remixedCoin.logs[0].args._from,
      '0x0000000000000000000000000000000000000000',
    );

    assert.equal(
      remixedCoin.logs[0].args._to,
      someAccount,
    );
  });

  it('token: get token', async () => {
    const newBeat = await synestic.mintForAdmin({ from: owner });

    const beat = await synestic.getBeat(newBeat.logs[0].args._tokenId);

    // ParentA is 0
    assert.equal(
      0x0,
      beat[0],
    );

    // ParentB is 0
    assert.equal(
      0x0,
      beat[1],
    );

    // Params should not be 0 (unless we're very unlucky)
    for (let i = 0; i < beat[2].length; i += 1) {
      assert.notEqual(
        0x0,
        beat[2][i],
      );
    }
  });
});

