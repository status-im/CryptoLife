import Web3 from "web3"
const config = require("../config.json")

export function getWeb3() {
    if (typeof web3 !== 'undefined') {
        window.web3 = new Web3(web3.currentProvider)
    }
    else {
        window.web3 = new Web3(new Web3.providers.HttpProvider(config.WEB3_PROVIDER || "http://localhost:8545"))
    }
    return window.web3
}
