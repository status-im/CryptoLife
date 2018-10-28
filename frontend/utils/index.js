import ENS from 'ethjs-ens'
import HttpProvider from 'ethjs-provider-http'

// TODO: Allow configuring mainnet/ropsten

export default class {
  static async setWeb3() {
    if (window.ethereum) {
      await ethereum.enable()
    }
    if (window.ethereum || window.web3) {
      window.web3 = new Web3(ethereum)
    } else {
      console.error("Non-Ethereum browser detected. You should consider trying MetaMask!")
    }
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
    this.setWeb3()
    try {
      const accounts = await web3.eth.getAccounts()
      return accounts[0].toLowerCase()
    } catch (e) {
      console.error(e)
    }
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
