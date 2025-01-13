import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import ShipmentForm from '../ShipmentForm.vue'
import { VALID_VESSELS } from '@/constants/vessels'
import { useShipmentStore } from '@/stores/shipments'

describe('ShipmentForm', () => {
  const mountForm = () => {
    const wrapper = mount(ShipmentForm, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            shipments: {
              shipments: [],
              loading: false,
              error: null
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

  it('renders all vessel options', () => {
    const { wrapper } = mountForm()
    const select = wrapper.get('[data-testid="vessel-select"]')
    const options = select.findAll('option')
    
    // +1 for the default "Select a vessel" option
    expect(options).toHaveLength(VALID_VESSELS.length + 1)
    VALID_VESSELS.forEach(vessel => {
      expect(options.some(opt => opt.text() === vessel)).toBe(true)
    })
  })

  it('validates past dates', async () => {
    const { wrapper } = mountForm()
    const form = wrapper.get('[data-testid="shipment-form-container"]')
    
    await wrapper.get('[data-testid="customer-input"]').setValue('Test Customer')
    await wrapper.get('[data-testid="vessel-select"]').setValue('CMA-CGM-CONCORDE')
    await wrapper.get('[data-testid="eta-input"]').setValue('2020-01-01') // Past date
    
    await form.trigger('submit')
    
    expect(wrapper.get('[data-testid="error-message"]')).toBeTruthy()
  })

  it('emits submit event on successful creation', async () => {
    const { wrapper } = mountForm()
    const form = wrapper.get('[data-testid="shipment-form-container"]')
    
    await wrapper.get('[data-testid="customer-input"]').setValue('Test Customer')
    await wrapper.get('[data-testid="vessel-select"]').setValue('CMA-CGM-CONCORDE')
    await wrapper.get('[data-testid="eta-input"]').setValue('2025-01-01')
    
    await form.trigger('submit')
    
    expect(wrapper.emitted('submit')).toBeTruthy()
  })
}) 