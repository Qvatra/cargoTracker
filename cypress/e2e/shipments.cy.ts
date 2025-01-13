const createShipment = () => {
  cy.get('[data-testid="shipment-form"]').should('not.exist')
  cy.get('[data-testid="new-shipment-button"]').click()
  cy.get('[data-testid="shipment-form"]').should('exist')
  cy.get('[data-testid="customer-input"]').type('Test Customer')
  cy.get('[data-testid="vessel-select"]').select('CMA-CGM-CONCORDE')
  cy.get('[data-testid="eta-input"]').type('2025-03-25')
  cy.get('[data-testid="submit-button"]').click()
  cy.wait('@createShipment')
  cy.get('[data-testid="shipment-form"]').should('not.exist')
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

    cy.get('[data-testid="customer-info"]').should('contain', 'Test Customer')
    cy.get('[data-testid="vessel-info"]').should('contain', 'CMA-CGM-CONCORDE')
    cy.get('[data-testid="eta-info"]').should('contain', '2025-03-25')
  })

  it('can check vessel ETA', () => {
    createShipment()

    cy.get('[data-testid="check-eta-button"]').first().click()
    cy.wait('@getVessel')

    cy.get('[data-testid="eta-discrepancy"]').should('be.visible')
    cy.get('[data-testid="update-eta-button"]').should('be.visible')
  })

  it('can update shipment ETA', () => {
    createShipment()

    cy.get('[data-testid="check-eta-button"]').first().click()
    cy.wait('@getVessel')
    cy.get('[data-testid="update-eta-button"]').first().click()
    cy.wait('@updateShipment')

    cy.get('[data-testid="eta-info"]').should('contain', '2024-03-26')
    cy.get('[data-testid="eta-discrepancy"]').should('not.exist')
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
      cy.get('[data-testid="new-shipment-button"]').click()
      cy.get('[data-testid="customer-input"]').type('Test Customer')
      cy.get('[data-testid="vessel-select"]').select('CMA-CGM-CONCORDE')
      cy.get('[data-testid="eta-input"]').type('2025-10-09')
      cy.get('[data-testid="submit-button"]').click()
      
      cy.get('@createShipment.all').should('have.length', 0)
    })

    it('allows creating shipment with today date', () => {
      cy.get('[data-testid="new-shipment-button"]').click()
      cy.get('[data-testid="customer-input"]').type('Test Customer')
      cy.get('[data-testid="vessel-select"]').select('CMA-CGM-CONCORDE')
      cy.get('[data-testid="eta-input"]').type('2025-10-10')
      cy.get('[data-testid="submit-button"]').click()

      cy.wait('@createShipment')
      cy.get('[data-testid="shipment-card"]').should('be.visible')
    })

    it('allows creating shipment with future date', () => {
      cy.get('[data-testid="new-shipment-button"]').click()
      cy.get('[data-testid="customer-input"]').type('Test Customer')
      cy.get('[data-testid="vessel-select"]').select('CMA-CGM-CONCORDE')
      cy.get('[data-testid="eta-input"]').type('2025-10-11')
      cy.get('[data-testid="submit-button"]').click()

      cy.wait('@createShipment')
      cy.get('[data-testid="shipment-card"]').should('be.visible')
    })
  })

  describe('Error handling', () => {
    it('handles shipment creation errors', () => {
      cy.intercept('POST', 'http://localhost:9898/shipment', {
        statusCode: 500,
        body: 'Server error'
      }).as('createShipmentError')

      cy.get('[data-testid="new-shipment-button"]').click()
      cy.get('[data-testid="customer-input"]').type('Test Customer')
      cy.get('[data-testid="vessel-select"]').select('CMA-CGM-CONCORDE')
      cy.get('[data-testid="eta-input"]').type('2025-03-25')
      cy.get('[data-testid="submit-button"]').click()

      cy.wait('@createShipmentError')
      cy.get('[data-testid="error-state"]').should('be.visible')
    })

    it('handles ETA update errors', () => {
      createShipment()

      cy.intercept('PUT', 'http://localhost:9898/shipment/*', {
        statusCode: 500,
        body: 'Server error'
      }).as('updateShipmentError')

      cy.get('[data-testid="check-eta-button"]').first().click()
      cy.wait('@getVessel')
      cy.get('[data-testid="update-eta-button"]').first().click()

      cy.wait('@updateShipmentError')
      cy.get('[data-testid="error-state"]').should('be.visible')
    })
  })
}) 