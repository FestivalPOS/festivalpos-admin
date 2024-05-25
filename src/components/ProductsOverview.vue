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
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="submit" class="btn btn-primary">{{ isEdit ? 'Update' : 'Add' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      class="modal fade"
      id="deleteConfirmModal"
      tabindex="-1"
      aria-labelledby="deleteConfirmModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteConfirmModalLabel">Confirm Delete</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">Are you sure you want to delete this product?</div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger" @click="deleteProduct">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { Modal } from 'bootstrap'

export default {
  setup() {
    const products = ref([])
    const isEdit = ref(false)
    const form = ref({
      id: null,
      name: '',
      price: null
    })
    const productIdToDelete = ref(null)
    let modalInstance = null
    let deleteConfirmModalInstance = null

    const fetchProducts = async () => {
      const response = await axios.get('http://localhost:3000/products')
      products.value = response.data
    }

    const showAddModal = () => {
      isEdit.value = false
      form.value = { id: null, name: '', price: null }
      showModal()
    }

    const editProduct = (product) => {
      isEdit.value = true
      form.value = { ...product }
      showModal()
    }

    const addProduct = async () => {
      const response = await axios.post('http://localhost:3000/product', form.value)
      products.value.push(response.data)
      closeModal()
    }

    const updateProduct = async () => {
      const response = await axios.put(`http://localhost:3000/product/${form.value.id}`, form.value)
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
      await axios.delete(`http://localhost:3000/product/${productIdToDelete.value}`)
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