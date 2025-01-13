import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ShipmentCard from '../ShipmentCard.vue'

describe('ShipmentCard', () => {
  const mockShipment = {
    id: 1,
    customer: 'Test Customer',
    vessel: 'CMA-CGM-CONCORDE',
    'shipment-eta': '2025-03-25'
  }

  it('displays shipment details', () => {
    const wrapper = mount(ShipmentCard, {
      props: {
        shipment: mockShipment
      }
    })

    expect(wrapper.get('[data-testid="customer-info"]').text()).toContain(mockShipment.customer)
    expect(wrapper.get('[data-testid="vessel-info"]').text()).toContain(mockShipment.vessel)
    expect(wrapper.get('[data-testid="eta-info"]').text()).toContain(mockShipment['shipment-eta'])
  })

  it('shows ETA discrepancy when present', () => {
    const wrapper = mount(ShipmentCard, {
      props: {
        shipment: mockShipment,
        etaCheck: {
          hasDiscrepancy: true,
          vesselEta: '2025-03-26',
          shipmentEta: '2025-03-25'
        }
      }
    })

    expect(wrapper.find('[data-testid="eta-discrepancy"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="update-eta-button"]').exists()).toBe(true)
  })

  it('disables check button while checking', () => {
    const wrapper = mount(ShipmentCard, {
      props: {
        shipment: mockShipment,
        isChecking: true
      }
    })

    const button = wrapper.get('[data-testid="check-eta-button"]')
    expect(button.attributes('disabled')).toBeDefined()
  })

  it('emits check-eta event when button clicked', async () => {
    const wrapper = mount(ShipmentCard, {
      props: {
        shipment: mockShipment
      }
    })

    await wrapper.get('[data-testid="check-eta-button"]').trigger('click')
    expect(wrapper.emitted('check-eta')).toBeTruthy()
  })

  it('emits update-eta event when update button clicked', async () => {
    const wrapper = mount(ShipmentCard, {
      props: {
        shipment: mockShipment,
        etaCheck: {
          hasDiscrepancy: true,
          vesselEta: '2025-03-26',
          shipmentEta: '2025-03-25'
        }
      }
    })

    await wrapper.get('[data-testid="update-eta-button"]').trigger('click')
    expect(wrapper.emitted('update-eta')).toBeTruthy()
  })
}) 