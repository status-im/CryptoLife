import Web3 from 'web3'

export const state = () => ({
  auth: true,
  web3Instance: null,
  userAddress: '0xA...',
  userXP: 2000,
  userBalance: 3000,
  meetupTitle: 'Status Cryptolife',
  meetupAddress: '0x2B...',
  meetupDate: '28-10-18',
  meetupLocation: 'Prague',
  meetupStake: 200,
  meetupParticipants: 3,
  meetupParticipantLimit: 10,
  curveParamA: 0,
  curveParamB: 1.00016,
  showSnackbar: false,
  snackbarMessage: 'Snacky bar',
  communityTokenAddress: '0xae5eb03b0f89ff229735b1390ff49a79ec234feb',
  communityTokenABI: [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"rewardManager","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_rewardManager","type":"address"},{"name":"_rewardPotTax","type":"uint8"},{"name":"_name","type":"string"},{"name":"_decimals","type":"uint8"},{"name":"_symbol","type":"string"},{"name":"_exponent","type":"uint8"},{"name":"_slope","type":"uint32"},{"name":"_hash","type":"bytes32"},{"name":"_hashFunction","type":"uint8"},{"name":"_size","type":"uint8"}],"name":"initContract","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"numTokens","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"exponent","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"slope","outputs":[{"name":"","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"poolBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"numTokens","type":"uint256"}],"name":"mint","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"numTokens","type":"uint256"}],"name":"priceToMint","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"numTokens","type":"uint256"}],"name":"purchaseTax","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"numTokens","type":"uint256"}],"name":"rewardForBurn","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"rewardPotTax","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"data","type":"bytes"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"totalCost","type":"uint256"}],"name":"Minted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"reward","type":"uint256"}],"name":"Burned","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"hash","type":"bytes32"},{"indexed":false,"name":"hashFunction","type":"uint8"},{"indexed":false,"name":"size","type":"uint8"},{"indexed":false,"name":"account","type":"address"}],"name":"CommentLog","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"hash","type":"bytes32"},{"indexed":false,"name":"hashFunction","type":"uint8"},{"indexed":false,"name":"size","type":"uint8"}],"name":"StoreHash","type":"event"}]
})

export const getters = {
  web3 (state) {
    console.log('Configuring Web3/Ethereum')
    window.addEventListener('load', async () => {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum)
        try {
          // Request account access if needed
          await window.ethereum.enable()
          // Acccounts now exposed
          // window.web3.eth.sendTransaction({/* ... */})
        } catch (error) {
          // User denied account access...
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider)
        // Acccounts always exposed
        // window.web3.eth.sendTransaction({/* ... */})
      }
      // Non-dapp browsers...
      else {
        console.log('Non-Ethereum browser detected.')
      }
    })

    // if (typeof window.ethereum !== 'undefined') {
    //   if (!state.web3Instance) {
    //     state.web3Instance = new Web3(window.ethereum)
    //   }
    //   window.addEventListener('load', async () => {
    //     // Read-only provider is exposed by default
    //     console.log(await window.ethereum.send('net_version'))
    //     try {
    //       // Request full provider if needed
    //       await window.ethereum.enable()
    //       window.web3.eth.getAccounts().then(accounts => {
    //         window.web3.eth.defaultAccount = accounts[0]
    //       })
    //       // Full provider exposed
    //       return state.web3Instance ? state.web3Instance : null
    //     } catch (error) {
    //       // User denied full provider access
    //       return null
    //     }
    //   })
    // } else {
    //   return null
    // }
  }
}

export const mutations = {
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
