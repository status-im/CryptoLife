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
                    <v-subheader>New Meetups</v-subheader>
                    <v-list-tile
                            v-for="item in items"
                            :key="item.title"
                            avatar
                            @click="$router.push(`meetups/${item.address}`)"
                    >
                        <v-list-tile-avatar>
                            <!--<img :src="item.avatar">-->
                            <v-icon>people</v-icon>
                        </v-list-tile-avatar>

                        <v-list-tile-content>
                            <v-list-tile-title v-html="item.title"></v-list-tile-title>
                        </v-list-tile-content>

                        <v-list-tile-action>
                            <v-icon :color="item.active ? 'orange' : 'grey'">{{item.active ? 'star' : 'star_border'}}
                            </v-icon>
                        </v-list-tile-action>
                    </v-list-tile>
                </v-list>

                <v-divider></v-divider>

                <v-list subheader>
                    <v-subheader>My Meetups</v-subheader>

                    <v-list-tile
                            v-for="item in items2"
                            :key="item.title"
                            avatar
                            @click="$router.push(`meetups/${item.address}`)"
                    >
                        <v-list-tile-avatar>
                            <!--<img :src="item.avatar">-->
                            <v-icon>people</v-icon>
                        </v-list-tile-avatar>

                        <v-list-tile-content>
                            <v-list-tile-title v-html="item.title"></v-list-tile-title>
                        </v-list-tile-content>

                        <v-list-tile-action>
                            <v-icon :color="item.active ? 'orange' : 'grey'">create</v-icon>
                        </v-list-tile-action>
                    </v-list-tile>
                </v-list>
                <!--<v-card-text style="margin-top: 20px; height: 40px; position: relative">-->
                <!--<v-fab-transition>-->
                <!--<v-btn-->
                <!--color="orange"-->
                <!--dark-->
                <!--absolute-->
                <!--top-->
                <!--right-->
                <!--fab-->
                <!--@click="$router.push(`create`)"-->
                <!--&gt;-->
                <!--<v-icon>add</v-icon>-->
                <!--</v-btn>-->
                <!--</v-fab-transition>-->
                <!--</v-card-text>-->
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
      window.addEventListener('load', async () => {
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum)
          try {
            // Request account access if needed
            await window.ethereum.enable()
            // Acccounts now exposed
            window.web3.eth.sendTransaction({/* ... */})
          } catch (error) {
            // User denied account access...
          }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider)
          // Acccounts always exposed
          window.web3.eth.sendTransaction({/* ... */})
        }
        // Non-dapp browsers...
        else {
          console.log('Non-Ethereum browser detected.')
        }
      })
    },
    computed: {
      ...mapGetters([
        'web3'
      ])
    },
    data () {
      return {
        items: [
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
        ],
        items2: [
          {
            creator: true,
            title: 'Status Hackathon',
            avatar: 'https://cdn.vuetifyjs.com/images/lists/5.jpg',
            address: '0x4'
          }
        ]
      }
    }
  }
</script>
