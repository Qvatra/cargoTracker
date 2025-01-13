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
  <div data-testid="shipment-card" class="bg-white rounded-lg shadow-md p-6">
    <h3 data-testid="shipment-id" class="text-xl font-semibold mb-4">
      #{{ shipment.id }}
    </h3>
    
    <div class="space-y-2 mb-4">
      <p data-testid="customer-info">
        <span class="font-medium">Customer:</span> {{ shipment.customer }}
      </p>
      <p data-testid="vessel-info">
        <span class="font-medium">Vessel:</span> {{ shipment.vessel }}
      </p>
      <p data-testid="eta-info">
        <span class="font-medium">ETA:</span> {{ shipment['shipment-eta'] }}
      </p>
      
      <p v-if="etaCheck?.error" data-testid="error-message" class="text-error">
        {{ etaCheck.error }}
      </p>
    </div>
    
    <div class="flex gap-2">
      <button
        data-testid="check-eta-button"
        @click="$emit('check-eta')"
        :disabled="isChecking"
        class="bg-primary hover:bg-primary-light text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
      >
        {{ isChecking ? 'Checking...' : 'Check Vessel ETA' }}
      </button>
    </div>
    
    <!-- ETA Discrepancy -->
    <div v-if="etaCheck?.hasDiscrepancy" data-testid="eta-discrepancy" class="mt-4 p-4 bg-warning/20 rounded-md">
      <p>
        Vessel ETA ({{ etaCheck.vesselEta }}) differs from shipment ETA ({{ etaCheck.shipmentEta }})
      </p>
      <button 
        data-testid="update-eta-button"
        @click="$emit('update-eta')"
        class="mt-2 bg-warning hover:bg-warning-light text-default font-medium py-2 px-4 rounded-md transition-colors"
      >
        Update Shipment ETA
      </button>
    </div>
  </div>
</template>