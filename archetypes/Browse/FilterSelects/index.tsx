import { Input, SearchBar, Select, SelectOption } from '@components/General/Input';
import { FilterState, FilterAction, SORT_MAP } from '@context/FilterContext';
import { SIDE_MAP } from '@libs/constants';
import React from 'react';
import styled from 'styled-components';

export default (({ filterState, filterDispatch }) => {
    return (
        <Filters>
            <StyledSearchBar
                onChange={(e: any) => filterDispatch({ type: 'setSearch', value: e.currentTarget.value })}
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
                options={filterState?.sortOptions}
                filterDispatch={filterDispatch}
                dispatchAction={'setSortBy'}
                keyMap={SORT_MAP}
                title={'Sort'}
                selectedOption={filterState?.sortBy}
            />
        </Filters>
    );
}) as React.FC<{
    filterState: FilterState;
    filterDispatch: React.Dispatch<FilterAction>;
}>;

const Filters = styled.div`
    display: flex;
    margin-bottom: 0.8rem;
`;

const StyledSearchBar = styled(SearchBar)`
    height: 44px;
    margin-top: auto;
    & ${Input} {
        margin-top: auto;
        height: 44px;
    }
`;

const DropdownSelect: React.FC<{
    options: (string | number)[];
    keyMap?: Record<string | number, string>;
    filterDispatch: React.Dispatch<FilterAction>;
    dispatchAction: 'setSide' | 'setLeverage' | 'setSortBy';
    title: string;
    selectedOption: string | number;
}> = ({ options, filterDispatch, dispatchAction, selectedOption, title, keyMap }) => {
    return (
        <DropdownContainer>
            <Label>{title}</Label>
            <Select
                preview={keyMap ? keyMap[selectedOption] : selectedOption}
                onChange={(e: any) =>
                    filterDispatch({ type: dispatchAction, value: e.currentTarget.value } as FilterAction)
                }
            >
                {options.map((option) => (
                    <SelectOption
                        key={`${title}-dropdown-option-${option}`}
                        value={option}
                        selected={selectedOption === option}
                    >
                        {keyMap ? keyMap[option] : option}
                    </SelectOption>
                ))}
            </Select>
        </DropdownContainer>
    );
};

const Label = styled.p`
    // font-family: Inter;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    color: #111928;
`;

const DropdownContainer = styled.div`
    margin: 0 1rem;

    &:last-child {
        margin-left: auto;
        margin-right: 0;
    }

    ${Select} {
        width: 142px;
        height: 44px;
        line-height: 44px;
        padding-left: 1rem;
    }
`;
