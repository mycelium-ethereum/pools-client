const addContext = require('mochawesome/addContext');

Cypress.on('test:after:run', (test, runnable) => {
    if (test.state === 'failed') {
        const screenshotFileName = `${runnable.parent.title} -- ${test.title} (failed).png`;
        addContext({ test }, `assets/${Cypress.spec.name}/${screenshotFileName}`);
    }
});
