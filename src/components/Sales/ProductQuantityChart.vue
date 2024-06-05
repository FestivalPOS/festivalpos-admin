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
  name: 'ProductQuantityChart',
  components: { Bar },

  data: () => ({
    loaded: false,
    chartData: null,
    chartOptions: {
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      },
      responsive: true,
      scales: {
        x: {
          stacked: true
        },
        y: {
          stacked: true
        }
      }
    }
  }),
  async mounted() {
    this.loaded = false

    try {
      const productSalesResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/sales/views/product-sales-summary`
      )

      console.log(productSalesResponse.data)

      const vendors = []
      const products = {}
      productSalesResponse.data.forEach((item) => {
        if (!vendors.includes(item.vendorPointName)) {
          vendors.push(item.vendorPointName)
        }
        if (!products[item.productName]) {
          products[item.productName] = {}
        }
        if (!products[item.productName][item.vendorPointName]) {
          products[item.productName][item.vendorPointName] = 0
        }
        products[item.productName][item.vendorPointName] += parseInt(item.totalQuantity)
      })

      const datasets = Object.keys(products).map((product, index) => {
        return {
          label: product,
          data: vendors.map((vendor) => products[product][vendor] || 0),
          backgroundColor: `rgba(${index * 50}, ${index * 50}, ${index * 50}, 0.2)`,
          borderColor: `rgba(${index * 50}, ${index * 50}, ${index * 50}, 1)`,
          borderWidth: 1
        }
      })

      this.chartData = {
        labels: vendors,
        datasets
      }

      this.loaded = true
    } catch (e) {
      console.error(e)
    }
  }
}
</script>
