import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import ShipmentList from '../ShipmentList.vue'
import { api } from '@/services/api'
import { useShipmentStore } from '@/stores/shipments'

vi.mock('@/services/api')

describe('ShipmentList', () => {
  const mountList = (initialState = {}) => {
    const wrapper = mount(ShipmentList, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            shipments: {
              shipments: [],
              loading: false,
              error: null,
              ...initialState
            }
          }
        })]
      }
    })
    return {
      wrapper,
      store: useShipmentStore()
    }
  }

  it('shows loading state', () => {
    const { wrapper } = mountList({ loading: true })
    expect(wrapper.get('[data-testid="loading-state"]')).toBeTruthy()
  })

  it('shows empty state', () => {
    const { wrapper } = mountList({ shipments: [] })
    expect(wrapper.get('[data-testid="empty-state"]')).toBeTruthy()
  })

  it('handles vessel ETA check', async () => {
    vi.mocked(api.getVessel).mockResolvedValue({
      vessel: 'CMA-CGM-CONCORDE',
      'vessel-eta': '2025-03-26'
    })

    const mockShipment = {
      id: 1,
      customer: 'Test',
      vessel: 'CMA-CGM-CONCORDE',
      'shipment-eta': '2025-03-25'
    }

    const { wrapper } = mountList({
      shipments: [mockShipment]
    })

    await wrapper.get('[data-testid="check-eta-button"]').trigger('click')
    expect(api.getVessel).toHaveBeenCalledWith('CMA-CGM-CONCORDE')
  })

  it('displays shipments when available', () => {
    const mockShipments = [
      {
        id: 1,
        customer: 'Test',
        vessel: 'CMA-CGM-CONCORDE',
        'shipment-eta': '2025-03-25'
      }
    ]

    const { wrapper } = mountList({ shipments: mockShipments })
    expect(wrapper.get('[data-testid="shipments-container"]')).toBeTruthy()
    expect(wrapper.findAll('[data-testid="shipment-card"]')).toHaveLength(1)
  })
})