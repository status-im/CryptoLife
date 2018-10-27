const Salaries = artifacts.require("./Salaries.sol");

const increaseBlockHeight = async count => {
	for (let i = 0; i < count; ++i) {
		await web3.eth.sendTransaction({
			from: web3.eth.accounts[0],
			to: web3.eth.accounts[9],
			value: "1000"
		})
	}
};

contract("Salaries", accounts => {
	let salariesInstance;

	it("...should add an employee account", async () => {
		salariesInstance = await Salaries.deployed();

		await salariesInstance.addEmployee(accounts[1], "Alicia Drake", "Lead Engineer");

		const employee = await salariesInstance.employees(accounts[1]);

		assert.equal(employee[0], "Alicia Drake", "The employee's name Alicia Drake was not stored.");
		assert.equal(employee[1], "Lead Engineer", "The employee's role Lead Engineer was not stored.");
	});

	it("...should successfully start a streamed salary", async() => {
		const interval = "1";
		await salariesInstance.startSalary(
			accounts[1],
			web3.eth.blockNumber + 1,
			web3.eth.blockNumber + 11,
			web3.toWei("0.1", "ether"),
			interval,
			{
				from: accounts[0],
				value: web3.toWei("1", "ether")
			}
		);

		const balance = await salariesInstance.balanceOf(accounts[1]);
		assert.equal(balance.toString(), web3.toWei("0.1", "ether"), "Balance right after salary creation is not Ξ0.1");
	});

	it("...should yield a correct balance" , async() => {
		await increaseBlockHeight(4);
		let balance = await salariesInstance.balanceOf(accounts[1]);
		assert.equal(balance.toString(), web3.toWei("0.5", "ether"), "Balance is not Ξ0.5");
	});

	it("...should successfully checkpoint funds", async() => {

	});

	it("...should successfully redeem the salary", async() => {

	});
});
