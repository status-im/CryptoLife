const Web3 = window.Web3;
const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/"));

web3.eth.net.getId().then((a) =>{
	console.log(a);
})

web3.eth.getProtocolVersion()
.then((x)=>{
	console.log(x);
});

/*
	Create a keypair and save to local storage
 */
const initAccount = () => {
	const keypair = web3.eth.accounts.create();
	let saveAddress = localStorage.setItem('address', keypair.address);
	let savePrivateKey = localStorage.setItem('privateKey', keypair.privateKey);
	console.log('saved to local storage?', saveAddress, savePrivateKey)
	return keypair;
}

/*
	Retreive keypair
 */
const getKeypair = () => {
	let key = {
		privateKey: localStorage.getItem('privateKey'),
		address: localStorage.getItem('address'),
	}

	return key;
}

/*
	Check if account is created
 */
const hasAccount = () => {
	if (localStorage.getItem('privateKey') && localStorage.getItem('address')) {
		return true;
	}
	return false;
}

if (!hasAccount()) {
	console.log('no account');
	let created = initAccount();
	console.log('account created', created);
} else {
	console.log('has account');
}

const wallet = {
	hasAccount,
	getKeypair,
}