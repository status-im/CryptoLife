const dotenv = require("dotenv");
dotenv.config();

const HDWalletProvider = require("truffle-hdwallet-provider");
const mnemonic = process.env.MNEMONIC;

module.exports = {
	networks: {
		development: {
			host: "127.0.0.1",
			port: 7545,
			network_id: "*"
		},
		kovan: {
			provider: () => { return new HDWalletProvider(mnemonic, "https://kovan.infura.io/" + process.env.INFURA_API_KEY); },
			network_id: 42,
			gas: 7000000
		},
		rinkeby: {
			provider: () => { return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/" + process.env.INFURA_API_KEY); },
			network_id: 4,
			gas: 4700000
		},
	}
};
