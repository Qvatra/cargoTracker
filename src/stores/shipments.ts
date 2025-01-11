import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Shipment } from '@/types/shipment'
import { api } from '@/services/api'

export const useShipmentStore = defineStore('shipments', () => {
  const shipments = ref<Shipment[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchShipments() {
    loading.value = true
    error.value = null
    try {
      shipments.value = await api.getAllShipments()
    } catch (e) {
      error.value = 'Failed to fetch shipments'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  async function createShipment(shipment: Omit<Shipment, 'id'>) {
    loading.value = true
    error.value = null
    try {
      const newShipment = await api.createShipment(shipment)
      shipments.value.push(newShipment)
      return newShipment
    } catch (e) {
      error.value = 'Failed to create shipment'
      console.error(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateShipment(id: number, shipment: Shipment) {
    loading.value = true
    error.value = null
    try {
      const updatedShipment = await api.updateShipment(id, shipment)
      const index = shipments.value.findIndex(s => s.id === id)
      if (index !== -1) {
        shipments.value[index] = updatedShipment
      }
      return updatedShipment
    } catch (e) {
      error.value = 'Failed to update shipment'
      console.error(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    shipments,
    loading,
    error,
    fetchShipments,
    createShipment,
    updateShipment
  }
}) 