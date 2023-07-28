const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const addCucumberPreprocessorPlugin =
    require("@badeball/cypress-cucumber-preprocessor").addCucumberPreprocessorPlugin;

const createEsbuildPlugin =
    require("@badeball/cypress-cucumber-preprocessor/esbuild").createEsbuildPlugin;

const {
    networkShim,
    chromeAllowXSiteCookies,
} = require("@dhis2/cypress-plugins");

const networkShimOptions = {
    staticResources: [
        "/system/info"
    ]
};


module.exports = defineConfig({
    chromeWebSecurity: false,
    reporter: "cypress-multi-reporters",
    video: false,
    projectId: "demzvf",
    experimentalStudio: true,
    viewportWidth: 1366,
    viewportHeight: 768,
    defaultCommandTimeout: 30000,
    env: {
        dhis2DataTestPrefix: "dhis2-actiontrackerstandalone",
        networkMode: "live",
        dhis2ApiVersion: "36",
        dhis2BaseUrl: "http://localhost:8081",
        dhis2Username: "admin",
        dhis2Password: "district"
    },
    experimentalInteractiveRunEvents: true,
    e2e: {
        env: {
            dhis2DataTestPrefix: "dhis2-actiontrackerstandalone",
            networkMode: "live",
            dhis2ApiVersion: "36",
            dhis2BaseUrl: "http://localhost:8081",
            dhis2Username: "admin",
            dhis2Password: "district"
        },
        // We've imported your old cypress plugins here.
        // You may want to clean this up later by importing these.
        async setupNodeEvents(on, config) {
            networkShim(on, networkShimOptions);
            chromeAllowXSiteCookies(on, config);
            const bundler = createBundler({
                plugins: [
                    createEsbuildPlugin(config)
                ]
            });
            on("file:preprocessor", bundler);
            await addCucumberPreprocessorPlugin(on, config);
            return config;
        },
        baseUrl: "http://localhost:3000",
        specPattern: "cypress/e2e/**/*.feature",
    },
});
