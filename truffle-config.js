const dotenv = require("dotenv");
dotenv.config();

const HDWalletProvider = require("truffle-hdwallet-provider");
const mnemonic = process.env.MNEMONIC;

module.exports = {
	networks: {
		development: {
			host: "127.0.0.1",
			network_id: 7923,
			port: 7545,
		},
		kovan: {
			provider: () => { return new HDWalletProvider(mnemonic, "https://kovan.infura.io/" + process.env.INFURA_API_KEY); },
			gas: 7005000,
			network_id: 42,
		},
		rinkeby: {
			provider: () => { return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/" + process.env.INFURA_API_KEY); },
			gas: 7005000,
			network_id: 4,
		},
	}
};
