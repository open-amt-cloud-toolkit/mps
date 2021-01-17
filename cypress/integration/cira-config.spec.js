//Tests the creation of a cira-config

const loginFixtures = require('../fixtures/constants.json')

describe('Create a CIRA config', () => {
    beforeEach(() => {
      cy.window().then((win) => {
        win.sessionStorage.clear()
      })

      //Go to web page
      cy.visit("https://" + loginFixtures.ip + ":3000/#/login")

      //Login
      cy.get('[data-cy=username-textbox]')
        .type(loginFixtures.username)
      cy.get('[data-cy=password-textbox]')
        .type(loginFixtures.password)
      cy.get('[data-cy=sign-in-button]')
        .click()

      //Enter RPS
      cy.get('[data-cy=rps-button]')
        .click()
    })

    afterEach(() => {
      //Logout
      cy.get('[data-cy=profile-icon-button]')
        .click()
      cy.get('[data-cy=logout-button]')
        .click()
    })

    it('creates a cira config', () => {
        //Navigate to CIRA config menu
        cy.get('[data-cy=cira-configs-button]')
          .click()
        cy.get('[data-cy=new-button]')
          .click()

        //fill out the config
        cy.get('[data-cy=config-name-textbox]')
          .type('test')
        cy.get('[data-cy=ipv4-option]')
          .click()
        cy.get('[data-cy=mps-server-address-textbox]')
          .type(loginFixtures.ip)
        cy.get('[data-cy=port-textbox]')
          .type('4433')
        cy.get('[data-cy=username-textbox]')
          .type(loginFixtures.username)
        cy.get('[data-cy=password-textbox]')
          .type(loginFixtures.password)
        cy.get('[data-cy=common-name-textbox]')
          .type(loginFixtures.ip)
        cy.get('[data-cy=load-button]')
          .click()
        cy.get('[data-cy=create-button]')
          .click()
    })
})