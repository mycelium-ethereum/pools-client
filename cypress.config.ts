import { defineConfig } from 'cypress';

export default defineConfig({
    retries: 2,
    viewportWidth: 1920,
    viewportHeight: 1080,
    pageLoadTimeout: 20000,
    e2e: {
        video: false,
        supportFile: './cypress/support/index.js',
        specPattern: './cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },
});
