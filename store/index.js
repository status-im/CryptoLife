import Web3 from 'web3'

export const state = () => ({
  auth: true,
  web3Instance: null,
  userAddress: '0x',
  userXP: 2000,
  userBalance: 3000,
  meetupTitle: 'Status Cryptolife',
  meetupAddress: '0x2B...',
  meetupDate: '28-10-18',
  meetupLocation: 'Prague',
  meetupStake: 200,
  meetupParticipants: 3,
  meetupParticipantLimit: 10,
  priceToMint: 0,
  rewardForBurn: 0,
  curveParamA: 0,
  curveParamB: 1.00016,
  showSnackbar: false,
  snackbarMessage: 'Snacky bar',
  communityTokenContract: null,
  communityTokenAddress: '0xae5eb03b0f89ff229735b1390ff49a79ec234feb',
  communityTokenABI: [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"rewardManager","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_rewardManager","type":"address"},{"name":"_rewardPotTax","type":"uint8"},{"name":"_name","type":"string"},{"name":"_decimals","type":"uint8"},{"name":"_symbol","type":"string"},{"name":"_exponent","type":"uint8"},{"name":"_slope","type":"uint32"},{"name":"_hash","type":"bytes32"},{"name":"_hashFunction","type":"uint8"},{"name":"_size","type":"uint8"}],"name":"initContract","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"numTokens","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"exponent","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"slope","outputs":[{"name":"","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"poolBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"numTokens","type":"uint256"}],"name":"mint","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"numTokens","type":"uint256"}],"name":"priceToMint","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"numTokens","type":"uint256"}],"name":"purchaseTax","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"numTokens","type":"uint256"}],"name":"rewardForBurn","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"rewardPotTax","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"data","type":"bytes"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"totalCost","type":"uint256"}],"name":"Minted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"reward","type":"uint256"}],"name":"Burned","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"hash","type":"bytes32"},{"indexed":false,"name":"hashFunction","type":"uint8"},{"indexed":false,"name":"size","type":"uint8"},{"indexed":false,"name":"account","type":"address"}],"name":"CommentLog","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"hash","type":"bytes32"},{"indexed":false,"name":"hashFunction","type":"uint8"},{"indexed":false,"name":"size","type":"uint8"}],"name":"StoreHash","type":"event"}]
  // communityTokenABI: [
  //   {
  //     "constant": true,
  //     "inputs": [],
  //     "name": "name",
  //     "outputs": [
  //       {
  //         "name": "",
  //         "type": "string"
  //       }
  //     ],
  //     "payable": false,
  //     "stateMutability": "view",
  //     "type": "function"
  //   },
  //   {
  //     "constant": true,
  //     "inputs": [],
  //     "name": "rewardManager",
  //     "outputs": [
  //       {
  //         "name": "",
  //         "type": "address"
  //       }
  //     ],
  //     "payable": false,
  //     "stateMutability": "view",
  //     "type": "function"
  //   },
  //   {
  //     "constant": true,
  //     "inputs": [],
  //     "name": "decimals",
  //     "outputs": [
  //       {
  //         "name": "",
  //         "type": "uint8"
  //       }
  //     ],
  //     "payable": false,
  //     "stateMutability": "view",
  //     "type": "function"
  //   },
  //   {
  //     "constant": true,
  //     "inputs": [],
  //     "name": "exponent",
  //     "outputs": [
  //       {
  //         "name": "",
  //         "type": "uint8"
  //       }
  //     ],
  //     "payable": false,
  //     "stateMutability": "view",
  //     "type": "function"
  //   },
  //   {
  //     "constant": true,
  //     "inputs": [],
  //     "name": "symbol",
  //     "outputs": [
  //       {
  //         "name": "",
  //         "type": "string"
  //       }
  //     ],
  //     "payable": false,
  //     "stateMutability": "view",
  //     "type": "function"
  //   },
  //   {
  //     "constant": true,
  //     "inputs": [],
  //     "name": "poolBalance",
  //     "outputs": [
  //       {
  //         "name": "",
  //         "type": "uint256"
  //       }
  //     ],
  //     "payable": false,
  //     "stateMutability": "view",
  //     "type": "function"
  //   },
  //   {
  //     "constant": true,
  //     "inputs": [],
  //     "name": "rewardPotTax",
  //     "outputs": [
  //       {
  //         "name": "",
  //         "type": "uint256"
  //       }
  //     ],
  //     "payable": false,
  //     "stateMutability": "view",
  //     "type": "function"
  //   },
  //   {
  //     "inputs": [
  //       {
  //         "name": "_rewardManager",
  //         "type": "address"
  //       },
  //       {
  //         "name": "_rewardPotTax",
  //         "type": "uint8"
  //       },
  //       {
  //         "name": "_name",
  //         "type": "string"
  //       },
  //       {
  //         "name": "_decimals",
  //         "type": "uint8"
  //       },
  //       {
  //         "name": "_symbol",
  //         "type": "string"
  //       },
  //       {
  //         "name": "_exponent",
  //         "type": "uint8"
  //       }
  //     ],
  //     "payable": false,
  //     "stateMutability": "nonpayable",
  //     "type": "constructor"
  //   },
  //   {
  //     "anonymous": false,
  //     "inputs": [
  //       {
  //         "indexed": true,
  //         "name": "owner",
  //         "type": "address"
  //       },
  //       {
  //         "indexed": true,
  //         "name": "spender",
  //         "type": "address"
  //       },
  //       {
  //         "indexed": false,
  //         "name": "value",
  //         "type": "uint256"
  //       }
  //     ],
  //     "name": "Approval",
  //     "type": "event"
  //   },
  //   {
  //     "anonymous": false,
  //     "inputs": [
  //       {
  //         "indexed": true,
  //         "name": "from",
  //         "type": "address"
  //       },
  //       {
  //         "indexed": true,
  //         "name": "to",
  //         "type": "address"
  //       },
  //       {
  //         "indexed": false,
  //         "name": "value",
  //         "type": "uint256"
  //       }
  //     ],
  //     "name": "Transfer",
  //     "type": "event"
  //   },
  //   {
  //     "anonymous": false,
  //     "inputs": [
  //       {
  //         "indexed": true,
  //         "name": "from",
  //         "type": "address"
  //       },
  //       {
  //         "indexed": true,
  //         "name": "to",
  //         "type": "address"
  //       },
  //       {
  //         "indexed": false,
  //         "name": "value",
  //         "type": "uint256"
  //       },
  //       {
  //         "indexed": false,
  //         "name": "data",
  //         "type": "bytes"
  //       }
  //     ],
  //     "name": "Transfer",
  //     "type": "event"
  //   },
  //   {
  //     "anonymous": false,
  //     "inputs": [
  //       {
  //         "indexed": false,
  //         "name": "amount",
  //         "type": "uint256"
  //       },
  //       {
  //         "indexed": false,
  //         "name": "totalCost",
  //         "type": "uint256"
  //       }
  //     ],
  //     "name": "Minted",
  //     "type": "event"
  //   },
  //   {
  //     "anonymous": false,
  //     "inputs": [
  //       {
  //         "indexed": false,
  //         "name": "amount",
  //         "type": "uint256"
  //       },
  //       {
  //         "indexed": false,
  //         "name": "reward",
  //         "type": "uint256"
  //       }
  //     ],
  //     "name": "Burned",
  //     "type": "event"
  //   },
  //   {
  //     "constant": true,
  //     "inputs": [
  //       {
  //         "name": "_owner",
  //         "type": "address"
  //       }
  //     ],
  //     "name": "balanceOf",
  //     "outputs": [
  //       {
  //         "name": "",
  //         "type": "uint256"
  //       }
  //     ],
  //     "payable": false,
  //     "stateMutability": "view",
  //     "type": "function"
  //   },
  //   {
  //     "constant": true,
  //     "inputs": [],
  //     "name": "totalSupply",
  //     "outputs": [
  //       {
  //         "name": "",
  //         "type": "uint256"
  //       }
  //     ],
  //     "payable": false,
  //     "stateMutability": "view",
  //     "type": "function"
  //   },
  //   {
  //     "constant": false,
  //     "inputs": [
  //       {
  //         "name": "_from",
  //         "type": "address"
  //       },
  //       {
  //         "name": "_to",
  //         "type": "address"
  //       },
  //       {
  //         "name": "_value",
  //         "type": "uint256"
  //       }
  //     ],
  //     "name": "transferFrom",
  //     "outputs": [
  //       {
  //         "name": "",
  //         "type": "bool"
  //       }
  //     ],
  //     "payable": false,
  //     "stateMutability": "nonpayable",
  //     "type": "function"
  //   },
  //   {
  //     "constant": true,
  //     "inputs": [
  //       {
  //         "name": "numTokens",
  //         "type": "uint256"
  //       }
  //     ],
  //     "name": "priceToMint",
  //     "outputs": [
  //       {
  //         "name": "",
  //         "type": "uint256"
  //       }
  //     ],
  //     "payable": false,
  //     "stateMutability": "view",
  //     "type": "function"
  //   },
  //   {
  //     "constant": true,
  //     "inputs": [
  //       {
  //         "name": "numTokens",
  //         "type": "uint256"
  //       }
  //     ],
  //     "name": "rewardForBurn",
  //     "outputs": [
  //       {
  //         "name": "",
  //         "type": "uint256"
  //       }
  //     ],
  //     "payable": false,
  //     "stateMutability": "view",
  //     "type": "function"
  //   },
  //   {
  //     "constant": true,
  //     "inputs": [
  //       {
  //         "name": "numTokens",
  //         "type": "uint256"
  //       }
  //     ],
  //     "name": "purchaseTax",
  //     "outputs": [
  //       {
  //         "name": "",
  //         "type": "uint256"
  //       }
  //     ],
  //     "payable": false,
  //     "stateMutability": "view",
  //     "type": "function"
  //   },
  //   {
  //     "constant": false,
  //     "inputs": [
  //       {
  //         "name": "numTokens",
  //         "type": "uint256"
  //       }
  //     ],
  //     "name": "burn",
  //     "outputs": [],
  //     "payable": false,
  //     "stateMutability": "nonpayable",
  //     "type": "function"
  //   },
  //   {
  //     "constant": false,
  //     "inputs": [
  //       {
  //         "name": "numTokens",
  //         "type": "uint256"
  //       }
  //     ],
  //     "name": "mint",
  //     "outputs": [],
  //     "payable": true,
  //     "stateMutability": "payable",
  //     "type": "function"
  //   },
  //   {
  //     "constant": false,
  //     "inputs": [
  //       {
  //         "name": "_to",
  //         "type": "address"
  //       },
  //       {
  //         "name": "_value",
  //         "type": "uint256"
  //       }
  //     ],
  //     "name": "transfer",
  //     "outputs": [
  //       {
  //         "name": "",
  //         "type": "bool"
  //       }
  //     ],
  //     "payable": false,
  //     "stateMutability": "nonpayable",
  //     "type": "function"
  //   },
  //   {
  //     "constant": false,
  //     "inputs": [
  //       {
  //         "name": "_to",
  //         "type": "address"
  //       },
  //       {
  //         "name": "_value",
  //         "type": "uint256"
  //       },
  //       {
  //         "name": "_data",
  //         "type": "bytes"
  //       }
  //     ],
  //     "name": "transfer",
  //     "outputs": [],
  //     "payable": false,
  //     "stateMutability": "nonpayable",
  //     "type": "function"
  //   }
  // ]
})

