import { Input, Select, SelectOption } from '@components/General/Input';
import { FilterState, FilterAction } from '@context/FilterContext';
import { SIDE_MAP } from '@libs/constants';
import React from 'react';
import styled from 'styled-components';

export default (({ filterState, filterDispatch }) => {
    return (
        <Filters>
            <StyledInput
                onChange={(e) => filterDispatch({ type: 'setSearch', value: e.currentTarget.value })}
                type="text"
            />
            <DropdownSelect
                options={filterState?.leverageOptions}
                filterDispatch={filterDispatch}
                dispatchAction={'setLeverage'}
                title={'Leverage'}
                selectedOption={filterState?.leverage}
            />
            <DropdownSelect
                options={filterState?.sideOptions}
                filterDispatch={filterDispatch}
                dispatchAction={'setSide'}
                title={'Side'}
                selectedOption={filterState?.side === 'All' ? 'All' : SIDE_MAP[filterState?.side]}
            />
            <DropdownSelect
                options={filterState?.settlementOptions}
                filterDispatch={filterDispatch}
                dispatchAction={'setSettlementCurrency'}
                title={'Settlement'}
                selectedOption={filterState?.settlementCurrency}
            />
        </Filters>
    );
}) as React.FC<{
    filterState: FilterState;
    filterDispatch: React.Dispatch<FilterAction>;
}>;

const Filters = styled.div`
    display: flex;
`;

const StyledInput = styled(Input)`
    margin-top: auto;
    background: #fff;
    color: #000;
`;

const DropdownSelect: React.FC<{
    options: string[];
    filterDispatch: React.Dispatch<FilterAction>;
    dispatchAction: 'setSide' | 'setLeverage' | 'setSettlementCurrency';
    title: string;
    selectedOption: string;
}> = ({ options, filterDispatch, dispatchAction, selectedOption, title }) => {
    return (
        <DropdownContainer>
            <Label>{title}</Label>
            <Select
                onChange={(e) => filterDispatch({ type: dispatchAction, value: e.currentTarget.value } as FilterAction)}
            >
                {options.map((option) => (
                    <SelectOption
                        key={`${title}-dropdown-option-${option}`}
                        value={option}
                        selected={selectedOption === option}
                    >
                        {option}
                    </SelectOption>
                ))}
            </Select>
        </DropdownContainer>
    );
};

const Label = styled.p`
    color: #fff;
`;

const DropdownContainer = styled.div`
    margin: 0 1rem;
    ${Select} {
        width: 100%;
    }
`;
