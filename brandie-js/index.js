const Web3 = require('web3');
const jsonData = require("./contracts_data.json");
const BrandiePlatform = require('./brandiePlatform');

class BrandieJs {

    constructor(web3Provider) {
        //this.web3 = new Web3(new Web3.providers.HttpProvider(rpsEndpoint));
        this.web3 = new Web3(web3Provider);
        this.loadContracts();
    }

    loadContracts(){
        let contractApi = jsonData['brandie_platform_abi'];
        let contractAddress = jsonData['brandie_platform_address'];
        this.platform = new BrandiePlatform(this.web3, contractApi, contractAddress);
    }

}

module.exports = BrandieJs;