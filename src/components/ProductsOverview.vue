<template>
  <div class="container mt-5">
    <div class="row justify-content-between mb-5">
      <div class="col-8"><h1>Products</h1></div>
      <button class="col-2 btn btn-primary mb-3" @click="showAddModal">Add Product</button>
    </div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Price</th>
          <th scope="col" class="text-end">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.name }}</td>
          <td>{{ formatCurrency(product.price) }}</td>
          <td class="text-end">
            <button class="btn btn-sm btn-warning" @click="editProduct(product)">Edit</button>
            <button class="btn btn-sm btn-danger ms-2" @click="confirmDeleteProduct(product.id)">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Add/Edit Modal -->
    <!-- Add/Edit Modal -->
    <div
      class="modal fade"
      id="productModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              {{ isEdit ? 'Edit Product' : 'Add Product' }}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <form @submit.prevent="isEdit ? updateProduct() : addProduct()">
            <div class="modal-body">
              <div class="mb-3">
                <label for="product-name" class="form-label">Name</label>
                <input
                  type="text"
                  class="form-control"
                  id="product-name"
                  v-model="form.name"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="product-price" class="form-label">Price</label>
                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text">CHF</span>
                  </div>
                  <input
                    type="number"
                    class="form-control"
                    min="-1000.00"
                    max="1000.00"
                    step="0.05"
                    v-model="form.price"
                    required
                  />
                </div>
              </div>
              <div class="mb-3 row">
                <div class="col-3">
                  <label for="product-tile-color" class="form-label">Tile Color</label>
                </div>
                <div class="col-5">
                  <vue3-colorpicker
                    v-model:pureColor="form.tilecolor"
                    format="hex"
                    shape="square"
                    picker-type="fk"
                    use-type="pure"
                  ></vue3-colorpicker>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="submit" class="btn btn-primary">{{ isEdit ? 'Update' : 'Add' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, inject } from 'vue'
import axios from 'axios'
import { Modal } from 'bootstrap'
import { ColorPicker } from 'vue3-colorpicker'
import 'vue3-colorpicker/style.css'

export default {
  components: {
    'vue3-colorpicker': ColorPicker
  },
  setup() {
    const festivalStore = inject('festivalStore')
    const products = ref([])
    const isEdit = ref(false)
    const form = ref({
      id: null,
      name: '',
      price: null,
      tilecolor: '#ffffff',
      festival_id: festivalStore.state.festival_id
    })

    const productIdToDelete = ref(null)
    let modalInstance = null
    let deleteConfirmModalInstance = null

    const fetchProducts = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/products/${festivalStore.state.festival_id}`
      )
      products.value = response.data
    }

    const showAddModal = () => {
      isEdit.value = false
      form.value = {
        id: null,
        name: '',
        price: null,
        festival_id: festivalStore.state.festival_id
      }
      showModal()
    }

    const editProduct = (product) => {
      isEdit.value = true
      form.value = { ...product }
      showModal()
    }

    const addProduct = async () => {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/product`, form.value)
      products.value.push(response.data)
      closeModal()
    }

    const updateProduct = async () => {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/product/${form.value.id}`,
        form.value
      )
      const index = products.value.findIndex((p) => p.id === form.value.id)
      products.value[index] = response.data
      closeModal()
    }

    const confirmDeleteProduct = (id) => {
      productIdToDelete.value = id
      deleteConfirmModalInstance = new Modal(document.getElementById('deleteConfirmModal'))
      deleteConfirmModalInstance.show()
    }

    const deleteProduct = async () => {
      await axios.delete(`${import.meta.env.VITE_API_URL}/product/${productIdToDelete.value}`)
      products.value = products.value.filter((p) => p.id !== productIdToDelete.value)
      deleteConfirmModalInstance.hide()
    }

    const showModal = () => {
      modalInstance = new Modal(document.getElementById('productModal'))
      modalInstance.show()
    }

    const closeModal = () => {
      modalInstance.hide()
    }

    const formatCurrency = (value) => {
      if (!value) return ''
      return new Intl.NumberFormat('de-CH', { style: 'currency', currency: 'CHF' }).format(value)
    }

    onMounted(fetchProducts)

    return {
      products,
      isEdit,
      form,
      showAddModal,
      editProduct,
      addProduct,
      updateProduct,
      confirmDeleteProduct,
      deleteProduct,
      formatCurrency
    }
  }
}
</script>
