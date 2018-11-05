'use strict';

const Token = artifacts.require("./Token.sol");
const Voting = artifacts.require("VotingTestHelper.sol");
const Parameterizer = artifacts.require("./Parameterizer.sol");
const Registry = artifacts.require("RegistryTestHelper.sol");
const l = console.log;

if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

contract('Registry', function(accounts) {

    let token, voting, params, registry;
    let first_listing_id;
    let second_listing_id;
    let balances_snapshot;

    const roles = {
        author: accounts[0],
        challenger: accounts[1],
        voter1: accounts[2],
        voter2: accounts[3]
    };

    function assertBigNumberEqual(actual, expected, message=undefined) {
        assert(actual.eq(expected), "{2}expected {0}, but got: {1}".format(expected, actual,
            message ? message + ': ' : ''));
    }

    function getCommitHash(_voteOption, _voteStake, _salt) {
        // keccak256(abi.encode(_voteOption, _voteStake, _salt))
        const encode_uint = uint => {
            let v = web3.toHex(uint).substring(2);
            return ('0'.repeat(64 - v.length)) + v;
        };

        const encoded = '0x' + encode_uint(_voteOption) + encode_uint(_voteStake) + encode_uint(_salt);
        return web3.sha3(encoded, {encoding: 'hex'});
    }

    function BN(n) {
        return new web3.BigNumber(n);
    }

    async function snapshotBalances(token) {
        const ret = {
            [roles.author]: await token.balanceOf(roles.author),
            [roles.challenger]: await token.balanceOf(roles.challenger),
            [roles.voter1]: await token.balanceOf(roles.voter1),
            [roles.voter2]: await token.balanceOf(roles.voter2)
        }
        return ret;
    }

    async function instantiate() {
      const token = await Token.new({from: roles.author});
      const voting = await Voting.new();
      const params = await Parameterizer.new([web3.toWei(1, 'ether'), 60, 60, 60, 50, 50, 60, 60]);
      const registry = await Registry.new(token.address, voting.address, params.address);

      await registry.setTime(1000000000);
      await voting.setTime(1000000000);

      await token.set_registry(registry.address);
      await voting.set_registry(registry.address);

      await token.transfer(roles.challenger, web3.toWei(1000, 'ether'), {from: roles.author});
      await token.transfer(roles.voter1, web3.toWei(1000, 'ether'), {from: roles.author});
      await token.transfer(roles.voter2, web3.toWei(1000, 'ether'), {from: roles.author});

      return [token, voting, params, registry];
    }

    it("test instantiate", async function() {
        [token, voting, params, registry] = await instantiate();
    });

    // APPLICATION ------------------------------------------------------------

    it("test apply", async function() {
        await registry.apply(web3.toHex('foobar'));

        const list = await registry.list();
        assert.equal(list.length, 1);
        first_listing_id = list[0];

        const info = await registry.get_info(first_listing_id);
        assert.equal(info[0], 1);   // APPLICATION
        assert.equal(info[1], false);   // is_challenged
        assert.equal(info[2], false);   // status_can_be_updated
        assert.equal(info[3], web3.toHex('foobar'));   // ipfs_hash
        assert.equal(info[4], '0x');   // edit_ipfs_hash
    });

    it("test application can be accepted", async function() {
        await registry.setTime(1000000100);

        const list = await registry.list();
        assert.equal(list.length, 1);

        const info = await registry.get_info(first_listing_id);
        assert.equal(info[0], 1);   // APPLICATION
        assert.equal(info[1], false);   // is_challenged
        assert.equal(info[2], true);   // status_can_be_updated
        assert.equal(info[3], web3.toHex('foobar'));   // ipfs_hash
        assert.equal(info[4], '0x');   // edit_ipfs_hash
    });

    it("test application accepted", async function() {
        await registry.update_status(first_listing_id);

        const list = await registry.list();
        assert.equal(list.length, 1);

        const info = await registry.get_info(first_listing_id);
        assert.equal(info[0], 2);   // EXISTS
        assert.equal(info[1], false);   // is_challenged
        assert.equal(info[2], false);   // status_can_be_updated
        assert.equal(info[3], web3.toHex('foobar'));   // ipfs_hash
        assert.equal(info[4], '0x');   // edit_ipfs_hash
    });

    it("test another application", async function() {
        await registry.apply(web3.toHex('zzz'));

        const list = await registry.list();
        second_listing_id = list[1];
        assert.equal(list.length, 2);
        assert.equal(list[0], first_listing_id);

        const info = await registry.get_info(second_listing_id);
        assert.equal(info[0], 1);   // APPLICATION
        assert.equal(info[1], false);   // is_challenged
        assert.equal(info[2], false);   // status_can_be_updated
        assert.equal(info[3], web3.toHex('zzz'));   // ipfs_hash
        assert.equal(info[4], '0x');   // edit_ipfs_hash

        await registry.setTime(1000000200);
        await registry.update_status(list[1]);
        assert.equal((await registry.get_info(list[1]))[0], 2);   // EXISTS
    });

    // DELETION ---------------------------------------------------------------

    it("test calling off", async function() {
        await registry.init_exit(first_listing_id);

        const list = await registry.list();
        assert.equal(list.length, 2);
        assert.equal(list[0], first_listing_id);
        assert.equal(list[1], second_listing_id);

        const info = await registry.get_info(first_listing_id);
        assert.equal(info[0], 4);   // DELETING
        assert.equal(info[1], false);   // is_challenged
        assert.equal(info[2], false);   // status_can_be_updated
        assert.equal(info[3], web3.toHex('foobar'));   // ipfs_hash
        assert.equal(info[4], '0x');   // edit_ipfs_hash
    });

    it("test called off", async function() {
        await registry.setTime(1000000300);
        await registry.update_status(first_listing_id);

        const list = await registry.list();
        assert.equal(list.length, 1);
        assert.equal(list[0], second_listing_id);
    });

    it("test calling off: timeout", async function() {
        await registry.setTime(1000000000);
        await registry.init_exit(second_listing_id);

        await registry.setTime(1000001000);
        await registry.update_status(second_listing_id);

        const list = await registry.list();
        assert.equal(list.length, 1);
        assert.equal(list[0], second_listing_id);   // not called off!
    });

    // EDIT -------------------------------------------------------------------

    it("test edit", async function() {
        [token, voting, params, registry] = await instantiate();

        await registry.apply(web3.toHex('foobar'));
        first_listing_id = (await registry.list())[0];
        second_listing_id = undefined;

        await registry.setTime(1000000100);
        await registry.update_status(first_listing_id);
        assert.equal((await registry.get_info(first_listing_id))[0], 2);    // EXISTS

        await registry.edit(first_listing_id, web3.toHex('baz'));

        const list = await registry.list();
        assert.equal(list.length, 1);

        const info = await registry.get_info(first_listing_id);
        assert.equal(info[0], 3);   // EDIT
        assert.equal(info[1], false);   // is_challenged
        assert.equal(info[2], false);   // status_can_be_updated
        assert.equal(info[3], web3.toHex('foobar'));   // ipfs_hash
        assert.equal(info[4], web3.toHex('baz'));   // edit_ipfs_hash
    });

    it("test edit can be accepted", async function() {
        await registry.setTime(1000000200);

        const list = await registry.list();
        assert.equal(list.length, 1);

        const info = await registry.get_info(first_listing_id);
        assert.equal(info[0], 3);   // EDIT
        assert.equal(info[1], false);   // is_challenged
        assert.equal(info[2], true);   // status_can_be_updated
        assert.equal(info[3], web3.toHex('foobar'));   // ipfs_hash
        assert.equal(info[4], web3.toHex('baz'));   // edit_ipfs_hash
    });

    it("test edit accepted", async function() {
        await registry.update_status(first_listing_id);

        const list = await registry.list();
        assert.equal(list.length, 1);

        const info = await registry.get_info(first_listing_id);
        assert.equal(info[0], 2);   // EXISTS
        assert.equal(info[1], false);   // is_challenged
        assert.equal(info[2], false);   // status_can_be_updated
        assert.equal(info[3], web3.toHex('baz'));   // ipfs_hash
        assert.equal(info[4], '0x');   // edit_ipfs_hash
    });

    // APPLICATION CHALLENGE --------------------------------------------------

    function unpackChallengeInfo(ret) {
        const [challenge_id, is_commit, is_reveal, votesFor, votesAgainst, commitEndDate, revealEndDate] = ret;
        return {challenge_id, is_commit, is_reveal, votesFor, votesAgainst, commitEndDate, revealEndDate};
    }

    it("test application challenged", async function() {
        [token, voting, params, registry] = await instantiate();

        await registry.apply(web3.toHex('foobar'), {from: roles.author});

        const list = await registry.list();
        assert.equal(list.length, 1);
        first_listing_id = list[0];
        second_listing_id = undefined;

        balances_snapshot = await snapshotBalances(token);

        await registry.challenge(first_listing_id, 1, {from: roles.challenger});

        let info = await registry.get_info(first_listing_id);
        assert.equal(info[0], 1);   // APPLICATION
        assert.equal(info[1], true);   // is_challenged
        assert.equal(info[2], false);   // status_can_be_updated
        assert.equal(info[3], web3.toHex('foobar'));   // ipfs_hash
        assert.equal(info[4], '0x');   // edit_ipfs_hash

        info = unpackChallengeInfo(await registry.challenge_status(first_listing_id));
        assert.equal(info.challenge_id, 1);
        assert.equal(info.is_commit, true);
        assert.equal(info.is_reveal, false);
        assert.equal(info.votesFor, 0);
        assert.equal(info.votesAgainst, 0);
        assertBigNumberEqual(info.commitEndDate, 1000000000 + 60);
        assertBigNumberEqual(info.revealEndDate, 1000000000 + 60 + 60);
    });

    it("test application challenge voting", async function() {
        await registry.commit_vote(first_listing_id, getCommitHash(1, web3.toWei(5, 'ether'), 500), {from: roles.voter1});
        await registry.commit_vote(first_listing_id, getCommitHash(0, web3.toWei(2, 'ether'), 583), {from: roles.voter2});

        let info = unpackChallengeInfo(await registry.challenge_status(first_listing_id));
        assert.equal(info.is_commit, true);
        assert.equal(info.is_reveal, false);
        assert.equal(info.votesFor, 0);
        assert.equal(info.votesAgainst, 0);

        await registry.setTime(1000000100);
        await voting.setTime(1000000100);

        await registry.reveal_vote(first_listing_id, 1, web3.toWei(5, 'ether'), 500, {from: roles.voter1});
        await registry.reveal_vote(first_listing_id, 0, web3.toWei(2, 'ether'), 583, {from: roles.voter2});

        info = unpackChallengeInfo(await registry.challenge_status(first_listing_id));
        assert.equal(info.is_commit, false);
        assert.equal(info.is_reveal, true);
        assertBigNumberEqual(info.votesFor, web3.toWei(5, 'ether'));
        assertBigNumberEqual(info.votesAgainst, web3.toWei(2, 'ether'));
    });

    it("test application challenge finalization", async function() {
        await registry.setTime(1000000200);
        await voting.setTime(1000000200);

        assert(await registry.can_update_status(first_listing_id));
        await registry.update_status(first_listing_id);

        const list = await registry.list();
        assert.equal(list.length, 1);

        const info = await registry.get_info(first_listing_id);
        assert.equal(info[0], 2);   // EXISTS
        assert.equal(info[1], false);   // is_challenged
        assert.equal(info[2], false);   // status_can_be_updated
        assert.equal(info[3], web3.toHex('foobar'));   // ipfs_hash
        assert.equal(info[4], '0x');   // edit_ipfs_hash

        // checking balances:

        // author won!
        assertBigNumberEqual((await token.balanceOf(roles.author)).sub(balances_snapshot[roles.author]), web3.toWei(0.5, 'ether'));

        // challenger lost!
        assertBigNumberEqual(balances_snapshot[roles.challenger].sub(await token.balanceOf(roles.challenger)), web3.toWei(1, 'ether'));
    });

    it("test application challenge finalization: stakes & rewards of voters", async function() {
        // voters have't claimed stakes & rewards
        assertBigNumberEqual(balances_snapshot[roles.voter1].sub(await token.balanceOf(roles.voter1)), web3.toWei(5 + 1, 'ether'));
        assertBigNumberEqual(balances_snapshot[roles.voter2].sub(await token.balanceOf(roles.voter2)), web3.toWei(2 + 1, 'ether'));

        await registry.claim_reward(1, {from: roles.voter1});

        // voter1 won some reward!
        assertBigNumberEqual((await token.balanceOf(roles.voter1)).sub(balances_snapshot[roles.voter1]), web3.toWei(2.5 + 1, 'ether'));
        // voter2 won NO reward!
    });

    it("test edit challenged", async function() {
        balances_snapshot = await snapshotBalances(token);

        await registry.edit(first_listing_id, web3.toHex('bzzz'), {from: roles.author});

        await registry.challenge(first_listing_id, 3, {from: roles.challenger});

        let info = await registry.get_info(first_listing_id);
        assert.equal(info[0], 3);   // EDIT
        assert.equal(info[1], true);   // is_challenged
        assert.equal(info[2], false);   // status_can_be_updated

        info = unpackChallengeInfo(await registry.challenge_status(first_listing_id));
        assert.equal(info.challenge_id, 2);
        assert.equal(info.is_commit, true);
        assert.equal(info.is_reveal, false);
        assert.equal(info.votesFor, 0);
        assert.equal(info.votesAgainst, 0);
        assertBigNumberEqual(info.commitEndDate, 1000000200 + 60);
        assertBigNumberEqual(info.revealEndDate, 1000000200 + 60 + 60);
    });

    it("test edit challenge voting", async function() {
        await registry.commit_vote(first_listing_id, getCommitHash(1, web3.toWei(5, 'ether'), 500), {from: roles.voter1});
        await registry.commit_vote(first_listing_id, getCommitHash(0, web3.toWei(5, 'ether'), 583), {from: roles.voter2});
        await registry.commit_vote(first_listing_id, getCommitHash(0, web3.toWei(5, 'ether'), 12), {from: roles.challenger});

        let info = unpackChallengeInfo(await registry.challenge_status(first_listing_id));
        assert.equal(info.is_commit, true);
        assert.equal(info.is_reveal, false);
        assert.equal(info.votesFor, 0);
        assert.equal(info.votesAgainst, 0);

        await registry.setTime(1000000300);
        await voting.setTime(1000000300);

        await registry.reveal_vote(first_listing_id, 1, web3.toWei(5, 'ether'), 500, {from: roles.voter1});
        await registry.reveal_vote(first_listing_id, 0, web3.toWei(5, 'ether'), 583, {from: roles.voter2});
        await registry.reveal_vote(first_listing_id, 0, web3.toWei(5, 'ether'), 12, {from: roles.challenger});

        info = unpackChallengeInfo(await registry.challenge_status(first_listing_id));
        assert.equal(info.is_commit, false);
        assert.equal(info.is_reveal, true);
        assertBigNumberEqual(info.votesFor, web3.toWei(5, 'ether'));
        assertBigNumberEqual(info.votesAgainst, web3.toWei(10, 'ether'));
    });

    it("test edit challenge finalization", async function() {
        await registry.setTime(1000000400);
        await voting.setTime(1000000400);

        assert(await registry.can_update_status(first_listing_id));
        await registry.update_status(first_listing_id);

        const list = await registry.list();
        assert.equal(list.length, 1);

        const info = await registry.get_info(first_listing_id);
        assert.equal(info[0], 2);   // EXISTS
        assert.equal(info[1], false);   // is_challenged
        assert.equal(info[2], false);   // status_can_be_updated
        assert.equal(info[3], web3.toHex('foobar'));   // ipfs_hash
        assert.equal(info[4], '0x');   // edit_ipfs_hash

        // checking balances:

        // challenger won!
        assertBigNumberEqual((await token.balanceOf(roles.challenger)).sub(balances_snapshot[roles.challenger]),
            BN(web3.toWei(0.5, 'ether')).sub(web3.toWei(5 + 1, 'ether')));  // challenger stake is still in the registry

        // author lost!
        assertBigNumberEqual(balances_snapshot[roles.author].sub(await token.balanceOf(roles.author)), web3.toWei(1, 'ether'));
    });

    it("test edit challenge finalization: stakes & rewards of voters", async function() {
        await registry.claim_reward(2, {from: roles.voter2});
        await registry.claim_reward(2, {from: roles.challenger});

        // voter1 won NO reward!
        assertBigNumberEqual((await token.balanceOf(roles.voter1)).sub(balances_snapshot[roles.voter1]), web3.toWei(-5 - 1, 'ether'));
        // voter2 won some reward!
        // 0.25: reward from author slashed deposit
        // 2.5: voter1 slashed stake
        // 0.5: part of voter1 static fee
        assertBigNumberEqual((await token.balanceOf(roles.voter2)).sub(balances_snapshot[roles.voter2]), web3.toWei(0.25 + 2.5 + 0.5, 'ether'));
        // challenger won some reward and part of author stake!
        // 0.25: reward from author slashed deposit
        // 0.5: challenge won
        // 2.5: voter1 slashed stake
        // 0.5: part of voter1 static fee
        assertBigNumberEqual((await token.balanceOf(roles.challenger)).sub(balances_snapshot[roles.challenger]), web3.toWei(0.25 + 0.5 + 2.5 + 0.5, 'ether'));
    });
});
