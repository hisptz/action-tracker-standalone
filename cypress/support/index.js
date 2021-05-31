// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import { enableNetworkShim } from '@dhis2/cypress-commands';

const LOGIN_ENDPOINT = 'dhis-web-commons-security/login.action';

const login = () => {
    const username = Cypress.env('DHIS2_USERNAME');
    const password = Cypress.env('DHIS2_PASSWORD');
    const loginUrl = Cypress.env('DHIS2_BASE_URL');
    cy.request({
        url: "".concat(loginUrl, "/").concat(LOGIN_ENDPOINT),
        method: 'POST',
        form: true,
        followRedirect: true,
        body: {
            j_username: username,
            j_password: password,
            '2fa_code': ''
        }
    });
};
Cypress.Commands.add('login', login);

const enableAutoLogin = () => {
    before(() => {
        cy.login();
    });
    beforeEach(() => {
        // Persist this across tests so we don't have to login before each test
        Cypress.Cookies.preserveOnce('JSESSIONID'); // This ensures the app platform knows which URL to use even if
        // REACT_APP_DHIS2_BASE_URL is undefined It also ensures that the value
        // from the cypress env is used instead of REACT_APP_DHIS2_BASE_URL

        const loginUrl = Cypress.env('DHIS2_BASE_URL');
        localStorage.setItem('DHIS2_BASE_URL', loginUrl);
    });
};

enableAutoLogin();

// Alternatively you can use CommonJS syntax:
// require('./commands')
enableNetworkShim();
