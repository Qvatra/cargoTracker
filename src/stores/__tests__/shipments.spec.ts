import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useShipmentStore } from '../shipments'
import { api } from '@/services/api'

vi.mock('@/services/api', () => ({
  api: {
    getAllShipments: vi.fn(),
    createShipment: vi.fn(),
    updateShipment: vi.fn()
  }
}))

describe('Shipments Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('fetchShipments', () => {
    it('should fetch shipments successfully', async () => {
      const mockShipments = [
        { 
          id: 1, 
          customer: 'Test Customer', 
          vessel: 'TEST-VESSEL', 
          'shipment-eta': '2024-03-20' 
        }
      ]
      
      vi.mocked(api.getAllShipments).mockResolvedValue(mockShipments)
      
      const store = useShipmentStore()
      await store.fetchShipments()

      expect(store.shipments).toEqual(mockShipments)
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
      expect(api.getAllShipments).toHaveBeenCalledTimes(1)
    })

    it('should handle fetch error', async () => {
      vi.mocked(api.getAllShipments).mockRejectedValue(new Error('Network error'))
      
      const store = useShipmentStore()
      await store.fetchShipments()

      expect(store.shipments).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBe('Failed to fetch shipments')
      expect(api.getAllShipments).toHaveBeenCalledTimes(1)
    })
  })

  describe('createShipment', () => {
    it('should create shipment successfully', async () => {
      const newShipment = {
        customer: 'New Customer',
        vessel: 'NEW-VESSEL',
        'shipment-eta': '2024-03-21'
      }
      
      const createdShipment = { 
        id: 1,
        ...newShipment
      }
      
      vi.mocked(api.createShipment).mockResolvedValue(createdShipment)
      
      const store = useShipmentStore()
      const result = await store.createShipment(newShipment)

      expect(result).toEqual(createdShipment)
      expect(store.shipments).toEqual([createdShipment])
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
      expect(api.createShipment).toHaveBeenCalledWith(newShipment)
    })

    it('should handle create error', async () => {
      const newShipment = {
        customer: 'New Customer',
        vessel: 'NEW-VESSEL',
        'shipment-eta': '2024-03-21'
      }
      
      vi.mocked(api.createShipment).mockRejectedValue(new Error('Network error'))
      
      const store = useShipmentStore()
      
      await expect(store.createShipment(newShipment)).rejects.toThrow()
      
      expect(store.shipments).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBe('Failed to create shipment')
      expect(api.createShipment).toHaveBeenCalledWith(newShipment)
    })
  })

  describe('updateShipment', () => {
    it('should update shipment successfully', async () => {
      const existingShipment = {
        id: 1,
        customer: 'Test Customer',
        vessel: 'TEST-VESSEL',
        'shipment-eta': '2024-03-20'
      }
      
      const updatedShipment = {
        ...existingShipment,
        'shipment-eta': '2024-03-22'
      }
      
      vi.mocked(api.updateShipment).mockResolvedValue(updatedShipment)
      
      const store = useShipmentStore()
      store.shipments = [existingShipment]
      
      const result = await store.updateShipment(1, updatedShipment)

      expect(result).toEqual(updatedShipment)
      expect(store.shipments[0]).toEqual(updatedShipment)
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
      expect(api.updateShipment).toHaveBeenCalledWith(1, updatedShipment)
    })

    it('should handle update error', async () => {
      const existingShipment = {
        id: 1,
        customer: 'Test Customer',
        vessel: 'TEST-VESSEL',
        'shipment-eta': '2024-03-20'
      }
      
      vi.mocked(api.updateShipment).mockRejectedValue(new Error('Network error'))
      
      const store = useShipmentStore()
      store.shipments = [existingShipment]
      
      await expect(store.updateShipment(1, existingShipment)).rejects.toThrow()
      
      expect(store.shipments[0]).toEqual(existingShipment) // Should not change
      expect(store.loading).toBe(false)
      expect(store.error).toBe('Failed to update shipment')
      expect(api.updateShipment).toHaveBeenCalledWith(1, existingShipment)
    })
  })

  describe('store state', () => {
    it('should have correct initial state', () => {
      const store = useShipmentStore()
      
      expect(store.shipments).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })
  })

  describe('getters', () => {
    it('hasShipments returns true when shipments exist', () => {
      const store = useShipmentStore()
      expect(store.hasShipments).toBe(false)
      store.shipments = [{
        id: 1,
        customer: 'Test Customer',
        vessel: 'CMA-CGM-CONCORDE',
        'shipment-eta': '2025-01-01'
      }]

      expect(store.hasShipments).toBe(true)
    })

    it('getShipmentById returns correct shipment', () => {
      const store = useShipmentStore()
      const mockShipment = {
        id: 1,
        customer: 'Test Customer',
        vessel: 'CMA-CGM-CONCORDE',
        'shipment-eta': '2025-01-01'
      }
      store.shipments = [mockShipment]

      expect(store.getShipmentById(1)).toEqual(mockShipment)
      expect(store.getShipmentById(999)).toBeUndefined()
    })
  })
}) 