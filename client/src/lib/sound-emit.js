// // Code refactored from https://quiet.github.io/quiet-js/

// let transmit

// export default function (str) {
// 	if (transmit) {
// 		transmit.transmit(Quiet.str2ab(str))
// 	}
// }

// // SET UP TRANSMITTER

// Quiet.addReadyCallback(() => {
// 	// SENDER
// 	transmit = Quiet.transmitter({
// 		// profile: "audible",
// 		profile: "ultrasonic-experimental",
// 		// onFinish: () => console.log("sent"),
// 		clampFrame: false
// 	})
// }, err => {
// 	console.error("ERR:" + err.message)
// })
