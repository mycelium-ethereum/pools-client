import React from 'react';
import { Dropdown, LogoTicker } from '~/components/General';
import { TooltipKeys } from '~/components/Tooltips/TooltipSelector';
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

const MARKET_DROPDOWN_OPTIONS = Object.keys(MarketFilterEnum).map((key) => ({
    key: (MarketFilterEnum as any)[key],
    ticker: (key !== 'All' ? key : '') as LogoTicker,
}));
export const MarketDropdown = ({
    market,
    setMarket,
}: {
    market: MarketFilterEnum;
    setMarket: (market: string) => void;
}): JSX.Element => {
    return (
        <Dropdown
            size="sm"
            value={market}
            className="mt-auto w-32"
            options={MARKET_DROPDOWN_OPTIONS}
            onSelect={setMarket}
        />
    );
};

export const EscrowSearch = ({ state, dispatch }: TableProps): JSX.Element => {
    return (
        <SearchInput
            placeholder="Search"
            value={state.escrowSearch}
            onChange={(search: string) => dispatch({ type: 'setEscrowSearch', search })}
        />
    );
};

export const QueuedCommitsSearch = ({
    commitsSearch,
    setCommitsSearch,
}: {
    commitsSearch: string;
    setCommitsSearch: (v: string) => void;
}): JSX.Element => {
    return <SearchInput placeholder="Search" value={commitsSearch} onChange={setCommitsSearch} />;
};