export const actions = {
  async priceToMint ({ dispatch, commit, state }, payload) {
    console.log('Func: priceToMint')
    await dispatch('configureWeb3')
    console.log('Sending method call')
    let contract = new window.web3.eth.Contract(state.communityTokenABI, state.communityTokenAddress)
    contract.methods.priceToMint(payload).call((error, result) => {
      commit('setPriceToMint', result)
    })
  },
  async rewardForBurn ({ dispatch, commit, state }, payload) {
    console.log('Func: rewardForBurn')
    await dispatch('configureWeb3')
    console.log('Sending method call')
    let contract = new window.web3.eth.Contract(state.communityTokenABI, state.communityTokenAddress)
    contract.methods.rewardForBurn(payload).call((error, result) => {
      commit('setRewardForBurn', result)
    })
  },
  configureWeb3 ({ commit, state }) {
    return new Promise((resolve, reject) => {
      if (state.web3Instance) {
        return resolve(window.web3)
      }
      window.addEventListener('load', async () => {
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum)
          try {
            // Request account access if needed
            await window.ethereum.enable()
            // Acccounts now exposed
            commit('setSnackbarMessage', 'Accounts exposed')
            commit('openSnackbar')
          } catch (error) {
            // User denied account access...
            commit('setSnackbarMessage', 'User denied account access')
            commit('openSnackbar')
          }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider)
          commit('setSnackbarMessage', 'Legacy dapp browser')
          commit('openSnackbar')
          // Acccounts always exposed
        }
        // Non-dapp browsers...
        else {
          commit('setSnackbarMessage', 'Non-Ethereum browser detected')
          commit('openSnackbar')
        }

        window.web3.eth.getAccounts().then(accounts => {
          window.web3.eth.defaultAccount = accounts[0]
          commit('setWeb3Instance', () => window.web3)
          commit('setUserAddress', accounts[0])
          resolve(window.web3)
        })
      })
    })
  }
}

export const mutations = {
  setWeb3Instance (state, instance) {
    state.web3Instance = instance
  },
  setCommunityTokenContract(state, payload) {
    state.communityTokenContract = payload
  },
  setUserAddress (state, payload) {
    state.userAddress = payload
  },
  setPriceToMint (state, payload) {
    state.priceToMint = payload
  },
  setRewardForBurn (state, payload) {
    state.rewardForBurn = payload
  },
  SET_AUTH (state, auth) {
    state.auth = auth
  },
  openSnackbar (state) {
    state.showSnackbar = true
  },
  hideSnackbar (state) {
    state.showSnackbar = false
  },
  setSnackbarMessage (state, message) {
    state.snackbarMessage = message
  }
}
