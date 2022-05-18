import React from 'react';
import BaseFilters from '~/components/BaseFilters';
import { Dropdown, LogoTicker } from '~/components/General';
import { TooltipKeys } from '~/components/Tooltips/TooltipSelector';
import { useStore } from '~/store/main';
import { selectNetwork } from '~/store/Web3Slice';
import { MarketFilterEnum } from '~/types/filters';
import { SearchInput } from './styles';
import { CommitTypeFilter, DenotedInEnum, PortfolioAction, PortfolioState } from '../state';

enum PriceByEnum {
    Tracer = 'Tracer',
    Balancer = 'Balancer',
}

type TableProps = {
    state: PortfolioState;
    dispatch: React.Dispatch<PortfolioAction>;
};

export const PriceByDropDown = (): JSX.Element => {
    return (
        <Dropdown
            size="sm"
            value="Tracer"
            options={[
                { key: PriceByEnum.Tracer },
                {
                    key: PriceByEnum.Balancer,
                    disabled: true,
                    tooltip: { key: TooltipKeys.ComingSoon },
                },
            ]}
            onSelect={(val) => {
                console.debug(val);
            }}
        />
    );
};

const COMMIT_TYPE_OPTIONS = Object.keys(CommitTypeFilter).map((key) => ({
    key: (CommitTypeFilter as any)[key],
}));

export const CommitTypeDropdown = ({
    selected,
    setCommitTypeFilter,
}: {
    selected: CommitTypeFilter;
    setCommitTypeFilter: (v: string) => void;
}): JSX.Element => {
    return <Dropdown size="sm" value={selected} options={COMMIT_TYPE_OPTIONS} onSelect={setCommitTypeFilter} />;
};

export const DenoteInDropDown = ({ state }: TableProps): JSX.Element => {
    return (
        <Dropdown
            size="sm"
            iconSize="xs"
            placeHolderIcon={state.positionsDenotedIn as LogoTicker}
            value={state.positionsDenotedIn}
            // TODO: Switch out options when denote in BASE is available
            // options={Object.keys(DenotedInEnum).map((key) => ({
            //     key: key,
            //     ticker: key as LogoTicker,
            // }))}
            options={[
                { key: DenotedInEnum.USD, ticker: DenotedInEnum.USD },
                {
                    key: DenotedInEnum.BASE,
                    ticker: DenotedInEnum.BASE,
                    disabled: true,
                    tooltip: { key: TooltipKeys.ComingSoon },
                },
            ]}
            onSelect={(val) => {
                console.debug(val);
                // dispatch({ type: 'setDenotation', denotedIn: val as DenotedInEnum });
            }}
        />
    );
};

export const MarketDropdown = ({
    market,
    setMarket,
}: {
    market: MarketFilterEnum;
    setMarket: (market: string) => void;
}): JSX.Element => {
    const network = useStore(selectNetwork);
    return (
        <BaseFilters.MarketFilter
            size="sm"
            marketFilter={market}
            className="mt-auto w-32"
            network={network}
            onMarketSelect={setMarket}
        />
    );
};

export const OverviewTableSearch = ({
    search,
    setSearch,
}: {
    search: string;
    setSearch: (v: string) => void;
}): JSX.Element => {
    return <SearchInput placeholder="Search" value={search} onChange={setSearch} />;
};
