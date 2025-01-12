import { defineStore } from 'pinia'
import type { Shipment } from '@/types/shipment'
import { api } from '@/services/api'

interface ShipmentState {
  shipments: Shipment[]
  loading: boolean
  error: string | null
}

export const useShipmentStore = defineStore('shipments', {
  state: (): ShipmentState => ({
    shipments: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchShipments() {
      this.loading = true
      this.error = null
      try {
        this.shipments = await api.getAllShipments()
      } catch (e) {
        this.error = 'Failed to fetch shipments'
        console.error(e)
      } finally {
        this.loading = false
      }
    },

    async createShipment(shipment: Omit<Shipment, 'id'>) {
      this.loading = true
      this.error = null
      try {
        const newShipment = await api.createShipment(shipment)
        this.shipments = [...(this.shipments || []), newShipment]
        return newShipment
      } catch (e) {
        this.error = 'Failed to create shipment'
        console.error(e)
        throw e
      } finally {
        this.loading = false
      }
    },

    async updateShipment(id: number, shipment: Shipment) {
      this.loading = true
      this.error = null
      try {
        const updatedShipment = await api.updateShipment(id, shipment)
        const index = this.shipments.findIndex(s => s.id === id)
        if (index !== -1) {
          this.shipments = [
            ...this.shipments.slice(0, index),
            updatedShipment,
            ...this.shipments.slice(index + 1)
          ]
        }
        return updatedShipment
      } catch (e) {
        this.error = 'Failed to update shipment'
        console.error(e)
        throw e
      } finally {
        this.loading = false
      }
    }
  },

  getters: {
    hasShipments: (state) => state.shipments.length > 0,
    getShipmentById: (state) => (id: number) => 
      state.shipments.find(s => s.id === id)
  }
}) 