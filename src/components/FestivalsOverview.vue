<template>
  <div class="container mt-5">
    <div class="row justify-content-between mb-5">
      <div class="col-8"><h1>Festivals</h1></div>
      <button class="col-2 btn btn-primary mb-3" @click="showAddModal">Add Festival</button>
    </div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Save Sales</th>
          <th scope="col" class="text-end">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="festival in festivals" :key="festival.id">
          <td>
            <a href="#" @click="selectFestival(festival)">
              {{ festival.name }}
            </a>
          </td>
          <td>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              v-if="festival.save_sales"
              width="24"
              viewBox="0 0 512 512"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="32"
                d="M416 128L192 384l-96-96"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              v-if="!festival.save_sales"
              width="24"
              class="ionicon"
              viewBox="0 0 512 512"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="32"
                d="M368 368L144 144M368 144L144 368"
              />
            </svg>
          </td>
          <td class="text-end">
            <button class="btn btn-sm btn-warning" @click="editFestival(festival)">Edit</button>
            <button class="btn btn-sm btn-danger ms-2" @click="confirmDeleteFestival(festival.id)">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Add/Edit Modal -->
    <div
      class="modal fade"
      id="festivalModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              {{ isEdit ? 'Edit Festival' : 'Add Festival' }}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <form @submit.prevent="isEdit ? updateFestival() : addFestival()">
            <div class="modal-body">
              <div class="mb-3">
                <label for="festival-name" class="form-label">Name</label>
                <input
                  type="text"
                  class="form-control"
                  id="festival-name"
                  v-model="form.name"
                  required
                />
              </div>
              <div class="mb-3">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value=""
                  id="save_sales"
                  v-model="form.save_sales"
                />
                <label for="save_sales" class="form-label ms-2">Save Sales</label>
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
          <div class="modal-body">Are you sure you want to delete this festival?</div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger" @click="deleteFestival">Delete</button>
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
import { useRouter } from 'vue-router'

export default {
  setup() {
    const loading = ref(true)
    const festivals = ref([])
    const isEdit = ref(false)
    const festivalIdToDelete = ref(null)
    const form = ref({
      id: null,
      name: '',
      save_sales: true
    })
    let modalInstance = null
    let deleteConfirmModalInstance = null
    const router = useRouter()
    const festivalStore = inject('festivalStore')

    const fetchFestivals = async () => {
      loading.value = true
      axios
        .get(`${import.meta.env.VITE_API_URL}/festivals`)
        .then((response) => {
          festivals.value = response.data
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
      form.value = { id: null, name: '', save_sales: true }
      showModal()
    }

    const editFestival = (festival) => {
      isEdit.value = true
      form.value = { ...festival, festival_id: festivalStore.state.festival_id }
      showModal()
    }

    const addFestival = async () => {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/festival`, form.value)
      festivals.value.push(response.data)
      closeModal()
    }

    const updateFestival = async () => {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/festival/${form.value.id}`,
        form.value
      )
      const index = festivals.value.findIndex((vp) => vp.id === form.value.id)
      festivals.value[index] = response.data
      closeModal()
    }

    const confirmDeleteFestival = (id) => {
      festivalIdToDelete.value = id
      deleteConfirmModalInstance = new Modal(document.getElementById('deleteConfirmModal'))
      deleteConfirmModalInstance.show()
    }

    const deleteFestival = async () => {
      await axios.delete(`${import.meta.env.VITE_API_URL}/festival/${festivalIdToDelete.value}`)
      festivals.value = festivals.value.filter((vp) => vp.id !== festivalIdToDelete.value)
      unsetFestival()
      deleteConfirmModalInstance.hide()
    }

    const showModal = () => {
      modalInstance = new Modal(document.getElementById('festivalModal'))
      modalInstance.show()
    }

    const closeModal = () => {
      modalInstance.hide()
    }

    const selectFestival = (festival) => {
      festivalStore.setFestival(festival.name, festival.id) // Set the global state
      router.push('/pos')
    }

    onMounted(() => {
      fetchFestivals()
      festivalStore.unsetFestival()
    })

    return {
      festivals,
      isEdit,
      form,
      showAddModal,
      editFestival,
      addFestival,
      updateFestival,
      confirmDeleteFestival,
      deleteFestival,
      selectFestival
    }
  }
}
</script>

<style scoped>
/* Add any custom styles here */
</style>
