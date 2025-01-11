<script setup lang="ts">
import { ref } from 'vue'
import { useShipmentStore } from '@/stores/shipments'
import { VALID_VESSELS } from '@/constants/vessels'

const store = useShipmentStore()

const form = ref({
  customer: '',
  vessel: '',
  'shipment-eta': ''
})

const error = ref<string | null>(null)

async function handleSubmit() {
  error.value = null
  
  try {
    await store.createShipment(form.value)

    form.value = {
      customer: '',
      vessel: '',
      'shipment-eta': ''
    }
  } catch (e) {
    console.error(e)
    error.value = 'Failed to create shipment'
  }
}
</script>

<template>
  <div class="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mb-8">
    <h2 class="text-2xl font-semibold mb-6 text-gray-900">
      Register New Shipment
    </h2>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="customer" class="block text-sm font-medium text-gray-700 mb-1">
          Customer Name
        </label>
        <input 
          id="customer"
          v-model="form.customer"
          type="text"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        >
      </div>
      
      <div>
        <label for="vessel" class="block text-sm font-medium text-gray-700 mb-1">
          Vessel
        </label>
        <select
          id="vessel"
          v-model="form.vessel"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
        >
          <option value="">Select a vessel</option>
          <option v-for="vessel in VALID_VESSELS" :key="vessel" :value="vessel">
            {{ vessel }}
          </option>
        </select>
      </div>
      
      <div>
        <label for="eta" class="block text-sm font-medium text-gray-700 mb-1">
          ETA
        </label>
        <input 
          id="eta"
          v-model="form['shipment-eta']"
          type="date"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        >
      </div>
      
      <div v-if="error" class="text-error mt-4">
        {{ error }}
      </div>
      
      <button 
        type="submit" 
        class="w-full bg-primary hover:bg-primary-light text-white font-medium py-2 px-4 rounded-md transition-colors"
      >
        Register Shipment
      </button>
    </form>
  </div>
</template> 