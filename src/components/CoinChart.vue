<template>
  <Line
    v-if="loaded"
    :chart-options="chartOptions"
    :chart-data="chartData"
    :chart-id="chartId"
    :dataset-id-key="datasetIdKey"
    :plugins="plugins"
    :css-classes="cssClasses"
    :styles="styles"
    :width="width"
    :height="height"
  />
</template>

<script>
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js'
import { api } from '../services/api'

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

export default {
  name: 'LineChart',
  components: { Line },
  props: {
    chartId: {
      type: String,
      default: 'line-chart'
    },
    datasetIdKey: {
      type: String,
      default: 'label'
    },
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 400
    },
    cssClasses: {
      default: '',
      type: String
    },
    styles: {
      type: Object,
      default: () => {}
    },
    plugins: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    loaded: false,
    chartData: null,
    chartOptions: {
        responsive: true
    }
  }),
  async mounted () {
    this.loaded = false

    try {
      const datePrices = await api
			.get(`/coins/${this.chartId}/market_chart?vs_currency=usd&days=30&interval=daily`)
            .then((response) => { return response.data.prices})
      var Dates = []
      var Prices = []
      datePrices.map(item => {
        var date = new Date(item[0]).toLocaleDateString("en-US")
        Dates.push(date);
        Prices.push(item[1]);
      })

    this.chartData = {
        labels: Dates,
        datasets: [ { label: this.chartId, backgroundColor: '#f87979', data: Prices }]
    }
      this.loaded = true
    } catch (e) {
      console.error(e)
    }
  }
}
</script>
