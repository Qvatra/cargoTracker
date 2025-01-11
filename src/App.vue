<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto">
      <header class="py-8">
        <h1 class="text-3xl font-bold text-center">
          Cargo Tracker
        </h1>
      </header>

      <RouterView />
    </div>
  </div>
</template>
