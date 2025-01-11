import type { Shipment, Vessel } from '@/types/shipment'

const API_BASE = 'http://localhost:9898'

export const api = {
  async getAllShipments(): Promise<Shipment[]> {
    const response = await fetch(`${API_BASE}/shipment`)
    return response.json()
  },

  async getShipment(id: number): Promise<Shipment> {
    const response = await fetch(`${API_BASE}/shipment/${id}`)
    if (!response.ok) {
      throw new Error('Shipment not found')
    }
    return response.json()
  },

  async createShipment(shipment: Omit<Shipment, 'id'>): Promise<Shipment> {
    const response = await fetch(`${API_BASE}/shipment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shipment)
    })
    if (!response.ok) {
      throw new Error('Failed to create shipment')
    }
    return response.json()
  },

  async updateShipment(id: number, shipment: Shipment): Promise<Shipment> {
    const response = await fetch(`${API_BASE}/shipment/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shipment)
    })
    if (!response.ok) {
      throw new Error('Failed to update shipment')
    }
    return response.json()
  },

  async getVessel(name: string): Promise<Vessel> {
    const response = await fetch(`${API_BASE}/vessel/${name}`)
    if (!response.ok) {
      throw new Error('Vessel not found')
    }
    return response.json()
  }
}