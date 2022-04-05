import React from 'react';
import { Dropdown, LogoTicker } from '~/components/General';
import { TooltipKeys } from '~/components/Tooltips/TooltipSelector';
import { MarketFilterEnum } from '~/types/filters';
import { SearchInput } from './styles';
import { DenotedInEnum, PortfolioAction, PortfolioState } from '../state';

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

export const MarketDropdown = ({ state, dispatch }: TableProps): JSX.Element => {
    return (
        <Dropdown
            size="sm"
            value={state.escrowMarketFilter}
            className="mt-auto w-32"
            options={Object.keys(MarketFilterEnum).map((key) => ({
                key: (MarketFilterEnum as any)[key],
                ticker: (key !== 'All' ? key : '') as LogoTicker,
            }))}
            onSelect={(val) => dispatch({ type: 'setEscrowMarketFilter', market: val as MarketFilterEnum })}
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
