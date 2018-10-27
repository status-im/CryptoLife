<template>
    <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
            <v-card>
                <v-img
                        src="https://cdn.vuetifyjs.com/images/lists/ali.png"
                        height="200px"
                >
                    <v-layout
                            column
                            fill-height
                    >
                        <v-card-title>

                        </v-card-title>

                        <v-spacer></v-spacer>

                        <v-card-title class="white--text pl-5 pt-5">
                            <div class="display-1 pl-5 pt-5">User name</div>
                        </v-card-title>
                    </v-layout>
                </v-img>

                <v-list two-line>
                    <v-list-tile @click="">
                        <v-list-tile-action>
                            <v-icon color="orange">location_on</v-icon>
                        </v-list-tile-action>

                        <v-list-tile-content>
                            <v-list-tile-title>Address</v-list-tile-title>
                            <v-list-tile-sub-title>0x01B</v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>

                    <v-list-tile @click="">
                        <v-list-tile-action>
                            <v-icon color="orange">explore</v-icon>
                        </v-list-tile-action>

                        <v-list-tile-content>
                            <v-list-tile-title>XP</v-list-tile-title>
                            <v-list-tile-sub-title>2000</v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>

                    <v-list-tile @click="">
                        <v-list-tile-action>
                            <v-icon color="orange">money</v-icon>
                        </v-list-tile-action>

                        <v-list-tile-content>
                            <v-list-tile-title>Balance</v-list-tile-title>
                            <v-list-tile-sub-title>1000</v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>

                    <v-divider inset></v-divider>

                    <v-list-tile @click="">
                        <v-list-tile-action>
                        </v-list-tile-action>

                        <v-list-tile-content>
                            <v-list-tile-title>Badges</v-list-tile-title>
                            <v-list-tile-sub-title>
                                <v-icon :key="i" v-for="(badge, i) in badges" :color="badge.colour" style="font-size: 50px;">{{badge.icon}}</v-icon>
                            </v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-card>
        </v-flex>
    </v-layout>
</template>
<script>
  export default {
    data () {
      return {
        badges: [
          { icon: 'whatshot', colour: 'teal', description: '' },
          { icon: 'location_city', colour: 'orange', description: '' },
          { icon: 'people', description: '' }
        ]
      }
    }
  }
</script>
