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
    const colors = {
      background: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      border: [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)'
      ]
    }

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
        const colorIndex = index % colors.background.length
        return {
          label: product,
          data: vendors.map((vendor) => products[product][vendor] || 0),
          backgroundColor: colors.background[colorIndex],
          borderColor: colors.border[colorIndex],
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
