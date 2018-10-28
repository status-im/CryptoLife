const HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*"   // Match any network id
    },
    ganache: {
        host: "3.121.27.97",
        port: 8545,
        network_id: "*"   // Match any network id
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(process.env.INFURA_MNEMO, "https://rinkeby.infura.io/v5/" + process.env.INFURA_APIKEY)
      },
      network_id: 4,
      gas: 7000000,
    },
  },

  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};
