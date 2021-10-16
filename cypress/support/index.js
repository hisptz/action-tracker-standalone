import './commands'
import { enableNetworkShim, enableAutoLogin } from '@dhis2/cypress-commands';

Cypress.on('uncaught:exception', (err, runnable) => {
    return false
})

enableAutoLogin();
enableNetworkShim();
