/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

const PrivateKeyProvider = require("truffle-privatekey-provider");

const privateKey = "2b39684993888c5770afc461305ee161f6921a327915e8cade4816d853cd8d61";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {

        //from: "0xa19ea55d4cac11fe442565F9A85Bd7f38c532A55",
        provider: () => new PrivateKeyProvider(privateKey, "https://rinkeby.infura.io/v3/68f3901ed39d456c8a09974d21bf93f9"),
        gasPrice: 10000000000,
        network_id: 4
    }
  }
};
