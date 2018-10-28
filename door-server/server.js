const express = require("express")
const bodyParser = require("body-parser")
const fs = require("fs")
const path = require("path")
const Web3 = require("web3")
const { toHex } = require("../lib/sign")
const config = require("./config.json")

const bookingsAbiStr = fs.readFileSync(path.resolve(__dirname, "contracts", "bookings.json")).toString()
const bookingsAbi = JSON.parse(bookingsAbiStr)
const validatorAbiStr = fs.readFileSync(path.resolve(__dirname, "contracts", "validator.json")).toString()
const validatorAbi = JSON.parse(validatorAbiStr)

const WEB3_PROVIDER = process.env.WEB3_PROVIDER || config.WEB3_PROVIDER
const VALIDATOR_CONTRACT_ADDRESS = process.env.VALIDATOR_CONTRACT_ADDRESS || config.VALIDATOR_CONTRACT_ADDRESS
const BOOKINGS_CONTRACT_ADDRESS = process.env.BOOKINGS_CONTRACT_ADDRESS || config.BOOKINGS_CONTRACT_ADDRESS
// const DOOR_SERVER_PUBLIC_KEY = process.env.DOOR_SERVER_PUBLIC_KEY || config.DOOR_SERVER_PUBLIC_KEY
const DOOR_SERVER_PRIVATE_KEY = process.env.DOOR_SERVER_PRIVATE_KEY || config.DOOR_SERVER_PRIVATE_KEY
const web3 = new Web3(WEB3_PROVIDER)

const Bookings = new web3.eth.Contract(bookingsAbi, BOOKINGS_CONTRACT_ADDRESS)
const Validator = new web3.eth.Contract(validatorAbi, VALIDATOR_CONTRACT_ADDRESS)

const server = express()

server.use(bodyParser.json({ limit: "50kb" }))

server.post("/access/request", async (req, res) => {
	const result = { ok: false }
	if (!req.body.timestamp || !req.body.signature) {
		return res.status(500).send(result)
	}

	try {
		// recover the public key of the sender
		const signature = req.body.signature.substr(2)
		const r = '0x' + signature.slice(0, 64)
		const s = '0x' + signature.slice(64, 128)
		const v = '0x' + signature.slice(128, 130)
		const v_decimal = web3.utils.toDecimal(v)

		// get the timestamp provided
		const fixed_msg = `\x19Ethereum Signed Message:\n${req.body.timestamp.length}${req.body.timestamp}`
		const hashedTimestamp = web3.utils.sha3(fixed_msg)

		// decode address
		const signerPublicKey = await Validator.methods.verify(r, s, v_decimal, hashedTimestamp).call()

		// get checked in guest
		const currentGuestAddress = await Bookings.methods.checkedInGuest().call()
		if (!currentGuestAddress || !signerPublicKey.toLowerCase || currentGuestAddress == "0x0") {
			return res.status(401).send(result)
		}

		// compare address with blockchain data
		if (signerPublicKey.toLowerCase() != currentGuestAddress.toLowerCase()) {
			return res.status(401).send(result)
		}

		// sign timestamp
		const timestamp = String(Date.now())
		const signatureData = web3.eth.accounts.sign('0x' + toHex(timestamp), DOOR_SERVER_PRIVATE_KEY)

		result.signature = signatureData.signature
		result.timestamp = timestamp
		result.ok = true

		// send it
		res.send(result)
	}
	catch (err) {
		console.error(err)
		res.status(500).send({ error: err.message })
	}
})

server.listen(process.env.PORT || 8000, () => {
	console.log("Listening on port", process.env.PORT || 8000)
})
