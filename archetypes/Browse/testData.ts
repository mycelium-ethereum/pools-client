import { BrowseTableRowData } from './state';

const names = ['ETH/USDC', 'ETH/BTC', 'ETH/CAD', 'ETH/AUD'];
const leverages = [1, 2, 3, 4, 5];
const sides = ['short', 'long'];

let dummyPoolData: BrowseTableRowData[] = [];

for (const name of names) {
    for (const leverage of leverages) {
        for (const side of sides) {
            dummyPoolData.push({
                tokenAddress: Math.random().toString(),
                tokenName: name,
                leverage,
                side: side as 'short' | 'long',
                lastPrice: Math.random() * 100,
                change24Hours: Math.random() * 100 - 50,
                APY30Days: Math.random() * 10,
                rebalanceRate: Math.random() * 20,
                totalValueLocked: Math.random() * 10 ** 8,
                myHoldings: Math.random() > 0.5 ? Math.random() * 1000 : 0,
            });
        }
    }
}

export default dummyPoolData;
