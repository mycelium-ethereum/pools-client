import React, { useMemo } from 'react';
import useUserClaimedTokens from '~/hooks/useUserClaimedTokens';
import { ClaimedRowActions, ClaimedTokenRowProps } from '~/types/claimedTokens';
import { MarketFilterEnum } from '~/types/filters';
import { generalMarketFilter } from '~/utils/filters';
import { escapeRegExp } from '~/utils/helpers';
import { ClaimedTokensTable } from './ClaimedTokensTable';
import { OverviewTable } from '../OverviewTable';
import { MarketDropdown, OverviewTableSearch } from '../OverviewTable/Actions';
import { PortfolioAction, PortfolioState } from '../state';

export const ClaimedTokens = ({
    claimedTokensMarketFilter,
    claimedTokensSearch,
    dispatch,
    onClickCommitAction,
    onClickStake,
}: {
    claimedTokensMarketFilter: PortfolioState['claimedTokensMarketFilter'];
    claimedTokensSearch: PortfolioState['claimedTokensSearch'];
    dispatch: React.Dispatch<PortfolioAction>;
} & ClaimedRowActions): JSX.Element => {
    const { rows: tokens, isLoading } = useUserClaimedTokens();

    const claimedSearchFilter = (token: ClaimedTokenRowProps): boolean => {
        const searchString = escapeRegExp(claimedTokensSearch.toLowerCase());
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
            title="V2 Tokens in Your Wallet"
            subTitle="Burn Pool Tokens from here"
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
            <ClaimedTokensTable
                rows={filteredTokens}
                onClickCommitAction={onClickCommitAction}
                onClickStake={onClickStake}
            />
        </OverviewTable>
    );
};

export default ClaimedTokens;
