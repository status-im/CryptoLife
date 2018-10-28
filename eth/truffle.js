//const HDWalletProvider = require('truffle-hdwallet-provider')
const HDWalletProvider = require("truffle-hdwallet-provider-privkey");
const privKeys = ["BF711D7BF7B406280DDD12B9E84EC9687AD9B135F166052E59EE908B0DDCF07F"]; // private keys
const provider = new HDWalletProvider(privKeys, "http://localhost:8545");

const fs = require('fs')

// First read in the secrets.json to get our mnemonic
let secrets
let mnemonic
if (fs.existsSync('secrets.json')) {
  secrets = JSON.parse(fs.readFileSync('secrets.json', 'utf8'))
  mnemonic = secrets.mnemonic
} else {
  console.log('No secrets.json found. If you are trying to publish EPM ' +
    'this will fail. Otherwise, you can ignore this message!')
  mnemonic = ''
}

module.exports = {
  networks: {
    live: {
      network_id: 1 // Ethereum public network
      // optional config values
      // host - defaults to "localhost"
      // port - defaults to 8545
      // gas
      // gasPrice
      // from - default address to use for any transaction Truffle makes during migrations
    },
    ropsten: {
      provider: new HDWalletProvider(privKeys, 'https://ropsten.infura.io'),
      network_id: '3'
    },
    testrpc: {
      network_id: 'default'
    },
    ganache: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // matching any id
    },
    coverage: {
      host: "localhost",
      network_id: "*",
      port: 8555,
      gas: 0xfffffffffff,
      gasPrice: 0x01
    },
  }
}
