import HttpProvider from 'ethjs-provider-http'

export default class {
  static getEthereumHttpProvider() {
    if (typeof window === 'object' && typeof window.web3 !== 'undefined') {
      return web3.currentProvider;
    } else {
      const provider = new HttpProvider('https://ropsten.infura.io');
      return provider;
    }
  }
}
