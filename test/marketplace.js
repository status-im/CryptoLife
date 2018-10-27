const Marketplace = artifacts.require("./Marketplace.sol");

contract('Marketplace', function(accounts) {
	it("sign, verify, submit, payment", async () => {
		const m = await Marketplace.new();
		const now = new Date().getTime() / 1000 | 0;

		// define contact parameters
		const contractId = 1;
		const client = accounts[1];
		const supplier = accounts[2];
		const amount = 100;
		const signDueDate = now + 30; // valid within 30 seconds from now
		const validityPeriod = 30; // 30 seconds to provide services and pay
		const disputePeriod = 30; // 30 seconds to resolve dispute
		const contract = await m.constructContract(
			contractId,
			client,
			supplier,
			amount,
			signDueDate,
			validityPeriod,
			disputePeriod
		);

		// sign the contract by client
		const p = signAndExtract(client, contract);

		// verify the signature
		assert.equal(client, await m.recoverEthSign(
			contractId,
			client,
			supplier,
			amount,
			signDueDate,
			validityPeriod,
			disputePeriod,
			p.v,
			p.r,
			p.s
		), "invalid signature");

		// submit signed contract
		await m.submitSignedContract(
			contractId,
			client,
			supplier,
			amount,
			signDueDate,
			validityPeriod,
			disputePeriod,
			p.v,
			p.r,
			p.s,
			{from: supplier}
		);

		// check that contract exists
		assert.equal(client, (await m.contractsRepository(contractId))[0], "contract doesn't exist");

		// client pays full amount according to the terms of contract
		await m.pay(contractId, amount, {from: client, value: amount});

		// check that contract appeared in histories of client and supplier
		assert.equal(contractId, await m.contractsHistory(client, 0), "contract doesn't exist in clients history")
	});

});

// START: Geth specific functions // https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sign
function extractEllipticCurveParameters(signature) {
	const parameters = {};
	parameters.r = "0x" + signature.slice(2, 66);
	parameters.s = "0x" + signature.slice(66, 130);
	parameters.v = web3.toBigNumber("0x" + signature.slice(130, 132)).toNumber();
	return parameters;
}

function signAndExtract(account, message) {
	const signature = web3.eth.sign(account, message);
	return extractEllipticCurveParameters(signature);
}
// END: Geth specific functions
