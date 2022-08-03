import { defineConfig } from 'cypress';

export default defineConfig({
    retries: {
        runMode: 2,
        openMode: 0,
    },
    viewportWidth: 1920,
    viewportHeight: 1080,
    pageLoadTimeout: 40000,
    e2e: {
        baseUrl: 'http://localhost:3002',
        video: false,
        screenshotOnRunFailure: false,
        supportFile: './cypress/support/index.js',
        specPattern: './cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    },
});
