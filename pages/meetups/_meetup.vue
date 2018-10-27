<template>
    <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
            <v-card>
                <v-toolbar color="orange" dark>

                    <v-toolbar-title class="text-xs-center">{{`Meetup ${meetupAddress}`}}</v-toolbar-title>

                </v-toolbar>

                <v-layout column justify-center align-center>
                    <div class="line-chart">
                        <line-chart :data="chartData" :options="chartOptions" />
                    </div>
                </v-layout>

            </v-card>
        </v-flex>
    </v-layout>
</template>
<script>
  import LineChart from '../../components/line-chart'
  export default {
    validate ({ params }) {
      // Must be a valid address
      return /^0x/.test(params.meetup)
    },
    data () {
      return {
        meetupAddress: ''
      }
    },
    async asyncData ({ env }) {
      return {
        curveParamA: 0,
        curveParamB: 1.00016,
        chartData: {
          labels: [...Array(11).keys()].map(n => n * 1000),
          datasets: [
            {
              label: 'Community Bonding Curve',
              backgroundColor: '#f87979',
              data: [...[...Array(11).keys()].map(n => n * 1000).map(x => 0 + Math.pow(1.00016, x))],
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
                labelString: 'Price'
              }
            }],
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Supply'
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
