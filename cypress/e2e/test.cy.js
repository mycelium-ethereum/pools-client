const MAX_WAIT = 30000;

const port = process.env.NODE_ENV === 'development' ? 3002 : 3000;

describe('Testing Buy page (/)', () => {
    before(() => {
        cy.visit(`http://localhost:${port}`);
    });
    it('Market dropdown should be selectable after page is fully loaded', () => {
        cy.get('.market-dropdown').should('be.visible').click(); // open market selector
        cy.get('.dropdown-options'); // waits to check if market dropdown exists before clicking
        cy.get('.dropdown-options button:first', { timeout: MAX_WAIT }); // wait for markets to load
        cy.get('.dropdown-options button:first').click(); // click first market
    });
});

describe('Testing Trade page (/trade)', () => {
    before(() => {
        cy.visit(`http://localhost:${port}/trade`);
    });
    it('Trade table should be accessible after load', () => {
        cy.get('.trade-btn:first', { timeout: MAX_WAIT }); // waits to check if market dropdown exists
        cy.get('.trade-btn:first').click({ force: true }); // open Trade modal
    });
});
