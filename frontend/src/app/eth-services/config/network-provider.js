const ethers = require('ethers');


const provider = function () {

    if (config.Blockchain.NETWORK === 'local') {
        return new ethers.providers.JsonRpcProvider("", ethers.providers.networks.unspecified);
    }

    return new ethers.providers.InfuraProvider(ethers.providers.networks["ropsten"], "Eu84fF12a9U6jQHlhjtB");

};

module.exports = {
    provider
};