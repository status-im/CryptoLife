const etherlime = require('etherlime');
const Token = require('../build/Token.json');
const EscrowContract = require('../build/Escrow.json');

const deploy = async (network, secret) => {

	const deployer = new etherlime.InfuraPrivateKeyDeployer(secret, network);
	const tokenContractDeployed = await deployer.deploy(Token, {});
	const escrowContractDeployed = await deployer.deploy(EscrowContract, {}, tokenContractDeployed.contract.address);
};

module.exports = {
	deploy
};