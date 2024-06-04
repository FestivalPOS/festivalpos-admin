<template>
  <div class="container">
    <h1 class="mt-4 mb-5">Sales</h1>
    <div class="charts">
      <div class="chart">
        <h2 class="mb-4">Vendor Point Transactions</h2>
        <VendorPointTransactionsChart />
      </div>
      <div class="chart">
        <h2 class="mb-4">Vendor Point Revenue</h2>
        <VendorPointRevenueChart />
      </div>
    </div>
    <div class="charts mt-5">
      <div class="chart">
        <h2 class="mb-4">ProductQuantities</h2>
        <ProductQuantityChart />
      </div>
    </div>
  </div>
</template>

<script setup>
import VendorPointTransactionsChart from './VendorPointTransactionsChart.vue'
import VendorPointRevenueChart from './VendorPointRevenueChart.vue'
import ProductQuantityChart from './ProductQuantityChart.vue'
</script>

<style scoped>
.charts {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.chart {
  flex: 1;
  min-width: 300px;
}
</style>
