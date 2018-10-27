<template>
  <v-app light>
    <v-toolbar fixed app :clipped-left="true">
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content style="margin-bottom: 50px">
      <v-container>
        <Profile v-if="$nuxt.$route.name !== ''"/>
        <nuxt />
      </v-container>
    </v-content>
      <v-bottom-nav
              :active.sync="bottomNav"
              :value="true"
              fixed
              color="white"
      >
          <v-btn
                  color="orange"
                  flat
                  :value="item.title"

                  router
                  :to="item.to"
                  :key="i"
                  v-for="(item, i) in items"
                  exact
          >
              <span>{{item.title}}</span>
              <v-icon>{{item.icon}}</v-icon>
          </v-btn>
      </v-bottom-nav>
  </v-app>
</template>

<script>
  import Profile from '../components/Profile'
  export default {
    data () {
      return {
        bottomNav: 'recent',
        items: [
          { icon: 'mood', title: 'Welcome', to: '/' },
          { icon: 'group', title: 'Meetups', to: '/meetups' },
          { icon: 'money', title: 'Bondage', to: '/bonding' },
          { icon: 'add', title: 'New Meetup', to: '/create' }
        ],
        title: 'Protea v2.0'
      }
    },
    components: {
      Profile
    }
  }
</script>
