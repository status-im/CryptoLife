<template>
    <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
            <v-card>
                <v-toolbar color="orange" dark>

                    <v-toolbar-title class="text-xs-center">Meetups</v-toolbar-title>

                    <v-spacer></v-spacer>

                    <v-btn icon>
                        <v-icon>search</v-icon>
                    </v-btn>
                </v-toolbar>

                <v-list subheader>
                    <v-list-tile
                            v-for="meetup in meetups"
                            :key="meetup.title"
                            avatar
                            @click="$router.push(`meetups/${meetup.address}`)"
                    >
                        <v-list-tile-avatar>
                            <!--<img :src="item.avatar">-->
                            <v-icon>people</v-icon>
                        </v-list-tile-avatar>

                        <v-list-tile-content>
                            <v-list-tile-title v-html="meetup.title"></v-list-tile-title>
                        </v-list-tile-content>

                        <v-list-tile-action>
                            <v-icon color="orange">navigate_next</v-icon>
                        </v-list-tile-action>
                    </v-list-tile>
                </v-list>
            </v-card>
        </v-flex>
    </v-layout>
</template>
<script>
  import {mapGetters} from 'vuex'
  import Web3 from 'web3'

  export default {
    mounted () {
      console.log('Configuring Web3/Ethereum')
      this.$store.commit('setSnackbarMessage', 'Configuring Web3/Ethereum')
      this.$store.commit('openSnackbar')
      window.addEventListener('load', async () => {
        // if (window.ethereum) {
        //   window.web3 = new Web3(window.ethereum)
        //   try {
        //     // Request account access if needed
        //     await window.ethereum.enable()
        //     // Acccounts now exposed
        //     this.$store.commit('setSnackbarMessage', 'Accounts exposed')
        //     this.$store.commit('openSnackbar')
        //     window.web3.eth.sendTransaction({/* ... */})
        //   } catch (error) {
        //     // User denied account access...
        //     this.$store.commit('setSnackbarMessage', 'User denied account access')
        //     this.$store.commit('openSnackbar')
        //   }
        // }
        // // Legacy dapp browsers...
        // else if (window.web3) {
        //   window.web3 = new Web3(window.web3.currentProvider)
        //   this.$store.commit('setSnackbarMessage', 'Legacy dapp browser')
        //   this.$store.commit('openSnackbar')
        //   // Acccounts always exposed
        //   window.web3.eth.sendTransaction({/* ... */})
        // }
        // // Non-dapp browsers...
        // else {
        //   this.$store.commit('setSnackbarMessage', 'Non-Ethereum browser detected')
        //   this.$store.commit('openSnackbar')
        // }
        window.web3 = new Web3(window.web3.currentProvider)
        this.$store.commit('setSnackbarMessage', 'Legacy dapp browser')
        this.$store.commit('openSnackbar')
        // Acccounts always exposed
        window.web3.eth.getAccounts().then(accounts => {
          window.web3.eth.defaultAccount = accounts[0]
        }).finally(() => {
          console.log('Creating contract instance')
          let contract = new window.web3.eth.Contract(this.$store.state.communityTokenABI, this.$store.state.communityTokenAddress)

          console.log('Sending method call')
          console.log(window.web3.eth.defaultAccount)
          contract.methods.burn(200).send({from: window.web3.eth.defaultAccount})
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
        })
      })
    },
    computed: {
      ...mapGetters([
        'web3'
      ])
    },
    data () {
      return {
        meetups: [
          {
            active: true,
            title: 'Cape Town Ethereum Meetup',
            avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
            address: '0x1'
          },
          {
            active: true,
            title: 'Developer Meetup',
            avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
            address: '0x2'
          },
          {title: 'Status Hackathon', avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg', address: '0x3'}
        ]
      }
    }
  }
</script>
