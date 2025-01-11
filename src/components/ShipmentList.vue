<script setup lang="ts">
import { onMounted } from 'vue'
import { useShipmentStore } from '@/stores/shipments'
import { api } from '@/services/api'

const store = useShipmentStore()

onMounted(() => {
  store.fetchShipments()
})

async function checkVesselEta(shipmentId: number) {
  const shipment = store.shipments.find(s => s.id === shipmentId)
  if (!shipment) {
    return
  }

  try {
    const vessel = await api.getVessel(shipment.vessel)
    if (vessel['vessel-eta'] !== shipment['shipment-eta']) {
      return {
        hasDiscrepancy: true,
        vesselEta: vessel['vessel-eta'],
        shipmentEta: shipment['shipment-eta']
      }
    }
    return { hasDiscrepancy: false }
  } catch (e) {
    console.error(e)
    return { hasDiscrepancy: false, error: 'Failed to check vessel ETA' }
  }
}

async function updateShipmentEta(shipmentId: number, newEta: string) {
  const shipment = store.shipments.find(s => s.id === shipmentId)
  if (!shipment) {
    return
  }

  try {
    await store.updateShipment(shipmentId, {
      ...shipment,
      'shipment-eta': newEta
    })
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <h2 class="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
      Registered Shipments
    </h2>
    
    <div v-if="store.loading" class="text-center py-8 text-gray-600 dark:text-gray-400">
      Loading shipments...
    </div>
    
    <div v-else-if="store.error" class="text-center py-8 text-error">
      {{ store.error }}
    </div>
    
    <div v-else-if="store.shipments.length === 0" class="text-center py-8 text-gray-600 dark:text-gray-400">
      No shipments registered yet.
    </div>
    
    <div v-else class="space-y-4">
      <div 
        v-for="shipment in store.shipments" 
        :key="shipment.id" 
        class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
      >
        <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Shipment #{{ shipment.id }}
        </h3>
        
        <div class="space-y-2 mb-4">
          <p class="text-gray-700 dark:text-gray-300">
            <span class="font-medium">Customer:</span> {{ shipment.customer }}
          </p>
          <p class="text-gray-700 dark:text-gray-300">
            <span class="font-medium">Vessel:</span> {{ shipment.vessel }}
          </p>
          <p class="text-gray-700 dark:text-gray-300">
            <span class="font-medium">ETA:</span> {{ shipment['shipment-eta'] }}
          </p>
        </div>
        
        <div class="flex gap-2">
          <button 
            @click="checkVesselEta(shipment.id!)"
            class="bg-primary hover:bg-primary-light text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Check Vessel ETA
          </button>
        </div>
      </div>
    </div>
  </div>
</template> 