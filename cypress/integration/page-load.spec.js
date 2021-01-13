const username = "standalone"
const password = "G@ppm0ym"
const ip = "192.168.50.102"

describe('Basic Functionality', () => {
    beforeEach(() => {
        cy.visit("https://" + ip + ":3000")
    })

    it('loads the login page properly', () => {})

    it('logs in to the default account', () => {
        cy.get('userName')
          .type(username)
        cy.get('password')
          .type(password)
        cy.get('submit')
            .click()
    })

    it('creates a cira config', () => {
        //login
        cy.get('userName')
          .type(username)
        cy.get('password')
          .type(password)
        cy.get('submit')
            .click()

        cy.get('rps-button')
          .click()

        cy.get('cira-button')
          .click()
        cy.get('new-button')
          .click()

        //fill out the config
        cy.get('config-name')
          .type('test')
          .type('{tab}{left}{left}{tab}')
          .type(ip)
          .type('{tab}')
          .type('4433')
          .type('{tab}')
          .type(username)
          .type('{tab}')
          .type(password)
          .type('{tab}')
          .type(ip)
          .type('{tab}{tab}{enter}{tab}{enter}')
    })
})