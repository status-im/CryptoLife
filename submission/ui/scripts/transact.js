const Tx = window.EthTx;
const Buffer = window.Buffer.Buffer;
const ADDRESS = wallet.getKeypair().address;
const PRIVATE_KEY = wallet.getKeypair().privateKey;
console.log(wallet.getKeypair());
console.log(PRIVATE_KEY, ADDRESS);
console.log(PRIVATE_KEY.substring(2));
const privateKeyBuffer = new Buffer(PRIVATE_KEY.substring(2), 'hex') // not used
//const CONTRACT = "0xd81a545c6b3f721eb0d0021265e3e05e6b2ebfb6"; // ropsten
const CONTRACT = "0x49a44b59c6bd3f139fbb5d955759cc53597bba44"; // local
const nonce = web3.eth.getTransactionCount(ADDRESS);

let gasPrice = 0;
fetch('https://ethgasstation.info/json/ethgasAPI.json')
	.then(res => res.json())
	.then(json => gasPrice = json);

let mimimiaContract = new web3.eth.Contract(
	ABI,
	CONTRACT,
);

const includeSecret = async (_ipfs_hash, _price) => {
	try {
	console.log('includeSecret')
	console.log('PublicAddress: ', ADDRESS);
	const nonce = await web3.eth.getTransactionCount(ADDRESS);
	console.log('Nonce: ', nonce);
	const data = await mimimiaContract.methods.include(_ipfs_hash, _price).encodeABI();
	console.log('Data: ', data);
	const gasLimit = await mimimiaContract.methods.include(_ipfs_hash, _price).estimateGas();
	console.log('gasLimit: ', gasLimit);

	const rawTx = {
		nonce: nonce,
		gasLimit,
		gasPrice: (gasPrice.fast+20)*100000000,
		from: ADDRESS,
		to: CONTRACT,
		value: 0,
		data,
	};

	// console.log('GasPrice: : ', gasPrice);
	console.log('ContractAddress: ', CONTRACT);
	console.log('Tx: ', rawTx);

	const tx = new Tx(rawTx);
	tx.sign(privateKeyBuffer);

	const serializedTx = tx.serialize();

	web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
		.on('transactionHash', (txHash) => {
			console.log('TransactionHash:' , txHash);
		})
		.on('receipt', (rec) => {
			console.log('Receipt:' , rec);
		});

	} catch(e) {
		console.log("tx error: ", e)
	}
}

const acceptBid = async (_uid) => {
	try {
	console.log('includeSecret')
	console.log('PublicAddress: ', ADDRESS);
	const nonce = await web3.eth.getTransactionCount(ADDRESS);
	console.log('Nonce: ', nonce);
	const data = await mimimiaContract.methods.bid(_uid).encodeABI();
	console.log('Data: ', data);
	const gasLimit = await mimimiaContract.methods.bid(_uid).estimateGas();
	console.log('gasLimit: ', gasLimit);

	const rawTx = {
		nonce: nonce,
		gasLimit,
		gasPrice: (gasPrice.fast+20)*100000000,
		from: ADDRESS,
		to: CONTRACT,
		value: 0,
		data,
	};

	// console.log('GasPrice: : ', gasPrice);
	console.log('ContractAddress: ', CONTRACT);
	console.log('Tx: ', rawTx);

	const tx = new Tx(rawTx);
	tx.sign(privateKeyBuffer);

	const serializedTx = tx.serialize();

	web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
		.on('transactionHash', (txHash) => {
			console.log('TransactionHash:' , txHash);
		})
		.on('receipt', (rec) => {
			console.log('Receipt:' , rec);
		});

	} catch(e) {
		console.log("tx error: ", e)
	}
}

const makeBid = async (_uid) => {
	try {
	console.log('includeSecret')
	console.log('PublicAddress: ', ADDRESS);
	const nonce = await web3.eth.getTransactionCount(ADDRESS);
	console.log('Nonce: ', nonce);
	const data = await mimimiaContract.methods.bid(_uid).encodeABI();
	console.log('Data: ', data);
	const gasLimit = await mimimiaContract.methods.bid(_uid).estimateGas();
	console.log('gasLimit: ', gasLimit);

	const rawTx = {
		nonce: nonce,
		gasLimit,
		gasPrice: (gasPrice.fast+20)*100000000,
		from: ADDRESS,
		to: CONTRACT,
		value: 0,
		data,
	};

	// console.log('GasPrice: : ', gasPrice);
	console.log('ContractAddress: ', CONTRACT);
	console.log('Tx: ', rawTx);

	const tx = new Tx(rawTx);
	tx.sign(privateKeyBuffer);

	const serializedTx = tx.serialize();

	web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
		.on('transactionHash', (txHash) => {
			console.log('TransactionHash:' , txHash);
		})
		.on('receipt', (rec) => {
			console.log('Receipt:' , rec);
		});

	} catch(e) {
		console.log("tx error: ", e)
	}
}