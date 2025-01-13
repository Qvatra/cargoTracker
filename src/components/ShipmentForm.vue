<script setup lang="ts">
import { ref, computed } from 'vue'
import { useShipmentStore } from '@/stores/shipments'
import { VALID_VESSELS } from '@/constants/vessels'

const store = useShipmentStore()

const form = ref({
  customer: '',
  vessel: '',
  'shipment-eta': ''
})

const error = ref<string | null>(null)

// Get today's date in YYYY-MM-DD format
const today = computed(() => {
  const date = new Date()
  return date.toISOString().split('T')[0]
})

async function handleSubmit() {
  error.value = null
  
  // Validate ETA is not in the past
  if (form.value['shipment-eta'] < today.value) {
    error.value = 'ETA cannot be in the past'
    return
  }
  
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
  <div data-testid="shipment-form" class="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mb-8">
    <h2 data-testid="form-title" class="text-2xl font-semibold mb-6 text-gray-900">
      Register New Shipment
    </h2>
    
    <form @submit.prevent="handleSubmit" data-testid="shipment-form-container" class="space-y-4">
      <div>
        <label for="customer" class="block text-sm font-medium text-gray-700 mb-1">
          Customer Name
        </label>
        <input 
          id="customer"
          data-testid="customer-input"
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
          data-testid="vessel-select"
          v-model="form.vessel"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white
            appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] 
            bg-[length:1rem] bg-no-repeat bg-[center_right_1rem] pr-10"
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
          data-testid="eta-input"
          v-model="form['shipment-eta']"
          type="date"
          :min="today"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        >
      </div>
      
      <div v-if="error" data-testid="error-message" class="text-error mt-4">
        {{ error }}
      </div>
      
      <button 
        type="submit" 
        data-testid="submit-button"
        class="w-full bg-primary hover:bg-primary-light text-white font-medium py-2 px-4 rounded-md transition-colors"
      >
        Register Shipment
      </button>
    </form>
  </div>
</template> 