<script setup lang="ts">
import { useToDosStore } from '@/stores/toDos'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'

const toDoStore = useToDosStore()

const { filteredAndSortedTodos, total, completed, filterOption, searchQuery } =
  storeToRefs(toDoStore)

const localSearchQuery = ref(searchQuery.value)
const handleSearchInput = () => {
  toDoStore.setSearchQuery(localSearchQuery.value)
}

const filterOptions = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
]

const sortOptions = [
  { value: 'content-asc', label: 'A-Z (Content)' },
  { value: 'content-desc', label: 'Z-A (Content)' },
  { value: 'status-desc', label: 'Completed First' },
  { value: 'status-asc', label: 'Pending First' },
]

const handleSortChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value
  const [by, direction] = value.split('-')
  toDoStore.setSort(by as 'content' | 'status', direction as 'asc' | 'desc')
}

const onChange = (timestamp: number) => {
  toDoStore.toggleCompleted(timestamp)
}

const onRemove = (timestamp: number) => {
  console.log('Removing ToDo:', timestamp)
  toDoStore.removeToDo(timestamp)
}

onMounted(() => {
  toDoStore.loadToDos()
})
</script>

<template>
  <div v-if="total === 0" class="text-center py-6 text-gray-500 italic">No To-Dos to show</div>
  <div v-else>
    <div class="mb-4 p-3 border-b border-gray-200 flex justify-between items-center">
      <div v-if="total">
        <p class="text-sm text-gray-700">Total: {{ total }}</p>
        <p class="text-sm text-gray-700">Completed: {{ completed }}</p>
      </div>

      <div class="space-x-2">
        <button
          @click="toDoStore.markAll(true)"
          class="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition"
        >
          Select All
        </button>
        <button
          @click="toDoStore.clearCompleted()"
          :disabled="completed === 0"
          class="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition disabled:bg-red-300"
        >
          Delete Completed To Dos
        </button>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 p-3 border rounded-lg bg-gray-50">
      <div class="col-span-3 md:col-span-1">
        <input
          type="text"
          v-model="localSearchQuery"
          @input="handleSearchInput"
          placeholder="Search To Do..."
          class="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <select
          :value="filterOption"
          @change="
            (e) =>
              toDoStore.setFilter(
                (e.target as HTMLSelectElement).value as 'all' | 'pending' | 'completed',
              )
          "
          class="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option v-for="option in filterOptions" :key="option.value" :value="option.value">
            Filter: {{ option.label }}
          </option>
        </select>
      </div>

      <div>
        <select
          :value="`${toDoStore.sortBy}-${toDoStore.sortDirection}`"
          @change="handleSortChange"
          class="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option v-for="option in sortOptions" :key="option.value" :value="option.value">
            Sorter: {{ option.label }}
          </option>
        </select>
      </div>
    </div>

    <hr class="mb-6 border-gray-200" />

    <ul class="space-y-3">
      <li v-if="filteredAndSortedTodos.length === 0" class="text-center py-4 text-gray-500 italic">
        No To-Dos match your search criteria.
      </li>
      <li
        v-for="toDo in filteredAndSortedTodos"
        :key="toDo.timestamp"
        class="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm transition duration-300"
        :class="{
          'opacity-70 bg-green-50': toDo.completed,
          'hover:shadow-md': !toDo.completed,
        }"
      >
        <form @submit.prevent class="flex items-center justify-between">
          <input
            type="checkbox"
            :id="`toDo-${toDo.timestamp}`"
            :checked="toDo.completed"
            @change="onChange(toDo.timestamp)"
            class="form-checkbox h-5 w-5 text-indigo-600 rounded border-gray-300 cursor-pointer focus:ring-indigo-500"
          />
          <label
            :for="`toDo-${toDo.timestamp}`"
            class="flex-grow ml-3 text-lg text-gray-800 transition duration-300 cursor-pointer"
            :class="{
              'line-through text-gray-500 italic': toDo.completed,
              'font-medium': !toDo.completed,
            }"
            >{{ toDo.text }}</label
          >
          <button
            @click="onRemove(toDo.timestamp)"
            class="text-red-500 hover:text-red-700 ml-4 p-1 rounded-full hover:bg-red-100 transition duration-150"
            aria-label="Eliminar tarea"
          >
            🗑️
          </button>
        </form>
      </li>
    </ul>
  </div>
</template>
