const ethers = require('ethers');
const gasConfig = require('./config/gas-config.json');
const contractsInitializator = require('./config/contracts-initializator');
const provider = require('./config/network-provider').provider();

class TokenService {

    static async approve(walletJSON, walletPassword, recipient, amount) {
        let wallet = await new ethers.Wallet.fromEncryptedWallet(walletJSON, walletPassword);

        const tokenContract = await contractsInitializator.TokenContractInstanceWithWallet(wallet);
        let overrideOptions = {
            gasLimit: gasConfig.approve,
        };
        return await tokenContract.approve(recipient, amount);
    }

    static async allowance(owner, spender) {
        const tokenContract = await contractsInitializator.TokenContractInstance;
        return await tokenContract.allowance(owner, spender);
    }

    static async getDAITokenBalance(walletAddress) {
        const tokenContract = await contractsInitializator.DAITokenContract;
        return await tokenContract.balanceOf(walletAddress);
    }

    static async getETHBalance(walletAddress) {
        return await provider.getBalance(walletAddress);
    }
}

module.exports = TokenService;