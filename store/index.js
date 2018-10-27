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
  curveParamB: 1.00016
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
  }
}
