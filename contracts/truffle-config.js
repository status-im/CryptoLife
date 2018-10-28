const fs = require('fs');
const ganache = require('ganache-cli');

/* eslint-disable prefer-spread */
let provider = ganache.provider({
  port: 34839,
  accounts: Array.apply(null, {length: 10}).map(() => ({balance: '0xffffffffffffffffff'})),
  gasLimit: 200000000
});
/* eslint-enable prefer-spread */

// from https://github.com/secure-vote/sv-light-smart-contracts/blob/3fc599f67a83154aee391d8439f7584ac4fff96e/truffle.js
// needed to make ganache-cli work...
// curiously, if you don't have this AND don't have gasLimit high, then truffle
// crashes with "exceeds block gas limit", so some communication must be going
// on earlier. If you do have the gas limit, then the error msg becomes
// "this.provider.sendAsync is not a function"
provider = new Proxy(provider, {
  get: (obj, method) => {
    if (method in obj) {
      return obj[method];
    }
    if (method === 'sendAsync') {
      return (...args) => new Promise((resolve, reject) => {
        provider.send(...args, (err, val) => {
          if (err) {
            reject(err);
          } else {
            resolve(val);
          }
        });
      });
    }
    return obj[method];
  }
});

/* eslint-disable camelcase */
module.exports = {
  contracts_directory: 'src',
  networks: {
    development: {
      provider,
      gas: 19000000,
      network_id: '*', // Match any network id
      gasPrice: 1
    },
    localhost: {
      host: 'localhost',
      port: 8545,
      network_id: '*' // Match any network id
    },
    ganache: {
      host: 'ganache',
      port: 8545,
      network_id: '*' // Match any network id
    }
  }
};
/* eslint-enable camelcase */
