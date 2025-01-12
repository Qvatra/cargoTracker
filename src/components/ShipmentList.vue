<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useShipmentStore } from '@/stores/shipments'
import { api } from '@/services/api'
import ShipmentCard from './ShipmentCard.vue'
import type { EtaCheck } from '@/types/eta.ts'

const store = useShipmentStore()
const etaChecks = ref<Record<number, EtaCheck>>({})
const checkingEtas = ref<Record<number, boolean>>({})

onMounted(() => {
  store.fetchShipments()
})

async function checkVesselEta(shipmentId: number) {
  const shipment = store.shipments.find(s => s.id === shipmentId)
  if (!shipment) {
    return
  }

  checkingEtas.value[shipmentId] = true
  
  try {
    const vessel = await api.getVessel(shipment.vessel)
    if (vessel['vessel-eta'] !== shipment['shipment-eta']) {
      etaChecks.value[shipmentId] = {
        hasDiscrepancy: true,
        vesselEta: vessel['vessel-eta'],
        shipmentEta: shipment['shipment-eta']
      }
    } else {
      etaChecks.value[shipmentId] = { hasDiscrepancy: false }
    }
  } catch (e) {
    console.error(e)
    etaChecks.value[shipmentId] = { 
      hasDiscrepancy: false, 
      error: 'Failed to check vessel ETA' 
    }
  } finally {
    checkingEtas.value[shipmentId] = false
  }
}

async function updateShipmentEta(shipmentId: number) {
  const shipment = store.shipments.find(s => s.id === shipmentId)
  const check = etaChecks.value[shipmentId]
  
  if (!shipment || !check.vesselEta) {
    return
  }
  
  try {
    await store.updateShipment(shipmentId, {
      ...shipment,
      'shipment-eta': check.vesselEta
    })
    // Clear the check after successful update
    etaChecks.value[shipmentId] = { hasDiscrepancy: false }
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
      <ShipmentCard
        v-for="shipment in store.shipments"
        :key="shipment.id"
        :shipment="shipment"
        :eta-check="etaChecks[shipment.id!]"
        :is-checking="checkingEtas[shipment.id!]"
        @check-eta="checkVesselEta(shipment.id!)"
        @update-eta="updateShipmentEta(shipment.id!)"
      />
    </div>
  </div>
</template> 