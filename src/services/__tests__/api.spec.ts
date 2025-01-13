import { describe, it, expect, vi, beforeEach } from 'vitest'
import { api } from '../api'

describe('API Service', () => {
  const mockFetch = vi.fn()
  global.fetch = mockFetch

  beforeEach(() => {
    mockFetch.mockReset()
  })

  describe('getAllShipments', () => {
    it('fetches all shipments successfully', async () => {
      const mockShipments = [
        {
          id: 1,
          customer: 'Test Customer',
          vessel: 'CMA-CGM-CONCORDE',
          'shipment-eta': '2025-03-25'
        }
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockShipments)
      })

      const result = await api.getAllShipments()
      
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:9898/shipment')
      expect(result).toEqual(mockShipments)
    })

    it('handles API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      })

      await expect(api.getAllShipments()).rejects.toThrow('Failed to fetch shipments')
    })
  })

  describe('createShipment', () => {
    const newShipment = {
      customer: 'Test Customer',
      vessel: 'CMA-CGM-CONCORDE',
      'shipment-eta': '2025-03-25'
    }

    it('creates shipment successfully', async () => {
      const mockResponse = { ...newShipment, id: 1 }
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await api.createShipment(newShipment)
      
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:9898/shipment',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newShipment)
        }
      )
      expect(result).toEqual(mockResponse)
    })

    it('handles creation errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request'
      })

      await expect(api.createShipment(newShipment))
        .rejects.toThrow('Failed to create shipment')
    })
  })

  describe('updateShipment', () => {
    const updatedShipment = {
      id: 1,
      customer: 'Test Customer',
      vessel: 'CMA-CGM-CONCORDE',
      'shipment-eta': '2025-03-26'
    }

    it('updates shipment successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(updatedShipment)
      })

      const result = await api.updateShipment(1, updatedShipment)
      
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:9898/shipment/1',
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedShipment)
        }
      )
      expect(result).toEqual(updatedShipment)
    })

    it('handles update errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      })

      await expect(api.updateShipment(1, updatedShipment)).rejects.toThrow('Failed to update shipment')
    })
  })

  describe('getVessel', () => {
    it('fetches vessel successfully', async () => {
      const mockVessel = {
        vessel: 'CMA-CGM-CONCORDE',
        'vessel-eta': '2025-03-26'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockVessel)
      })

      const result = await api.getVessel('CMA-CGM-CONCORDE')
      
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:9898/vessel/CMA-CGM-CONCORDE')
      expect(result).toEqual(mockVessel)
    })

    it('handles vessel fetch errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      })

      await expect(api.getVessel('INVALID-VESSEL')).rejects.toThrow('Vessel not found')
    })
  })
}) 