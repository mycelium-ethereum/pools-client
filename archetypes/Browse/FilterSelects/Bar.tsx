import React, { useEffect, useState } from 'react';
import { Dropdown } from '@components/General';
import { SearchInput } from '@components/General/SearchInput';
import { BrowseAction, BrowseState, LeverageFilterEnum, SideFilterEnum, SortByEnum } from '../state';
import TooltipSelector, { TooltipKeys } from '@components/Tooltips/TooltipSelector';
import useBrowsePools from '@libs/hooks/useBrowsePools';

interface FilterSelectsProps {
    state: BrowseState;
    dispatch: React.Dispatch<BrowseAction>;
}

const FilterSelects: React.FC<FilterSelectsProps> = ({ state, dispatch }) => {
    const [leverageState, setLeverageState] = useState<string | null>();
    const [sideState, setSideState] = useState<string | null>();
    const [sortByState, setSortByState] = useState<string | null>();
    useEffect(() => {
        if (sessionStorage.getItem('setLeverage') !== null) {
            setLeverageState(sessionStorage.getItem('setLeverage'));
            dispatch({ type: 'setLeverage', leverage: leverageState as LeverageFilterEnum });
        }
        if (sessionStorage.getItem('setSide') !== null) {
            setSideState(sessionStorage.getItem('setSide'));
            dispatch({ type: 'setSide', side: sideState as SideFilterEnum });
        }
        if (sessionStorage.getItem('setSortBy') !== null) {
            setSortByState(sessionStorage.getItem('setSortBy'));
            dispatch({ type: 'setSortBy', sortBy: sortByState as SortByEnum });
        }
    }, [useBrowsePools()]);
    return (
        <section className="container px-0">
            <div className="flex w-full mb-2">
                <div className="mr-4 flex-grow flex items-end" style={{ maxWidth: '20rem' }}>
                    <SearchInput
                        placeholder="Search"
                        value={state.search}
                        onChange={(search) => dispatch({ type: 'setSearch', search })}
                    />
                </div>
                <div className="mr-6">
                    <TooltipSelector tooltip={{ key: TooltipKeys.PowerLeverage }}>
                        <h3 className="mb-1">Power Leverage</h3>
                    </TooltipSelector>
                    <Dropdown
                        className="w-full"
                        value={leverageState ?? state.leverage}
                        options={Object.values(LeverageFilterEnum).map((key) => ({ key }))}
                        onSelect={(val) => {
                            sessionStorage.setItem('setLeverage', val);
                            setLeverageState(val);
                            dispatch({ type: 'setLeverage', leverage: val as LeverageFilterEnum });
                        }}
                    />
                </div>
                <div>
                    <h3 className="mb-1 text-theme-text">Side</h3>
                    <Dropdown
                        value={sideState ?? state.side}
                        options={Object.values(SideFilterEnum).map((key) => ({ key }))}
                        onSelect={(val) => {
                            sessionStorage.setItem('setSide', val);
                            setSideState(val);
                            dispatch({ type: 'setSide', side: val as SideFilterEnum });
                        }}
                    />
                </div>
                <div className="flex-grow" />
                <div>
                    <h3 className="mb-1 text-theme-text">Sort</h3>
                    <Dropdown
                        value={sortByState ?? state.sortBy}
                        options={Object.values(SortByEnum).map((key) => ({ key: key }))}
                        onSelect={(val) => {
                            sessionStorage.setItem('setSortBy', val);
                            setSortByState(val);
                            dispatch({ type: 'setSortBy', sortBy: val as SortByEnum });
                        }}
                    />
                </div>
            </div>
        </section>
    );
};

export default FilterSelects;
