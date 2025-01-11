export interface Shipment {
  id?: number
  customer: string
  vessel: string
  'shipment-eta': string
}

export interface Vessel {
  vessel: string
  'vessel-eta': string
} 