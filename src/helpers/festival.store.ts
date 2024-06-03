import { reactive } from 'vue'

export const createFestivalStore = () => {
  const state = reactive({
    festival: localStorage.getItem('festival') || '',
    festival_id: localStorage.getItem('festival_id') || ''
  })

  const setFestival = (newFestival: string, newFestivalId: string) => {
    state.festival = newFestival
    state.festival_id = newFestivalId
    localStorage.setItem('festival', newFestival)
    localStorage.setItem('festival_id', newFestivalId)
  }

  const unsetFestival = () => {
    state.festival = ''
    state.festival_id = ''
    localStorage.removeItem('festival')
    localStorage.removeItem('festival_id')
  }

  return {
    state,
    setFestival,
    unsetFestival
  }
}
