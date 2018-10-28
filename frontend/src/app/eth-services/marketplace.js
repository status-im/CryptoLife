const ethers = require('ethers');
const limePayWeb = require('limepay-web/dist/lime-pay.min.js');

const contractsInitializator = require('./config/contracts-initializator');
const gasConfig = require('./config/gas-config.json');
const constants = require('./config/constants.json');
const util = require('./util');
const ethService = require('./eth-service');


class MarketplaceService {

    static async buyItem() {
        // This should not be hardcoded:
        let ipfsHash;


        let gasPrice = await ethService.getGasPrice();

        const overrideOptions = {
            gasLimit: gasConfig.createIPClaim,
            gasPrice: gasPrice
        };

        let ipfsToBytes32 = util.getBytes32FromIpfsHash(IPFSAddress);

        // #SecurityBestPractice
        const wallet = await new ethers.Wallet(constants.secret);

        const marketplaceInstanceWallet = await contractsInitializator.DetsyMarketplaceContractWithWallet(wallet);
        const tokenContract = await contractsInitializator.TokenContractInstanceWithWallet(wallet);

        // Create item from mew with ipfs link
        // Approve
        // Buy
    }

    static async buyItemWithCreditCard(walletJSON, walletPassword) {
        // This should not be hardcoded:
        let ipfsHash = "QmbkfAwsmHqwY5r6J1sYczcT2TKRJkUYd4WeVDcSwKTszR";
        let priceInTokens = 50 * 10 ** 18;
        let quantityToBuy = 1;

        let ipfsToBytes32 = util.getBytes32FromIpfsHash(ipfsHash);

        const marketplaceInstance = contractsInitializator.DetsyMarketplaceContract;
        const tokenContract = contractsInitializator.DAITokenContract;

        let transactions = [
            {
                to: tokenContract.address,
                abi: tokenContract.interface.abi,
                gasLimit: gasConfig.approve,
                value: 0,
                fnName: 'approve',
                params: [marketplaceInstance.address, priceInTokens.toString()]
            },
            {
                to: marketplaceInstance.address,
                abi: marketplaceInstance.interface.abi,
                gasLimit: gasConfig.buyItem,
                value: 0,
                fnName: 'buyItem',
                params: [ipfsToBytes32, quantityToBuy]
            }
        ];

        return await limePayWeb.TransactionsBuilder.buildSignedTransactions(walletJSON, walletPassword, transactions);

    }
}

module.exports = MarketplaceService;