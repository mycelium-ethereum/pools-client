export const query: (props: { pool?: string; account?: string }) => string = ({ pool, account }) => `{
    commits (where: { 
        isExecuted: false
        ${!!pool ? `pool: "${pool.toLowerCase()}",` : ''}
        ${!!account ? `trader: "${account.toLowerCase()}",` : ''}
    }) {
        id
        type
        txnHash
        amount
        pool
        created
        trader
        updateIntervalId
      }
}`;
