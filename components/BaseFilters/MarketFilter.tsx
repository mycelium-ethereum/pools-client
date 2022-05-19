import React, { useEffect, useState } from 'react';
import { MARKET_FILTERS } from '~/constants/filters';
import { MarketFilterEnum } from '~/types/filters';
import { MarketFilterProps } from './types';
import { LogoTicker } from '../General';
import { Dropdown } from './';

const findTicker = (v: MarketFilterEnum): string => {
    if (v === 'All') {
        return '';
    }
    const i = Object.values(MarketFilterEnum).indexOf(v);
    return Object.keys(MarketFilterEnum)[i] ?? '';
};

export const MarketFilter = ({
    marketFilter,
    onMarketSelect,
    network,
    size,
    className,
}: MarketFilterProps): JSX.Element => {
    const [options, setOptions] = useState<{ key: MarketFilterEnum; ticker: LogoTicker }[]>([]);

    useEffect(() => {
        if (network) {
            const options_ = MARKET_FILTERS[network];
            if (options_) {
                setOptions(options_.map((v) => ({ key: v, ticker: findTicker(v) as LogoTicker })));
            } else {
                setOptions([]);
            }
            onMarketSelect(MarketFilterEnum.All);
        } else {
            setOptions([]);
            onMarketSelect(MarketFilterEnum.All);
        }
    }, [network]);

    return (
        <Dropdown
            className={className}
            size={size}
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
