import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { ToDo } from '@/types'
import { useStorage } from '@/composables/storage'

const toDoFactory = (text: string): ToDo => ({
  timestamp: Date.now(),
  text,
  completed: false,
})

export const useToDosStore = defineStore('toDoList', () => {
  const toDos = ref<ToDo[]>([])

  const filterOption = ref<'all' | 'pending' | 'completed'>('all')
  const searchQuery = ref('')
  const sortBy = ref<'content' | 'status'>('content')
  const sortDirection = ref<'asc' | 'desc'>('asc')

  const total = computed(() => toDos.value?.length ?? 0)
  const completedToDos = computed(() => (toDos.value ?? []).filter((toDo) => toDo.completed))
  const completed = computed(() => completedToDos.value.length)
  const pendingToDos = computed(() => (toDos.value ?? []).filter((toDo) => !toDo.completed))

  const storage = useStorage<ToDo[]>('toDos')

  const filteredAndSortedTodos = computed(() => {
    let filtered = toDos.value || []

    if (filterOption.value === 'pending') {
      filtered = filtered.filter((todo) => !todo.completed)
    } else if (filterOption.value === 'completed') {
      filtered = filtered.filter((todo) => todo.completed)
    }

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter((todo) => todo.text.toLowerCase().includes(query))
    }

    return [...filtered].sort((a, b) => {
      let result = 0

      if (sortBy.value === 'content') {
        const itemA = a.text.toLowerCase()
        const itemB = b.text.toLowerCase()
        if (itemA < itemB) result = -1
        if (itemA > itemB) result = 1
      } else if (sortBy.value === 'status') {
        result = a.completed === b.completed ? 0 : a.completed ? 1 : -1
      }

      if (sortDirection.value === 'desc') {
        result *= -1
      }

      return result
    })
  })

  const loadToDos = () => {
    toDos.value = storage.get() || []
  }

  const saveToDos = () => {
    // Helper para guardar y mantener DRY
    storage.set(toDos.value)
  }

  const addToDo = (toDo: string) => {
    const newToDo = toDoFactory(toDo)
    toDos.value.push(newToDo)
    saveToDos()
  }

  const toggleCompleted = (timestamp: number) => {
    const toDo = toDos.value.find((t) => t.timestamp === timestamp)
    if (toDo) {
      toDo.completed = !toDo.completed
    }
    saveToDos()
  }

  const removeToDo = (timestamp: number) => {
    const index = toDos.value.findIndex((t) => t.timestamp === timestamp)
    console.log(index)
    if (index !== -1) {
      toDos.value.splice(index, 1)
    }
    saveToDos()
  }

  const markAll = (completed: boolean) => {
    toDos.value.forEach((todo) => {
      todo.completed = completed
    })
    saveToDos()
  }

  const clearCompleted = () => {
    toDos.value = toDos.value.filter((todo) => !todo.completed)
    saveToDos()
  }

  const setFilter = (option: 'all' | 'pending' | 'completed') => {
    filterOption.value = option
  }

  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }

  const setSort = (by: 'content' | 'status', direction: 'asc' | 'desc') => {
    sortBy.value = by
    sortDirection.value = direction
  }

  return {
    total,
    completed,
    completedToDos,
    pendingToDos,
    toDos,
    filterOption,
    searchQuery,
    filteredAndSortedTodos,
    loadToDos,
    addToDo,
    toggleCompleted,
    removeToDo,
    markAll,
    clearCompleted,
    setFilter,
    setSearchQuery,
    setSort,
  }
})
