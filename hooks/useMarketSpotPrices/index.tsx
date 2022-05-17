import { useMemo, useState } from 'react';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import shallow from 'zustand/shallow';
import { AggregatorV3Interface__factory } from '@tracer-protocol/perpetual-pools-contracts/types';
import { networkConfig } from '~/constants/networks';
import { useStore } from '~/store/main';
import { selectWeb3Info } from '~/store/Web3Slice';

export default (): Record<string, BigNumber> => {
    const [marketSpotPrices, setMarketSpotPrices] = useState<Record<string, BigNumber>>({});
    const { provider, network } = useStore(selectWeb3Info, shallow);

    useMemo(() => {
        let mounted = true;

        const result = {};
        if (provider && network && networkConfig[network]?.knownMarketSpotPriceChainlinkFeeds) {
            const result: Record<string, BigNumber> = {};

            const feeds = networkConfig[network].knownMarketSpotPriceChainlinkFeeds || {};

            const promises = Object.keys(feeds).map(async (marketKey) => {
                const { feedAddress, decimals } = feeds[marketKey];
                const chainlinkAggregator = AggregatorV3Interface__factory.connect(feedAddress, provider);

                const latestRoundData = await chainlinkAggregator.latestRoundData();

                result[marketKey] = new BigNumber(ethers.utils.formatUnits(latestRoundData.answer, decimals));
            });

            Promise.all(promises).then(() => {
                if (mounted) {
                    setMarketSpotPrices(result);
                }
            });
        } else {
            setMarketSpotPrices(result);
        }

        return () => {
            mounted = false;
        };
    }, [network]);

    return marketSpotPrices;
};
