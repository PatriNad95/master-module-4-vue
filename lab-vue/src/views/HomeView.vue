<script setup lang="ts">
import ToDoForm from '@/components/ToDoForm.vue'
import ToDoList from '@/components/ToDoList/ToDoList.vue'
</script>

<template>
  <div class="max-w-xl mx-auto mt-12 p-6 bg-white rounded-xl shadow-2xl border border-gray-100">
    <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">To Do List - Lab Vue</h1>

    <ToDoForm />
    <ToDoList />
  </div>
</template>
