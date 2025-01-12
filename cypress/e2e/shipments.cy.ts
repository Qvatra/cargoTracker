const createShipment = () => {
    cy.get('form').should('not.exist')
    cy.contains('button', 'New Shipment').click()
    cy.get('form').should('exist')
    cy.get('input[id="customer"]').type('Test Customer')
    cy.get('select[id="vessel"]').select('CMA-CGM-CONCORDE')
    cy.get('input[id="eta"]').type('2025-03-25')
    cy.contains('button', 'Register Shipment').click()
    cy.wait('@createShipment')
    cy.get('form').should('not.exist')
}

describe('Cargo Tracker', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.intercept('GET', 'http://localhost:9898/shipment', []).as('getShipments')
    cy.intercept('POST', 'http://localhost:9898/shipment', {
      id: 1,
      customer: 'Test Customer',
      vessel: 'CMA-CGM-CONCORDE',
      'shipment-eta': '2025-03-25'
    }).as('createShipment')
    cy.intercept('GET', 'http://localhost:9898/vessel/*', {
      vessel: 'CMA-CGM-CONCORDE',
      'vessel-eta': '2024-03-26'
    }).as('getVessel')
    cy.intercept('PUT', 'http://localhost:9898/shipment/*', {
      id: 1,
      customer: 'Test Customer',
      vessel: 'CMA-CGM-CONCORDE',
      'shipment-eta': '2024-03-26'
    }).as('updateShipment')
  })

  it('can create a new shipment', () => {
    createShipment()

    cy.contains('Test Customer')
    cy.contains('CMA-CGM-CONCORDE')
    cy.contains('2025-03-25')
  })

  it('can check vessel ETA', () => {
    createShipment()

    // Check ETA
    cy.contains('button', 'Check Vessel ETA').click()
    cy.wait('@getVessel')

    // Verify ETA discrepancy is shown
    cy.contains('Vessel ETA (2024-03-26) differs from shipment ETA')
    cy.contains('button', 'Update Shipment ETA')
  })

  it('can update shipment ETA', () => {
    createShipment()

    // Check and update ETA
    cy.contains('button', 'Check Vessel ETA').click()
    cy.wait('@getVessel')
    cy.contains('button', 'Update Shipment ETA').click()
    cy.wait('@updateShipment')

    // Verify the update
    cy.contains('2024-03-26')
    cy.contains('Vessel ETA (2024-03-26) differs').should('not.exist')
  })

  describe('Date validation', () => {
    before(() => {
      cy.clock(new Date('2025-10-10').getTime())
    })

    after(() => {
      cy.clock().then((clock) => {
        clock.restore()
      })
    })

    it('prevents creating shipment with past date', () => {
      cy.contains('button', 'New Shipment').click()
      cy.get('input[id="customer"]').type('Test Customer')
      cy.get('select[id="vessel"]').select('CMA-CGM-CONCORDE')
      cy.get('input[id="eta"]').type('2025-10-09')
      cy.contains('button', 'Register Shipment').click()
      
      cy.get('@createShipment.all').should('have.length', 0)
    })

    it('allows creating shipment with future date', () => {
      cy.contains('button', 'New Shipment').click()
      cy.get('input[id="customer"]').type('Test Customer')
      cy.get('select[id="vessel"]').select('CMA-CGM-CONCORDE')
      cy.get('input[id="eta"]').type('2025-10-11')
      cy.contains('button', 'Register Shipment').click()

      cy.wait('@createShipment')
    })
  })

  describe('Error handling', () => {
    it('handles shipment creation errors', () => {
      cy.intercept('POST', 'http://localhost:9898/shipment', {
        statusCode: 500,
        body: 'Server error'
      }).as('createShipmentError')

      cy.contains('button', 'New Shipment').click()
      cy.get('input[id="customer"]').type('Test Customer')
      cy.get('select[id="vessel"]').select('CMA-CGM-CONCORDE')
      cy.get('input[id="eta"]').type('2025-03-25')
      cy.contains('button', 'Register Shipment').click()

      cy.contains('Failed to create shipment')
    })

    it('handles ETA update errors', () => {
        createShipment()

      // Mock update error
      cy.intercept('PUT', 'http://localhost:9898/shipment/*', {
        statusCode: 500,
        body: 'Server error'
      }).as('updateShipmentError')

      // Try to update ETA
      cy.contains('button', 'Check Vessel ETA').click()
      cy.wait('@getVessel')
      cy.contains('button', 'Update Shipment ETA').click()

      cy.contains('Failed to update shipment')
    })
  })
}) 