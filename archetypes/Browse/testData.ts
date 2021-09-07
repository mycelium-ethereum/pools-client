import { BrowseTableRowData } from './state';

const names = ['ETH/USDC', 'ETH/BTC', 'ETH/CAD', 'ETH/AUD'];
const leverages = [1, 3];
const sides = ['short', 'long'];

let dummyPoolData: BrowseTableRowData[] = [];

for (const name of names) {
    for (const leverage of leverages) {
        for (const side of sides) {
            dummyPoolData.push({
                address: Math.random().toString(),
                symbol: name,
                leverage,
                side: side as 'short' | 'long',
                lastPrice: Math.random() * 100,
                change24Hours: Math.random() * 100 - 50,
                rebalanceRate: Math.random() * 20,
                totalValueLocked: Math.random() * 10 ** 8,
                myHoldings: Math.random() > 0.5 ? Math.random() * 1000 : 0,
            });
        }
    }
}

export default dummyPoolData;
