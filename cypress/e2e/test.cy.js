const MAX_WAIT = 15000;

describe('Testing Buy page (/)', () => {
    before(() => {
        cy.visit('http://localhost:3002');
    });
    it('Market dropdown should be selectable after page is fully loaded', () => {
        cy.get('.market-dropdown').get('div:first'), { timeout: MAX_WAIT }; // waits to check if market dropdown exists
        cy.get('.market-dropdown').should('be.visible').click(); // open market selector
        cy.get('.market-dropdown').get('div:first').get('button:first').click(); // select first market
    });
});

describe('Testing Trade page (/trade)', () => {
    before(() => {
        cy.visit('http://localhost:3002/trade');
    });
    it('Trade table should be accessible after load', () => {
        cy.get('.trade-btn:first'), { timeout: MAX_WAIT }; // waits to check if market dropdown exists
        cy.get('.trade-btn:first').click({ force: true }); // open Trade modal
    });
});
