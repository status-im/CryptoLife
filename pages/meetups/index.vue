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
                            @click=""
                    >
                        <v-list-tile-avatar>
                            <img :src="item.avatar">
                        </v-list-tile-avatar>

                        <v-list-tile-content>
                            <v-list-tile-title v-html="item.title"></v-list-tile-title>
                        </v-list-tile-content>

                        <v-list-tile-action>
                            <v-icon :color="item.active ? 'orange' : 'grey'">{{item.active ? "star" : "star_border"}}</v-icon>
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
                            @click=""
                    >
                        <v-list-tile-avatar>
                            <img :src="item.avatar">
                        </v-list-tile-avatar>

                        <v-list-tile-content>
                            <v-list-tile-title v-html="item.title"></v-list-tile-title>
                        </v-list-tile-content>

                        <v-list-tile-action>
                            <v-icon :color="item.active ? 'orange' : 'grey'">create</v-icon>
                        </v-list-tile-action>
                    </v-list-tile>
                </v-list>
                <v-card-text style="margin-top: 20px; height: 40px; position: relative">
                    <v-fab-transition>
                        <v-btn
                                color="orange"
                                dark
                                absolute
                                top
                                right
                                fab
                        >
                            <v-icon>add</v-icon>
                        </v-btn>
                    </v-fab-transition>
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
</template>
<script>
  export default {
    data () {
      return {
        items: [
          { active: true, title: 'Cape Town Ethereum Meetup', avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg' },
          { active: true, title: 'Developer Meetup', avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg' },
          { title: 'Status Hackathon', avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg' }
        ],
        items2: [
          { creator: true, title: 'Status Hackathon', avatar: 'https://cdn.vuetifyjs.com/images/lists/5.jpg' }
        ]
      }
    }
  }
</script>
