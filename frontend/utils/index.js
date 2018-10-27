import ENS from 'ethjs-ens'
import HttpProvider from 'ethjs-provider-http'

// TODO: Allow configuring mainnet/ropsten

export default class {
  static getEthereumHttpProvider() {
    if (typeof window === 'object' && typeof window.web3 !== 'undefined') {
      return web3.currentProvider;
    } else {
      const provider = new HttpProvider('https://mainnet.infura.io');
      return provider;
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
