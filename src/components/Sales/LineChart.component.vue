<template>
  <Line :chart-data="props" :options="chartOptions" />
</template>

<script setup>
import { Line } from 'vue-chartjs'
import { ref } from 'vue'

const props = defineProps({
  chartData: {
    type: Object,
    required: true
  }
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false
})
</script>
