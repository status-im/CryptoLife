function toHex(text) {
	let result = ''
	for (let i = 0; i < text.length; i++) {
		result += String(text.charCodeAt(i).toString(16))
	}
	return result
}

module.exports = {
	toHex
}