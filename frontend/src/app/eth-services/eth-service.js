const ethers = require('ethers');
const axios = require('axios');
const provider = require('./config/network-provider').provider();

class EthService {

    static async getGasPrice() {

        try {
            let result = await axios.get(config.Blockchain.ETH_GAS_STATION_API);

            return ethers.utils.parseUnits((result.data.fast / 10).toString(10), 'gwei');
        } catch (e) {
            let gasPrice = await provider.getGasPrice();

            return gasPrice;
        }

    }

    static async waitForTransaction(txnHash) {
        return await provider.waitForTransaction(txnHash);
    }

    static async getTrasactionStatus(txnHash) {
        let receipt = await provider.getTransactionReceipt(txnHash);
        return receipt.status !== 0;
    }
}

module.exports = EthService;