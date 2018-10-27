const fs = require("fs")
const path = require("path")
const Web3 = require("web3")

const web3 = new Web3(process.env.WEB3_PROVIDER_URI || "http://localhost:8545")

async function deploy(web3, fromAccount, ABI, bytecode, ...params) {
	const contract = new web3.eth.Contract(JSON.parse(ABI))

	const estimatedGas = await contract.deploy({ data: "0x" + bytecode, arguments: params }).estimateGas()

	const tx = await contract
		.deploy({ data: "0x" + bytecode, arguments: params })
		.send({ from: fromAccount, gas: estimatedGas + 200 })

	return tx.options.address
}

async function deployDapp() {
	const accounts = await web3.eth.getAccounts()

	console.log(`The account used to deploy is ${accounts[0]}`)
	console.log("Current balance: ", await web3.eth.getBalance(accounts[0]), "\n")

	const bookingsAbi = fs.readFileSync(path.resolve(__dirname, "..", "build", "__contracts_Bookings_sol_Bookings.abi")).toString()
	const bookingsBytecode = fs.readFileSync(path.resolve(__dirname, "..", "build", "__contracts_Bookings_sol_Bookings.bin")).toString()

	try {
		console.log("Deploying Bookings...")
		const bookingsAddress = await deploy(web3, accounts[0], bookingsAbi, bookingsBytecode, accounts[0], 300000000000000000, 300000000000000000)
		console.log(`- Bookings deployed at ${bookingsAddress}`)
	}
	catch (err) {
		console.error("\nUnable to deploy:", err.message, "\n")
		process.exit(1)
	}
	process.exit()
}

deployDapp();
