import Web3 from 'web3'

export const state = () => ({
  auth: true,
  web3Instance: null
})

export const getters = {
  web3 (state) {
    if (typeof window.web3 !== 'undefined') {
      if (!state.web3Instance) {
        state.web3Instance = new Web3(window.web3.currentProvider)
      }
      return state.web3Instance ? state.web3Instance : null
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
