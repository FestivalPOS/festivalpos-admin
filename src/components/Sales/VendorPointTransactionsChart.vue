<template>
  <Bar v-if="loaded" :data="chartData" :options="chartOptions" />
</template>

<script>
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import axios from 'axios'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'VendorPointTransactionsChart',
  components: { Bar },

  data: () => ({
    loaded: false,
    chartData: null,
    chartOptions: {
      plugins: {
        legend: {
          display: false
        }
      }
    }
  }),
  async mounted() {
    this.loaded = false

    try {
      const vendorPointSalesResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/sales/views/vendor-point-sales-summary`
      )

      const newChartData = {
        labels: [],
        datasets: [
          {
            label: 'Transactions',
            data: [],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)'
            ],
            borderWidth: 1
          }
        ]
      }

      newChartData.labels = vendorPointSalesResponse.data.map((item) => item.vendorPointName)
      newChartData.datasets[0].data = vendorPointSalesResponse.data.map(
        (item) => item.totalSalesTransactions
      )

      this.chartData = {
        labels: newChartData.labels,
        datasets: newChartData.datasets
      }

      this.loaded = true
    } catch (e) {
      console.error(e)
    }
  }
}
</script>
