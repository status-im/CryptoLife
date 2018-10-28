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

  export default {
    mounted () {
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
            title: 'Prague Blockchain Week',
            avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
            address: '0x1'
          },
          {
            active: true,
            title: 'Status Cryptolife',
            avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
            address: '0x2'
          },
          {title: 'Status Hackathon', avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg', address: '0x3'}
        ]
      }
    }
  }
</script>
