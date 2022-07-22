const MAX_WAIT = 30000;

describe('Testing Buy page (/)', () => {
    before(() => {
        cy.visit('http://localhost:3002');
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
        cy.visit('http://localhost:3002/trade');
    });
    it('Trade table should be accessible after load', () => {
        cy.get('.trade-btn:first', { timeout: MAX_WAIT }); // waits to check if market dropdown exists
        cy.get('.trade-btn:first').click({ force: true }); // open Trade modal
    });
});
