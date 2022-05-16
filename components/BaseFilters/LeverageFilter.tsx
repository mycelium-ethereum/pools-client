import React, { useEffect, useState } from 'react';
import { LEVERAGE_FILTERS } from '~/constants/filters';
import { useStore } from '~/store/main';
import { selectNetwork } from '~/store/Web3Slice';
import { LeverageFilterEnum } from '~/types/filters';
import { Dropdown } from './';

type LeverageFilterProps = {
    leverageFilter: LeverageFilterEnum;
    onSelect: (val: string) => void;
};

// TODO this could be made to fetch pools list and set depending on settlementTokens found
export const LeverageFilter = ({ leverageFilter, onSelect }: LeverageFilterProps): JSX.Element => {
    const network = useStore(selectNetwork);
    const [options, setOptions] = useState<{ key: LeverageFilterEnum }[]>([]);

    useEffect(() => {
        if (network) {
            const options_ = LEVERAGE_FILTERS[network];
            if (options_) {
                setOptions(options_.map((v) => ({ key: v })));
            } else {
                setOptions([]);
            }
        } else {
            setOptions([]);
        }
    }, [network]);

    return <Dropdown value={leverageFilter ?? 'All'} options={options} onSelect={onSelect} />;
};

export default LeverageFilter;
