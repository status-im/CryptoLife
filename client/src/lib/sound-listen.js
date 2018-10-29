// // Code refactored from https://quiet.github.io/quiet-js/

// const callbacks = []

// export default function addListener(cb) {
//   if (callbacks.indexOf(cb) >= 0) return
//   callbacks.push(bc)
// }

// // START LISTENER

// Quiet.addReadyCallback(() => {
//   Quiet.receiver({
//     // profile: "audible",
//     profile: "ultrasonic-experimental",
//     onReceive: payload => {
//       callbacks.forEach(cb => cb(Quiet.ab2str(payload)))
//     },
//     onCreateFail: reason => {
//       console.log("Failed to create quiet receiver: " + reason)
//     },
//     onReceiveFail: () => {
//       console.error("RCV FAIL")
//     }
//   })
// }, err => {
//   console.error("Unable to start listening", err)
// })
