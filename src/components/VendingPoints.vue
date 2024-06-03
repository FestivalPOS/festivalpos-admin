<template>
  <div class="container mt-5">
    <div class="row justify-content-between mb-5">
      <div class="col-8"><h1>Vending Points</h1></div>
      <button class="col-2 btn btn-primary mb-3" @click="showAddModal">Add Vending Point</button>
    </div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col" class="text-end">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="stand in vendingPoints" :key="stand.id">
          <td>
            <router-link :to="{ name: 'VendingPointOverview', params: { id: stand.id } }">
              {{ stand.name }}
            </router-link>
          </td>
          <td class="text-end">
            <button class="btn btn-sm btn-warning" @click="editVendingPoint(stand)">Edit</button>
            <button class="btn btn-sm btn-danger ms-2" @click="confirmDeleteVendingPoint(stand.id)">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Add/Edit Modal -->
    <div
      class="modal fade"
      id="vendingPointModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              {{ isEdit ? 'Edit Vending Point' : 'Add Vending Point' }}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <form @submit.prevent="isEdit ? updateVendingPoint() : addVendingPoint()">
            <div class="modal-body">
              <div class="mb-3">
                <label for="vending-point-name" class="form-label">Name</label>
                <input
                  type="text"
                  class="form-control"
                  id="vending-point-name"
                  v-model="form.name"
                  required
                />
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
          <div class="modal-body">Are you sure you want to delete this vending point?</div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger" @click="deleteVendingPoint">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, inject } from 'vue'
import axios from 'axios'
import { Modal } from 'bootstrap'

export default {
  setup() {
    const festivalStore = inject('festivalStore')
    const loading = ref(true)
    const vendingPoints = ref([])
    const isEdit = ref(false)
    const form = ref({
      id: null,
      name: '',
      festival_id: festivalStore.state.festival_id
    })
    let modalInstance = null
    const vendingPointIdToDelete = ref(null)
    let deleteConfirmModalInstance = null

    const fetchVendingPoints = async () => {
      loading.value = true
      axios
        .get(`${import.meta.env.VITE_API_URL}/vendor-points/${festivalStore.state.festival_id}`)
        .then((response) => {
          vendingPoints.value = response.data
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          loading.value = false
        })
    }

    const showAddModal = () => {
      isEdit.value = false
      form.value = { id: null, name: '', festival_id: festivalStore.state.festival_id }
      showModal()
    }

    const editVendingPoint = (vendingPoint) => {
      isEdit.value = true
      form.value = { ...vendingPoint }
      showModal()
    }

    const addVendingPoint = async () => {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/vendor-point`, form.value)
      vendingPoints.value.push(response.data)
      closeModal()
    }

    const updateVendingPoint = async () => {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/vendor-point/${form.value.id}`,
        form.value
      )
      const index = vendingPoints.value.findIndex((vp) => vp.id === form.value.id)
      vendingPoints.value[index] = response.data
      closeModal()
    }

    const confirmDeleteVendingPoint = (id) => {
      vendingPointIdToDelete.value = id
      deleteConfirmModalInstance = new Modal(document.getElementById('deleteConfirmModal'))
      deleteConfirmModalInstance.show()
    }

    const deleteVendingPoint = async () => {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/vendor-point/${vendingPointIdToDelete.value}`
      )
      vendingPoints.value = vendingPoints.value.filter(
        (vp) => vp.id !== vendingPointIdToDelete.value
      )
      deleteConfirmModalInstance.hide()
    }

    const showModal = () => {
      modalInstance = new Modal(document.getElementById('vendingPointModal'))
      modalInstance.show()
    }

    const closeModal = () => {
      modalInstance.hide()
    }

    onMounted(() => {
      fetchVendingPoints()
    })

    return {
      vendingPoints,
      isEdit,
      form,
      showAddModal,
      editVendingPoint,
      addVendingPoint,
      updateVendingPoint,
      confirmDeleteVendingPoint,
      deleteVendingPoint
    }
  }
}
</script>

<style scoped>
/* Add any custom styles here */
</style>
