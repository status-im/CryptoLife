<template>
  <v-layout column justify-center align-center>
      <div class="line-chart">
          <line-chart :data="chartData" :options="chartOptions" />
      </div>
  </v-layout>
</template>
<script>
  import LineChart from '../components/line-chart'
  export default {
    async asyncData ({ env }) {
      return {
        chartData: {
          labels: [...Array.apply(null, {length: 100}).map(Number.call, Number)],
          datasets: [
            {
              label: 'Community Bonding Curve',
              backgroundColor: '#f87979',
              data: [...[...Array.apply(null, {length: 100}).map(Number.call, Number)].map(y => Math.pow(2, 0.05 * y))]
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
