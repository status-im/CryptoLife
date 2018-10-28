const etherlime = require('etherlime');
const DAIToken = require('../build/DAIToken.json');

const DetsyMarketplace = require('../build/DetsyMarketplace.json');
const IDetsyMarketplace = require('../build/IDetsyMarketplace.json');
const DetsyMarketplaceProxy = require('../build/DetsyMarketplaceProxy.json');

const deploy = async (network, secret) => {

    const deployer = new etherlime.InfuraPrivateKeyDeployer(secret, network);
    // const tokenContractDeployed = await deployer.deploy(DAIToken, {});

    let deployedDaiAddress = "0xe5ffE51Cdc233702fD09810B467293161f83562b";
    const detsyMarketplaceWrapper = await deployer.deploy(DetsyMarketplace, {}, deployedDaiAddress);

};

module.exports = {
    deploy
};