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
                <v-list-tile>
                    <v-list-tile-action>
                        <v-icon color="orange">money</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Token Balance</v-list-tile-title>
                        <v-list-tile-sub-title>{{$store.state.balanceOf}}</v-list-tile-sub-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-flex style="margin: 20px; margin-bottom: 0;">
                    <v-text-field
                            @input="() => {
                                $store.dispatch('balanceOf', $store.state.userAddress) &&
                                $store.dispatch('priceToMint', buySellTokens) &&
                                $store.dispatch('rewardForBurn', buySellTokens <= $store.state.balanceOf ? buySellTokens : $store.state.balanceOf) &&
                                $store.dispatch('totalSupply') &&
                                $store.dispatch('purchaseTax', buySellTokens) }"
                            v-model="buySellTokens"
                            label="Buy/Sell Tokens"
                            placeholder="1000"
                            outline
                    ></v-text-field>
                </v-flex>
                <v-list-tile>
                    <v-list-tile-action>
                        <v-icon color="orange">pan_tool</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Community Added Tax (CAT): 10%</v-list-tile-title>
                        <v-list-tile-sub-title>{{`${$store.state.purchaseTax > 0 ? $store.state.purchaseTax : buySellTokens * 0.01} tokens`}}</v-list-tile-sub-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-btn :disabled="!$store.state.priceToMint" color="orange" @click="() => {$store.dispatch('mint', buySellTokens)}">
                    {{`Buy ${buySellTokens} for ${$store.state.priceToMint ? $store.state.priceToMint : '...'}`}}
                </v-btn>
                <v-btn :disabled="!$store.state.rewardForBurn || $store.state.balanceOf <= 0" color="orange" @click="() => {$store.dispatch('burn', buySellTokens)}">
                    {{`Sell ${buySellTokens <= $store.state.balanceOf ? buySellTokens : $store.state.balanceOf} for ${$store.state.rewardForBurn}`}}
                </v-btn>
            </v-card>
        </v-flex>
    </v-layout>
</template>
<script>
  import LineChart from '../components/line-chart'
  export default {
    mounted () {
      this.$store.dispatch('configureWeb3').then(() => {
        this.$store.dispatch('balanceOf', this.$store.state.userAddress)
        this.$store.dispatch('priceToMint', this.buySellTokens)
        this.$store.dispatch('rewardForBurn', this.buySellTokens)
        this.$store.dispatch('purchaseTax', this.buySellTokens)
        this.$store.dispatch('totalSupply')
      })
    },
    data () {
      return {
        meetupAddress: '',
        buySellTokens: 5
      }
    },
    async asyncData ({ env, store }) {
      // await store.dispatch('totalSupply')
      return {
        chartData: {
          labels: [...Array(store.state.totalSupply >= 2 ? store.state.totalSupply * 2 + 1 : 5).keys()],
          datasets: [
            {
              label: 'Community Bonding Curve',
              backgroundColor: '#f87979',
              data: [...[...Array(store.state.totalSupply >= 2 ? store.state.totalSupply * 2 + 1 : 5).keys()]
                .map(x => store.state.curveParamA + Math.pow(store.state.curveParamB, x))],
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
