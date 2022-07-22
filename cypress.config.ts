import { defineConfig } from 'cypress';

export default defineConfig({
    retries: 3,
    viewportWidth: 1920,
    viewportHeight: 1080,
    pageLoadTimeout: 40000,
    e2e: {
        video: false,
        supportFile: './cypress/support/index.js',
        specPattern: './cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    },
});
