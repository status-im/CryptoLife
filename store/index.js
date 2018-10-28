import Web3 from 'web3'
import { communityTokenABI, eventManagerABI } from './abi'

export const state = () => ({
  auth: true,
  web3Instance: null,
  userAddress: '0x',
  userXP: 211,
  meetupTitle: 'Status Cryptolife',
  meetupAddress: '0x2B...',
  meetupDate: '28-10-18',
  meetupLocation: 'Prague',
  meetupStake: 10,
  meetupParticipants: 3,
  meetupParticipantLimit: 10,
  priceToMint: null,
  rewardForBurn: null,
  purchaseTax: null,
  balanceOf: 0,
  totalSupply: 0,
  curveParamA: 0,
  curveParamB: 2,
  showSnackbar: false,
  snackbarMessage: 'Snacky bar',
  eventManagerContract: null,
  eventManagerAddress: '0x78092141fea993b222856ee9c359b18498045dea',
  eventManagerABI: eventManagerABI,
  communityTokenContract: null,
  communityTokenAddress: '0x7b064fc5fdc4bacf2147a262881374d22d0ff23b',
  communityTokenABI: communityTokenABI
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
  async purchaseTax ({ dispatch, commit, state }, payload) {
    console.log('Func: purchaseTax')
    await dispatch('configureWeb3')
    console.log('Sending method call')
    let contract = new window.web3.eth.Contract(state.communityTokenABI, state.communityTokenAddress)
    contract.methods.purchaseTax(payload).call((error, result) => {
      commit('setPurchaseTax', result)
    })
  },
  async balanceOf ({ dispatch, commit, state }, payload) {
    console.log('Func: balanceOf')
    await dispatch('configureWeb3')
    console.log('Sending method call')
    let contract = new window.web3.eth.Contract(state.communityTokenABI, state.communityTokenAddress)
    contract.methods.balanceOf(payload).call((error, result) => {
      commit('setBalanceOf', result)
    })
  },
  async mint ({ dispatch, commit, state }, payload) {
    console.log('Func: mint')
    await dispatch('configureWeb3')
    console.log('Sending method call')
    let contract = new window.web3.eth.Contract(state.communityTokenABI, state.communityTokenAddress)
    const priceToMint = await contract.methods.priceToMint(payload).call((error, result) => result)
    contract.methods.mint(payload).send({from: window.web3.eth.defaultAccount, value: priceToMint})
      .on('transactionHash', function (hash) {
        console.log(hash)
      })
      .on('receipt', function (receipt) {
        console.log(receipt)
      })
      .on('confirmation', function (confirmationNumber, receipt) {
        console.log(confirmationNumber)
      })
      .on('error', console.error)
  },
  async burn ({ dispatch, commit, state }, payload) {
    console.log('Func: burn')
    await dispatch('configureWeb3')
    console.log('Sending method call')
    let contract = new window.web3.eth.Contract(state.communityTokenABI, state.communityTokenAddress)
    contract.methods.burn(payload).send({from: window.web3.eth.defaultAccount})
      .on('transactionHash', function (hash) {
        console.log(hash)
      })
      .on('receipt', function (receipt) {
        console.log(receipt)
      })
      .on('confirmation', function (confirmationNumber, receipt) {
        console.log(confirmationNumber)
      })
      .on('error', console.error)
  },
  async totalSupply ({ dispatch, commit, state }) {
    console.log('Func: totalSupply')
    await dispatch('configureWeb3')
    console.log('Sending method call')
    let contract = new window.web3.eth.Contract(state.communityTokenABI, state.communityTokenAddress)
    contract.methods.totalSupply().call((error, result) => {
      commit('setTotalSupply', result)
    })
  },
  // async createEvent ({ dispatch, commit, state }, payload) {
  //   console.log('Func: createEvent')
  //   await dispatch('configureWeb3')
  //   console.log('Sending method call')
  //   let contract = new window.web3.eth.Contract(state.eventManagerABI, state.eventManagerAddress)
  //   const priceToMint = await contract.methods.priceToMint(payload).call((error, result) => result)
  //   contract.methods.mint(payload).send({from: window.web3.eth.defaultAccount, value: priceToMint})
  //     .on('transactionHash', function (hash) {
  //       console.log(hash)
  //     })
  //     .on('receipt', function (receipt) {
  //       console.log(receipt)
  //     })
  //     .on('confirmation', function (confirmationNumber, receipt) {
  //       console.log(confirmationNumber)
  //     })
  //     .on('error', console.error)
  // },
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
  setPurchaseTax (state, payload) {
    state.purchaseTax = payload
  },
  setBalanceOf (state, payload) {
    state.balanceOf = payload
  },
  setTotalSupply (state, payload) {
    state.totalSupply = payload
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
