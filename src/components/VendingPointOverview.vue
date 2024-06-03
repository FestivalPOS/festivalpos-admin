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
            <button
              class="btn btn-sm btn-danger me-2"
              @click="removeProduct(vendorProduct.product.id)"
            >
              Remove
            </button>
            <button
              class="btn btn-sm btn-secondary me-2"
              @click="moveUp(vendorProduct.product.id)"
              :disabled="index === 0"
            >
              Up
            </button>
            <button
              class="btn btn-sm btn-secondary"
              @click="moveDown(vendorProduct.product.id)"
              :disabled="index === sortedVendorPointProducts.length - 1"
            >
              Down
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- QR Code Section -->
    <QRCodeComponent v-if="vendingPoint.id" :vendorPointId="vendingPoint.id" />

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
import { ref, onMounted, computed, inject } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import { Modal } from 'bootstrap'
import QRCodeComponent from './QRCode.component.vue'

export default {
  components: {
    QRCodeComponent
  },
  setup() {
    const route = useRoute()
    const vendingPoint = ref({})
    const vendorPointProducts = ref([])
    const availableProducts = ref([])
    const selectedProductId = ref(null)
    let addProductModalInstance = null
    const festivalStore = inject('festivalStore')

    const fetchVendingPoint = async (id) => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/vendor-point/${id}`)
        vendingPoint.value = response.data
        vendorPointProducts.value = response.data.vendorPointProducts
        fetchAvailableProducts()
      } catch (error) {
        console.error('Error fetching vending point:', error)
      }
    }

    const fetchAvailableProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/products/${festivalStore.state.festival_id}`
        )

        if (Array.isArray(response.data)) {
          const existingProductIds = vendorPointProducts.value.map(
            (vendorProduct) => vendorProduct.product.id
          )
          availableProducts.value = response.data.filter(
            (product) => !existingProductIds.includes(product.id)
          )
        } else {
          console.error('Expected an array but received:', response.data)
        }
      } catch (error) {
        console.error('Error fetching available products:', error)
      }
    }

    const removeProduct = async (vendorProductId) => {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/vendor-point/${vendingPoint.value.id}/product/${vendorProductId}`
        )
        // Refetch vendor point products to ensure correct ordering
        await fetchVendingPoint(vendingPoint.value.id)
      } catch (error) {
        console.error('Error removing product:', error)
        res.status(500).json({ message: error.message })
      }
    }

    const showAddProductModal = () => {
      selectedProductId.value = null
      addProductModalInstance = new Modal(document.getElementById('addProductModal'))
      addProductModalInstance.show()
    }

    const addProduct = async () => {
      if (selectedProductId.value) {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/vendor-point/${vendingPoint.value.id}/product`,
          { productId: selectedProductId.value, order: vendorPointProducts.value.length + 1 }
        )
        vendorPointProducts.value.push(response.data)
        fetchAvailableProducts()
        addProductModalInstance.hide()
      }
    }

    const moveUp = async (productId) => {
      try {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/vendor-point/${vendingPoint.value.id}/product/${productId}/move-up`
        )
        await fetchVendingPoint(vendingPoint.value.id)
      } catch (error) {
        console.error('Error moving product up:', error)
      }
    }

    const moveDown = async (productId) => {
      try {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/vendor-point/${vendingPoint.value.id}/product/${productId}/move-down`
        )
        await fetchVendingPoint(vendingPoint.value.id)
      } catch (error) {
        console.error('Error moving product down:', error)
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
      moveUp,
      moveDown
    }
  }
}
</script>
