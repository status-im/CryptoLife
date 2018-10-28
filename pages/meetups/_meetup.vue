<template>
    <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
            <v-card>
                <v-toolbar color="orange" dark>
                    <v-icon @click="$router.push(`/meetups`)">arrow_back_ios</v-icon>
                    <v-toolbar-title class="text-xs-center">{{$store.state.meetupTitle}}</v-toolbar-title>
                </v-toolbar>
                <v-list two-line>
                    <v-list-tile @click="">
                        <v-list-tile-action>
                            <v-icon color="orange"></v-icon>
                        </v-list-tile-action>

                        <v-list-tile-content>
                            <v-list-tile-title>Address</v-list-tile-title>
                            <v-list-tile-sub-title>{{$store.state.meetupAddress}}</v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>

                    <v-list-tile @click="">
                        <v-list-tile-action>
                            <v-icon color="orange">calendar_today</v-icon>
                        </v-list-tile-action>

                        <v-list-tile-content>
                            <v-list-tile-title>Date</v-list-tile-title>
                            <v-list-tile-sub-title>{{$store.state.meetupDate}}</v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>

                    <v-list-tile @click="">
                        <v-list-tile-action>
                            <v-icon color="orange">location_on</v-icon>
                        </v-list-tile-action>

                        <v-list-tile-content>
                            <v-list-tile-title>Location</v-list-tile-title>
                            <v-list-tile-sub-title>{{$store.state.meetupLocation}}</v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>

                    <v-list-tile @click="">
                        <v-list-tile-action>
                            <v-icon color="orange">people</v-icon>
                        </v-list-tile-action>

                        <v-list-tile-content>
                            <v-list-tile-title>Participants</v-list-tile-title>
                            <v-list-tile-sub-title>{{`${$store.state.meetupParticipants}/${$store.state.meetupParticipantLimit}`}}</v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>

                    <v-list-tile @click="">
                        <v-list-tile-action>
                            <v-icon color="orange">money</v-icon>
                        </v-list-tile-action>

                        <v-list-tile-content>
                            <v-list-tile-title>Stake</v-list-tile-title>
                            <v-list-tile-sub-title>{{$store.state.meetupStake}}</v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
                <v-btn v-if="$store.state.meetupStake > $store.state.userBalance" color="orange">{{`Buy tokens: balance < ${$store.state.meetupStake}`}}</v-btn>
                <v-btn v-else color="orange">{{`RSVP for ${$store.state.meetupStake} tokens`}}</v-btn>
            </v-card>
        </v-flex>
    </v-layout>
</template>
<script>
  export default {
    validate ({ params }) {
      // Must be a valid address
      return /^0x/.test(params.meetup)
    },
    data () {
      return {
        title: 'Status Cryptolife',
        address: '0x2b...',
        date: '28-10-2018',
        location: 'Prague',
        participants: 3,
        participantLimit: 10,
        stake: 200,
        balance: 100
      }
    }
  }
</script>
