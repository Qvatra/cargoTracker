<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useShipmentStore } from '@/stores/shipments'
import { api } from '@/services/api'
import ShipmentCard from '@/components/ShipmentCard.vue'
import type { EtaCheck } from '@/types/eta.ts'

const store = useShipmentStore()
const { shipments, loading, error } = storeToRefs(store)
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
  <div data-testid="shipment-list" class="max-w-4xl mx-auto">
    <h2 data-testid="list-title" class="text-2xl font-semibold mb-6 text-gray-900">
      Registered Shipments
    </h2>
    
    <div v-if="loading" data-testid="loading-state" class="text-center py-8 text-gray-600">
      Loading shipments...
    </div>
    
    <div v-else-if="error" data-testid="error-state" class="text-center py-8 text-error">
      {{ error }}
    </div>
    
    <div v-else-if="!shipments?.length" data-testid="empty-state" class="text-center py-8 text-gray-600">
      No shipments registered yet.
    </div>
    
    <div v-else data-testid="shipments-container" class="space-y-4">
      <ShipmentCard
        v-for="shipment in shipments"
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