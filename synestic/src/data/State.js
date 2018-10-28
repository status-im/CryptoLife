import {BigNumber} from 'bignumber.js';
//import Web3 from 'web3';

//const web3 = new Web3(Web3.givenProvider)
const web3 = window.web3;

class State {
  ownAddress() {
    return web3.eth.defaultAccount;
  }

  contractAddress() {
    // gaance dumi
    return "0xd693dc51405c69dda9e5b9b466a429bda30b4ad5"
    // ganache valer
    // return "0xfC947854a8814B997c286606e3eD54753c26F104";
    //
    // Ropsten latest deploy
    // return "0x2cb578d5a2639dcdf6f714cb843bbb10c0fc8562";
  }

  abi() {
    // run `make` in the root git dir to grab the updated api
    // requires truffle
    return [{"constant":true,"inputs":[{"name":"interfaceID","type":"bytes4"}],"name":"supportsInterface","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_approved","type":"address"},{"name":"_tokenId","type":"uint256"}],"name":"approve","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"name":"_tokenId","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"_index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"synId2beat","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_operator","type":"address"},{"name":"_approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_tokenId","type":"uint256"},{"name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":true,"name":"_tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_approved","type":"address"},{"indexed":true,"name":"_tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_operator","type":"address"},{"indexed":false,"name":"_approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"constant":false,"inputs":[],"name":"mint","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"tokenA","type":"uint256"},{"name":"tokenB","type":"uint256"}],"name":"remix","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"beatId","type":"uint256"}],"name":"getBeat","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"}]
  }

  contract() {
    if (!this._contract)  {
      this._contract = web3.eth.contract(this.abi()).at(this.contractAddress());
    }
    window.x = this._contract;
    return this._contract;
  }

  async mintToken() {
    return new Promise(resolve => {
      this.contract().mint((err, resp) => {
        resolve();
      })
    });
  }

  async mutate(selected) {
    return new Promise(resolve => {
      this.contract().remix(selected[0], selected[1], (err, resp) => {
        if (err) {
          console.error("data/State.js: web3: ", err)
        }
        resolve(resp);
      })
    })
  }

  async tokens(address) {
    let result = [];

    if (!address) {
      address = this.ownAddress();
    }

    const count = await new Promise((resolve) => {
      this.contract().balanceOf(address, (err, resp) => {
        if (err) {
          console.error("data/State.js: web3: ", err)
        }
        resolve(resp);
      });
    })

    const tokens = [];
    for (let i=0; i<count; i++) {
      tokens.push(new Promise((resolve) => {
        this.contract().tokenOfOwnerByIndex(address, i, (err, resp) => {
          if (err) {
            console.error("data/State.js: web3: ", err)
          }
          const id = new BigNumber(resp).toString();
          console.log(id);
          this.contract().getBeat(id, (err, resp) => {
            if (err) {
              console.error("data/State.js: web3: ", err)
            }
            console.log(resp);
            resolve({
              id: id,
              parentA: new BigNumber(resp[0]).toString(),
              parentB: new BigNumber(resp[1]).toString(),
              hash:
                new BigNumber(resp[2][0]).toString(16) +
                new BigNumber(resp[2][1]).toString(16) +
                new BigNumber(resp[2][2]).toString(16) +
                new BigNumber(resp[2][3]).toString(16)
            });
          });
        });
      }))
    }

    return Promise.all(tokens);
  }

  async token(id) {
    let tok = await new Promise((resolve) => {
      this.contract().getBeat(id, (err, resp) => {
        if (err) {
          console.error("data/State.js: web3: ", err)
        }
        console.log(resp);
        resolve({
          token: {
            parentA: new BigNumber(resp[0]).toString(),
            parentB: new BigNumber(resp[1]).toString(),
            value:
              new BigNumber(resp[2][0]).toString(16) +
              new BigNumber(resp[2][1]).toString(16) +
              new BigNumber(resp[2][2]).toString(16) +
              new BigNumber(resp[2][3]).toString(16)
          }
        });
      });
    });
    return tok;
  }
}

export default new State();
