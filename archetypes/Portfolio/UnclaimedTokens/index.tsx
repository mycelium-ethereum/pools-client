import React from 'react';
import { CommitActionEnum, SideEnum } from '@tracer-protocol/pools-js';
import useEscrowHoldings from '~/hooks/useEscrowHoldings';
import { MarketFilterEnum } from '~/types/filters';
import { marketFilter } from '~/utils/filters';
import { EscrowTable } from './EscrowTable';
import { OverviewTable } from '../OverviewTable';
import { MarketDropdown, OverviewTableSearch } from '../OverviewTable/Actions';
import { EscrowRowProps, PortfolioAction, PortfolioState } from '../state';

export const UnclaimedTokens = ({
    escrowMarketFilter,
    escrowSearch,
    dispatch,
    onClickCommitAction,
}: {
    escrowMarketFilter: PortfolioState['escrowMarketFilter'];
    escrowSearch: PortfolioState['escrowSearch'];
    dispatch: React.Dispatch<PortfolioAction>;
    onClickCommitAction: (pool: string, side: SideEnum, action?: CommitActionEnum) => void;
}): JSX.Element => {
    const escrowRows = useEscrowHoldings();

    const escrowSearchFilter = (pool: EscrowRowProps): boolean => {
        const searchString = escrowSearch.toLowerCase();
        return Boolean(pool.poolName.toLowerCase().match(searchString));
    };

    const filteredEscrowRows = escrowRows
        .filter((pool: EscrowRowProps) => marketFilter(pool.poolName, escrowMarketFilter))
        .filter(escrowSearchFilter);

    return (
        <OverviewTable
            title="Unclaimed Tokens"
            subTitle="Your tokens, held with the Pool. Available to claim to a wallet at any time."
            firstActionTitle="Market"
            firstAction={
                <MarketDropdown
                    market={escrowMarketFilter}
                    setMarket={(m) => void dispatch({ type: 'setEscrowMarketFilter', market: m as MarketFilterEnum })}
                />
            }
            secondAction={
                <OverviewTableSearch
                    search={escrowSearch}
                    setSearch={(search) => void dispatch({ type: 'setEscrowSearch', search })}
                />
            }
        >
            <EscrowTable rows={filteredEscrowRows} onClickCommitAction={onClickCommitAction} />
        </OverviewTable>
    );
};

export default UnclaimedTokens;
