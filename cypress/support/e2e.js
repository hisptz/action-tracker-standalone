import './commands'
import {enableNetworkShim} from '@dhis2/cypress-commands';

Cypress.on('uncaught:exception', (err, runnable) => {
    return false
})

function enableAutoLogin() {
    const baseUrl = Cypress.env('dhis2BaseUrl')
    const username = Cypress.env('dhis2Username')
    const password = Cypress.env('dhis2Password')

    before(() => {
        localStorage.setItem('DHIS2_BASE_URL', baseUrl);
        Cypress.Cookies.debug(true)
    })

}


// enableAutoLogin();
enableNetworkShim();
