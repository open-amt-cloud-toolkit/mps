//Tests visiting the website, loging in and
//loging out of the default account

const loginFixtures = require('../fixtures/constants.json')

describe('Loging in and out of the web application', () => {
  beforeEach(() => {
    cy.visit("https://" + loginFixtures.ip + ":3000")
  })

  it('loads the login page properly', () => {})

  it('logs into the default account', () => {
    cy.get('[data-cy=username-textbox]')
      .type(loginFixtures.username)
    cy.get('[data-cy=password-textbox]')
      .type(loginFixtures.password)
    cy.get('[data-cy=sign-in-button]')
      .click()
  })

  it('logs out of the default account', () => {
    cy.get('[data-cy=profile-icon-button]')
      .click()
    cy.get('[data-cy=logout-button]')
      .click()
  })    
})