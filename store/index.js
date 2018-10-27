import Web3 from 'web3'

export const state = () => ({
  auth: true,
  web3Instance: null
})

export const getters = {
  web3 (state) {
    if (typeof window.ethereum !== 'undefined') {
      if (!state.web3Instance) {
        state.web3Instance = new Web3(window.ethereum)
      }
      window.addEventListener('load', async () => {
        // Read-only provider is exposed by default
        console.log(await window.ethereum.send('net_version'))
        try {
          // Request full provider if needed
          await window.ethereum.enable()
          // Full provider exposed
          return state.web3Instance ? state.web3Instance : null
        } catch (error) {
          // User denied full provider access
          return null
        }
      })
    } else {
      return null
    }
  }
}

export const mutations = {
  SET_AUTH (state, auth) {
    state.auth = auth
  }
}
