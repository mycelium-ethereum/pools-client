import React, { useMemo } from 'react';
import { CommitActionEnum, SideEnum } from '@tracer-protocol/pools-js';
import useUserClaimedTokens from '~/hooks/useUserClaimedTokens';
import { MarketFilterEnum } from '~/types/filters';
import { generalMarketFilter } from '~/utils/filters';
import { ClaimedTokensTable } from './ClaimedTokensTable';
import { OverviewTable } from '../OverviewTable';
import { MarketDropdown, OverviewTableSearch } from '../OverviewTable/Actions';
import { PortfolioAction, PortfolioState, TokenRowProps } from '../state';

export const ClaimedTokens = ({
    claimedTokensMarketFilter,
    claimedTokensSearch,
    dispatch,
    onClickCommitAction,
}: {
    claimedTokensMarketFilter: PortfolioState['claimedTokensMarketFilter'];
    claimedTokensSearch: PortfolioState['claimedTokensSearch'];
    dispatch: React.Dispatch<PortfolioAction>;
    onClickCommitAction: (pool: string, side: SideEnum, action?: CommitActionEnum) => void;
}): JSX.Element => {
    const { rows: tokens, isLoading } = useUserClaimedTokens();

    const claimedSearchFilter = (token: TokenRowProps): boolean => {
        const searchString = claimedTokensSearch.toLowerCase();
        return Boolean(token.name.toLowerCase().match(searchString));
    };

    const filteredTokens = useMemo(
        () =>
            tokens
                .filter((token) => generalMarketFilter(token.name, claimedTokensMarketFilter))
                .filter(claimedSearchFilter),
        [tokens, claimedTokensMarketFilter, claimedTokensSearch],
    );

    return (
        <OverviewTable
            title="Claimed Tokens"
            subTitle="Pools tokens in your wallet."
            firstActionTitle="Markets"
            firstAction={
                <MarketDropdown
                    market={claimedTokensMarketFilter}
                    setMarket={(m) =>
                        void dispatch({ type: 'setClaimedTokensMarketFilter', market: m as MarketFilterEnum })
                    }
                />
            }
            secondAction={
                <OverviewTableSearch
                    search={claimedTokensSearch}
                    setSearch={(search) => void dispatch({ type: 'setClaimedTokensSearch', search })}
                />
            }
            isLoading={isLoading}
            rowCount={tokens.length}
        >
            <ClaimedTokensTable rows={filteredTokens} onClickCommitAction={onClickCommitAction} />
        </OverviewTable>
    );
};

export default ClaimedTokens;
