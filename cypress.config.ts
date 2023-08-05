import { defineConfig } from 'cypress'
import { chromeAllowXSiteCookies, cucumberPreprocessor, networkShim, } from '@dhis2/cypress-plugins'

async function setupNodeEvents (on: any, config: any) {
  chromeAllowXSiteCookies(on, config)
  await cucumberPreprocessor(on, config)
  networkShim(on, config)
  return config
}

export default defineConfig({
  e2e: {
    projectId: '',
    defaultCommandTimeout: 30000,
    setupNodeEvents,
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.feature',
    env: {
      dhis2DataTestPrefix: 'd2-sat',
      networkMode: 'live',
      dhis2ApiVersion: '40',
    },
    experimentalInteractiveRunEvents: true,
    experimentalStudio: true
  },
})
