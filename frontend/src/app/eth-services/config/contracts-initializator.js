// const config = require('../../../../../../config/config.js');
const provider = require('./network-provider').provider();
const ethers = require('ethers');

const DAITokenContractJSON = require('./contracts-json/DAIToken.json');
const DetsyMarketplaceContractJSON = require('./contracts-json/DetsyMarketplace.json');

let DetsyMarketplaceContract = new ethers.Contract("0x13bDc9708a3680c4Ae2C220a945e3C5f30e06c36", DetsyMarketplaceContractJSON.abi, provider);

let DetsyMarketplaceContractWithWallet = function (wallet) {
    wallet.provider = provider;
    return new ethers.Contract("0x13bDc9708a3680c4Ae2C220a945e3C5f30e06c36", DetsyMarketplaceContractJSON.abi, wallet);
};

let DAITokenContract = new ethers.Contract("0xe5ffE51Cdc233702fD09810B467293161f83562b", DAITokenContractJSON.abi, provider);

let DAITokenContractWithWallet = function (wallet) {
    wallet.provider = provider;
    return new ethers.Contract("0xe5ffE51Cdc233702fD09810B467293161f83562b", DAITokenContractJSON.abi, wallet);
};

module.exports = {
    DAITokenContract,
    DAITokenContractWithWallet,
    DetsyMarketplaceContract,
    DetsyMarketplaceContractWithWallet
};