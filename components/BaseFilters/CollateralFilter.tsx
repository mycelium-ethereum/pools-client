import React, { useEffect, useState } from 'react';
import { COLLATERAL_FILTERS } from '~/constants/filters';
import { CollateralFilterEnum } from '~/types/filters';
import { CollateralFilterProps } from './types';
import { Dropdown } from './';

// TODO this could be made to fetch pools list and set depending on settlementTokens found
export const CollateralFilter = ({ collateralFilter, onSelect, network }: CollateralFilterProps): JSX.Element => {
    const [options, setOptions] = useState<{ key: CollateralFilterEnum }[]>([]);

    useEffect(() => {
        if (network) {
            const options_ = COLLATERAL_FILTERS[network];
            if (options_) {
                setOptions(options_.map((v) => ({ key: v })));
            } else {
                setOptions([]);
            }
        } else {
            setOptions([]);
        }
    }, [network]);

    return <Dropdown value={collateralFilter ?? 'All'} options={options} onSelect={onSelect} />;
};

export default CollateralFilter;
