const { randomBytes } = require('crypto');

const sha256 = require('js-sha256');
const secp256k1 = require('./secp256k1-node/js');


let toHex = new Array(16);
let toStr = new Array(16);
for (let i = 0; i < 10; i++) {
	toHex[i] = "" + i + "";
	toStr["" + i + ""] = i;
}
toHex[10] = 'a';
toHex[11] = 'b';
toHex[12] = 'c';
toHex[13] = 'd';
toHex[14] = 'e';
toHex[15] = 'f';
toStr['a'] = 10;
toStr['b'] = 11;
toStr['c'] = 12;
toStr['d'] = 13;
toStr['e'] = 14;
toStr['f'] = 15;

function numbersToHex(str) {
	let hex = '';
	for (let i = 0; i < str.length; i++)
		hex += toHex[Math.floor((str[i] + 128) / 16)] + toHex[(str[i] + 128) % 16];
	return hex;
}

function hexToNumbers(hex) {
	let vec = "";
	for (let i = 0; i < hex.length; i += 2) {
		let numm = (toStr[hex[i]] * 16 + toStr[hex[i + 1]]);
		vec += numm.toString();
	}
	return vec;
}

let private_key
do {
	private_key = randomBytes(32);
} while (!secp256k1.privateKeyVerify(private_key));

const public_key = secp256k1.publicKeyCreate(private_key);

let r = "", s = "";
let pointX = "", pointY = "";
let point = secp256k1.publicKeyPoint(public_key);
for (let i = 0; i < point.x.words.length; i++) {
  pointX += point.x.words[i].toString();
}
for (let i = 0; i < point.y.words.length; i++) {
  pointY += point.y.words[i].toString();
}

//console.log(private_key, ' ', parseInt(public_key, 16));
console.log(private_key.toString('hex'));
console.log(public_key.toString('hex'));
const message = "Congratulations You are a super gay";
const msg = sha256(message);
const sign = secp256k1.sign(new Buffer(msg, "hex"), private_key);
//console.log(sign.signature.slice(0, 32), sign.signature.slice(32, 64));
//console.log(sign.signature);
let rs = secp256k1.signatureExport(sign.signature);
let rbuf = rs.slice(0, 32);
let sbuf = rs.slice(32, 64);
let rhex = rbuf.toString("hex");
let shex = sbuf.toString("hex");
r = hexToNumbers(rhex);
s = hexToNumbers(shex)

//console.log(public_key.slice(1, 33), public_key.slice(32, 64))
console.log(rs);
console.log(point.x.words);
console.log(secp256k1.verify(new Buffer(msg, "hex"), sign.signature, public_key));
console.log("To smart contract:");
console.log("hash(bytes32):", msg);
console.log("rs(uint[2]): [", r, ",", s, "]");
console.log("publicKey(uint[2]): [", pointX, ",", pointY, "]");
