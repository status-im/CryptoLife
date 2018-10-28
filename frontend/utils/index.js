import ENS from 'ethjs-ens'
import HttpProvider from 'ethjs-provider-http'

import { Web3Store } from '../stores'

// TODO: Allow configuring mainnet/ropsten

export default class {
  static async initMetaMask() {
    if (window.ethereum) {
      await window.ethereum.enable()
    } else {
      throw new Error("Non-Ethereum browser detected. You should consider trying MetaMask!")
    }
  }

  static async setWeb3() {
    await this.initMetaMask()
    if (Web3Store.web3) {
      console.log("Web3 already set up.");
      return
    }
    // Modern dapp browsers
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
    }
    // Legacy dapp browsers
    else {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    Web3Store.web3 = window.web3
    console.log("Web3 set up!");
  }

  static getEthereumHttpProvider() {
    this.setWeb3()
    // FIXME: hack to force ENS resolver to read from mainnet
    // TODO: use window web3.provider instead, possibly fallign back
    const provider = new HttpProvider('https://mainnet.infura.io');
    return provider
  }

  static async getMyAddress() {
    if (!Web3Store.accounts.length) {
      this.setWeb3()
      try {
        const accounts = await window.web3.eth.getAccounts()
        Web3Store.accounts = accounts
      } catch (e) {
        console.error(e)
      }
    }
    return Web3Store.accounts[0].toLowerCase()
  }

  static async resolveEnsDomain(domain) {
    const provider = this.getEthereumHttpProvider();
    const ens = new ENS({provider, network: 1});
    try {
      let address = await ens.lookup(domain);
      return address;
    } catch (reason) {
      throw new Error(`Can't resolve ENS domain ${domain}`);
    }
  }
}
