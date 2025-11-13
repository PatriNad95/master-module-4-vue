<script setup lang="ts">
import { useToDosStore } from '@/stores/toDos'
import { ref } from 'vue'

const newToDo = ref('')

const toDoStore = useToDosStore()
const addToDo = () => {
  console.log('Adding ToDo:', newToDo.value)
  toDoStore.addToDo(newToDo.value)
  newToDo.value = ''
}
</script>

<template>
  <form @submit.prevent="addToDo" class="flex mb-6">
    <div class="flex flex-col sm:flex-row flex-grow">
      <label for="toDo" class="sr-only">To Do:</label>
      <input
        id="toDo"
        type="text"
        v-model="newToDo"
        class="flex-grow p-3 border border-gray-300 rounded-l-lg sm:rounded-l-lg sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg w-full"
      />
    </div>
    <button
      :disabled="!newToDo.trim()"
      class="px-6 py-3 text-white font-semibold rounded-r-lg transition duration-300 w-full sm:w-auto mt-2 sm:mt-0"
      :class="{
        'bg-indigo-600 hover:bg-indigo-700': newToDo.trim(),
        'bg-indigo-300 cursor-not-allowed': !newToDo.trim(),
      }"
    >
      Add <span class="ml-1">➕</span>
    </button>
  </form>
</template>
