<template>
  <div class="container mt-5">
    <div class="row justify-content-between mb-5">
      <div class="col-7">
        <h3>{{ vendingPoint.name }} Overview</h3>
      </div>
      <button class="btn btn-primary mb-3 col-2" @click="showAddProductModal">Add Product</button>
    </div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">Product Name</th>
          <th scope="col" class="text-end">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(vendorProduct, index) in sortedVendorPointProducts" :key="vendorProduct.id">
          <td>{{ vendorProduct.product.name }}</td>
          <td class="text-end">
            <button class="btn btn-sm btn-danger me-2" @click="removeProduct(vendorProduct.id)">
              Remove
            </button>
            <button
              class="btn btn-sm btn-secondary me-2"
              @click="moveUp(index)"
              :disabled="index === 0"
            >
              Up
            </button>
            <button
              class="btn btn-sm btn-secondary"
              @click="moveDown(index)"
              :disabled="index === sortedVendorPointProducts.length - 1"
            >
              Down
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Add Product Modal -->
    <div
      class="modal fade"
      id="addProductModal"
      tabindex="-1"
      aria-labelledby="addProductModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addProductModalLabel">Add Product</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="available-products" class="form-label">Available Products</label>
              <select class="form-select" id="available-products" v-model="selectedProductId">
                <option v-for="product in availableProducts" :key="product.id" :value="product.id">
                  {{ product.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click="addProduct">Add</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import { Modal } from 'bootstrap'

export default {
  setup() {
    const route = useRoute()
    const vendingPoint = ref({})
    const vendorPointProducts = ref([])
    const availableProducts = ref([])
    const selectedProductId = ref(null)
    let addProductModalInstance = null

    const fetchVendingPoint = async (id) => {
      const response = await axios.get(`http://localhost:3000/vendor-point/${id}`)
      vendingPoint.value = response.data
      vendorPointProducts.value = response.data.vendorPointProducts
      fetchAvailableProducts()
    }

    const fetchAvailableProducts = async () => {
      const response = await axios.get('http://localhost:3000/products')
      const existingProductIds = vendorPointProducts.value.map(
        (vendorProduct) => vendorProduct.product.id
      )
      availableProducts.value = response.data.filter(
        (product) => !existingProductIds.includes(product.id)
      )
    }

    const removeProduct = async (vendorProductId) => {
      await axios.delete(
        `http://localhost:3000/vendor-point/${vendingPoint.value.id}/product/${vendorProductId}`
      )
      vendorPointProducts.value = vendorPointProducts.value.filter(
        (vendorProduct) => vendorProduct.id !== vendorProductId
      )
      fetchAvailableProducts()
    }

    const showAddProductModal = () => {
      selectedProductId.value = null
      addProductModalInstance = new Modal(document.getElementById('addProductModal'))
      addProductModalInstance.show()
    }

    const addProduct = async () => {
      if (selectedProductId.value) {
        const response = await axios.post(
          `http://localhost:3000/vendor-point/${vendingPoint.value.id}/product`,
          { productId: selectedProductId.value, order: vendorPointProducts.value.length + 1 }
        )
        vendorPointProducts.value.push(response.data)
        fetchAvailableProducts()
        addProductModalInstance.hide()
      }
    }

    const updateOrder = async (updatedProducts) => {
      await axios.put(`http://localhost:3000/vendor-point/${vendingPoint.value.id}/product/order`, {
        products: updatedProducts
      })
    }

    const moveUp = async (index) => {
      if (index > 0) {
        const product = vendorPointProducts.value[index]
        const aboveProduct = vendorPointProducts.value[index - 1]
        const updatedProducts = [
          { productId: product.id, order: aboveProduct.order },
          { productId: aboveProduct.id, order: product.order }
        ]
        await updateOrder(updatedProducts)
        fetchVendingPoint(vendingPoint.value.id) // Refresh the data to reflect the changes
      }
    }

    const moveDown = async (index) => {
      if (index < vendorPointProducts.value.length - 1) {
        const product = vendorPointProducts.value[index]
        const belowProduct = vendorPointProducts.value[index + 1]
        const updatedProducts = [
          { productId: product.id, order: belowProduct.order },
          { productId: belowProduct.id, order: product.order }
        ]
        await updateOrder(updatedProducts)
        fetchVendingPoint(vendingPoint.value.id) // Refresh the data to reflect the changes
      }
    }

    const sortedVendorPointProducts = computed(() => {
      return [...vendorPointProducts.value].sort((a, b) => a.order - b.order)
    })

    onMounted(() => {
      const id = route.params.id
      fetchVendingPoint(id)
    })

    return {
      vendingPoint,
      sortedVendorPointProducts,
      availableProducts,
      selectedProductId,
      removeProduct,
      showAddProductModal,
      addProduct,
      updateOrder,
      moveUp,
      moveDown
    }
  }
}
</script>
