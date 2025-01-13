<script setup lang="ts">
import ShipmentList from '@/components/ShipmentList.vue'
import ShipmentForm from '@/components/ShipmentForm.vue'
import { ref } from 'vue'

const showForm = ref(false)

function toggleForm() {
  showForm.value = !showForm.value
}
</script>

<template>
  <div data-testid="app" class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <header data-testid="app-header" class="py-8 sm:py-12">
        <div class="flex justify-between items-center border-b border-gray-200 pb-6">
          <div>
            <h1 class="text-3xl font-bold">
              Cargo Tracker
            </h1>

            <p class="mt-2 text-sm">
              Manage your shipments efficiently
            </p>
          </div>

          <button 
            data-testid="new-shipment-button"
            @click="toggleForm"
            class="inline-flex items-center px-4 py-2 bg-primary hover:bg-primary-light text-white text-sm font-medium rounded-md transition-colors shadow-sm"
          >
            <span v-if="!showForm" class="mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </span>

            <span v-else class="mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </span>

            {{ showForm ? 'Cancel' : 'New Shipment' }}
          </button>
        </div>
      </header>

      <main data-testid="app-main">
        <div v-if="showForm" class="mb-8">
          <ShipmentForm @submit="showForm = false" />
        </div>
        
        <ShipmentList />
      </main>
    </div>
  </div>
</template>
