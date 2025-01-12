<script setup lang="ts">
import type { Shipment } from '@/types/shipment'
import type { EtaCheck } from '@/types/eta.ts'

defineProps<{
  shipment: Shipment
  etaCheck?: EtaCheck
  isChecking?: boolean
  isUpdating?: boolean
}>()

defineEmits<{
  (e: 'check-eta'): void
  (e: 'update-eta'): void
}>()
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
    <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
      Shipment #{{ shipment.id }}
    </h3>
    
    <div class="space-y-2 mb-4">
      <!-- Shipment details -->
      <p class="text-gray-700 dark:text-gray-300">
        <span class="font-medium">Customer:</span> {{ shipment.customer }}
      </p>
      <p class="text-gray-700 dark:text-gray-300">
        <span class="font-medium">Vessel:</span> {{ shipment.vessel }}
      </p>
      <p class="text-gray-700 dark:text-gray-300">
        <span class="font-medium">ETA:</span> {{ shipment['shipment-eta'] }}
      </p>
      
      <!-- ETA Discrepancy -->
      <div v-if="etaCheck?.hasDiscrepancy" class="mt-2 p-4 bg-warning/20 rounded-md">
        <p class="text-warning-dark">
          Vessel ETA ({{ etaCheck.vesselEta }}) differs from shipment ETA ({{ etaCheck.shipmentEta }})
        </p>
        <button 
          @click="$emit('update-eta')"
          class="mt-2 bg-warning hover:bg-warning-light text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Update Shipment ETA
        </button>
      </div>
      
      <!-- Error Message -->
      <p v-if="etaCheck?.error" class="text-error">
        {{ etaCheck.error }}
      </p>
    </div>
    
    <div class="flex gap-2">
      <button 
        @click="$emit('check-eta')"
        :disabled="isChecking"
        class="bg-primary hover:bg-primary-light text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
      >
        {{ isChecking ? 'Checking...' : 'Check Vessel ETA' }}
      </button>
    </div>
  </div>
</template> 