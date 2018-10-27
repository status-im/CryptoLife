<template>
    <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
            <v-card>
                <v-toolbar color="orange" dark>
                    <v-toolbar-title class="text-xs-center">{{`Community Bonding Curve`}}</v-toolbar-title>
                </v-toolbar>
                <v-layout column justify-center align-center>
                    <div class="line-chart">
                        <line-chart :data="chartData" :options="chartOptions" />
                    </div>
                </v-layout>
                <v-list-tile @click="">
                    <v-list-tile-action>
                        <v-icon color="orange">money</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Token Balance</v-list-tile-title>
                        <v-list-tile-sub-title>{{$store.state.userBalance}}</v-list-tile-sub-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-flex style="margin: 20px">
                    <v-text-field
                            label="Buy/Sell Tokens"
                            placeholder="1000"
                            outline
                    ></v-text-field>
                </v-flex>
                <v-btn color="orange">{{`Buy`}}</v-btn>
                <v-btn v-if="$store.state.userBalance > 0" color="orange">{{`Sell`}}</v-btn>
            </v-card>
        </v-flex>
    </v-layout>
</template>
<script>
  import LineChart from '../components/line-chart'
  export default {
    data () {
      return {
        meetupAddress: ''
      }
    },
    async asyncData ({ env, store }) {
      return {
        chartData: {
          labels: [...Array(11).keys()].map(n => n * 1000),
          datasets: [
            {
              label: 'Community Bonding Curve',
              backgroundColor: '#f87979',
              data: [...[...Array(11).keys()].map(n => n * 1000).map(x => store.state.curveParamA + Math.pow(store.state.curveParamB, x))],
              pointRadius: 0,
              cubicInterpolationMode: 'default'
            }
          ]
        },
        chartOptions: {
          maintainAspectRatio: false,
          scales: {
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Price ($)'
              }
            }],
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Supply (Tokens)'
              }
            }]
          }
        }
      }
    },
    components: {
      LineChart
    }
  }
</script>
