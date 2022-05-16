import React, { useEffect, useState } from 'react';
import { COLLATERAL_FILTERS } from '~/constants/filters';
import { useStore } from '~/store/main';
import { selectNetwork } from '~/store/Web3Slice';
import { CollateralFilterEnum } from '~/types/filters';
import { Dropdown } from './';

type CollateralFilterProps = {
    collateralFilter: CollateralFilterEnum;
    onSelect: (val: string) => void;
};

// TODO this could be made to fetch pools list and set depending on settlementTokens found
export const CollateralFilter = ({ collateralFilter, onSelect }: CollateralFilterProps): JSX.Element => {
    const network = useStore(selectNetwork);
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
