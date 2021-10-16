const {
    networkShim,
    chromeAllowXSiteCookies,
    cucumberPreprocessor
} = require('@dhis2/cypress-plugins');

const cucumber = require('cypress-cucumber-preprocessor').default

/**
 * @type {Cypress.PluginConfig}
 */

const networkShimOptions = {
    staticResources: [
        '/system/info'
    ]
}
module.exports = (on, config) => {
    networkShim(on, networkShimOptions);
    chromeAllowXSiteCookies(on, config);
    cucumberPreprocessor(on, config);
    on('file:preprocessor', cucumber())
}


