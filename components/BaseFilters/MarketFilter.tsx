import React, { useEffect, useState } from 'react';
import { MARKET_FILTERS } from '~/constants/filters';
import { useStore } from '~/store/main';
import { selectNetwork } from '~/store/Web3Slice';
import { MarketFilterEnum } from '~/types/filters';
import { LogoTicker } from '../General';
import { Dropdown } from './';

const findTicker = (v: MarketFilterEnum): string => {
    if (v === 'All') {
        return '';
    }
    const i = Object.values(MarketFilterEnum).indexOf(v);
    return Object.keys(MarketFilterEnum)[i] ?? '';
};

type MarketFilterProps = {
    marketFilter: MarketFilterEnum;
    onMarketSelect: (val: string) => void;
};

export const MarketFilter = ({ marketFilter, onMarketSelect }: MarketFilterProps): JSX.Element => {
    const network = useStore(selectNetwork);
    const [options, setOptions] = useState<{ key: MarketFilterEnum; ticker: LogoTicker }[]>([]);

    useEffect(() => {
        if (network) {
            const options_ = MARKET_FILTERS[network];
            if (options_) {
                setOptions(options_.map((v) => ({ key: v, ticker: findTicker(v) as LogoTicker })));
            } else {
                setOptions([]);
            }
        } else {
            setOptions([]);
        }
    }, [network]);
    return (
        <Dropdown
            variant="default"
            iconSize="xs"
            placeHolderIcon={
                Object.entries(MarketFilterEnum).find(([_key, val]) => val === marketFilter)?.[0] as LogoTicker
            }
            value={marketFilter}
            options={options}
            onSelect={onMarketSelect}
        />
    );
};

export default MarketFilter;
