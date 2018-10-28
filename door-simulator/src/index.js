import React from "react"
import ReactDOM from "react-dom"

import getBookingsInstance from "../../client/src/contracts/bookings.js"
import getValidatorInstance from "../../client/src/contracts/validator.js"

const Bookings = getBookingsInstance()
const Validator = getValidatorInstance()

class DoorSimulator extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			open: false,
			receivedPayload: ""
		}

		// Clean if only partial content was received
		setInterval(() => {
			this.setState({ receivedPayload: "" })
		}, 5000)

		// Close after a while
		setInterval(() => {
			this.setState({ open: false })
		}, 10000)
	}

	componentDidMount() {
		// INIT AUDIO
		Quiet.addReadyCallback(() => {
			// RECEIVER
			Quiet.receiver({
				// profile: "audible",
				profile: "ultrasonic-experimental",
				onReceive: payload => this.gotPayload(Quiet.ab2str(payload)),
				onCreateFail: reason => alert("failed to create quiet receiver: " + reason),
				onReceiveFail: () => console.error("RCV FAIL")
			});

			// SENDER
			const transmit = Quiet.transmitter({
				// profile: "audible",
				profile: "ultrasonic-experimental",
				onFinish: () => console.log("sent"),
				clampFrame: false
			});

			setTimeout(() => {
				const text = "WELCOME TO DHOTEL"
				transmit.transmit(Quiet.str2ab(text));
			}, 1800)
		}, err => {
			console.log("ERR", err)
		});
	}

	gotPayload(str) {
		if (!str) return
		this.setState({ receivedPayload: this.state.receivedPayload + str })
		if (str.length < 100) {
			this.checkPayload(this.state.receivedPayload + str)
		}
	}

	checkPayload(payload) {
		try {
			payload = JSON.parse(payload)
			if (payload && payload.signature && payload.timestamp) {
				this.verifySignature(payload.signature, payload.timestamp)
			}
		}
		catch (err) {
			alert("There was an error while parsing the response")
		}
	}

	verifySignature(signature, timestamp) {
		// recover the public key of the sender
		signature = signature.substr(2)
		const r = '0x' + signature.slice(0, 64)
		const s = '0x' + signature.slice(64, 128)
		const v = '0x' + signature.slice(128, 130)
		const v_decimal = web3.utils.toDecimal(v)

		// get the timestamp provided
		const fixed_msg = `\x19Ethereum Signed Message:\n${timestamp.length}${timestamp}`
		const hashedTimestamp = web3.utils.sha3(fixed_msg)

		// decode address
		Validator.methods.verify(r, s, v_decimal, hashedTimestamp).call()
			.then(signerPublicKey => {
				// get the checked in guest
				return Bookings.methods.checkedInGuest().call().then(currentGuestAddress => {
					console.log("RECEIVED", signerPublicKey, currentGuestAddress)

					if (!currentGuestAddress || !currentGuestAddress.toLowerCase || currentGuestAddress == "0x0") {
						return alert("Invalid signature")
					}

					// compare address with blockchain data
					if (signerPublicKey.toLowerCase() != currentGuestAddress.toLowerCase()) {
						return alert("Invalid signature")
					}

					this.setState({ open: true })
				})
			})
			.catch(err => {
				alert("There was en error while validating the server signature")
			})
	}

	render() {
		return <div id="main" className={this.state.open ? "door-open" : "door-closed"}>
			<div>
				<h1>Door simulator</h1>
				<h2>The door is currently {this.state.open ? "open" : "closed"}</h2>
			</div>
		</div>
	}
}

ReactDOM.render(<DoorSimulator />, document.getElementById("root"))
