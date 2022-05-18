import React, { useMemo } from 'react';
import useUserUnclaimedTokens from '~/hooks/useUserUnclaimedTokens';
import { useStore } from '~/store/main';
import { selectNetwork } from '~/store/Web3Slice';
import { MarketFilterEnum } from '~/types/filters';
import { marketFilter } from '~/utils/filters';
import { escapeRegExp } from '~/utils/helpers';
import { UnclaimedTokensTable } from './UnclaimedTokensTable';
import { OverviewTable } from '../OverviewTable';
import { MarketDropdown, OverviewTableSearch } from '../OverviewTable/Actions';
import { OnClickCommit, PortfolioAction, PortfolioState, UnclaimedRowInfo } from '../state';

export const UnclaimedTokens = ({
    escrowMarketFilter,
    escrowSearch,
    dispatch,
    onClickCommitAction,
}: {
    escrowMarketFilter: PortfolioState['escrowMarketFilter'];
    escrowSearch: PortfolioState['escrowSearch'];
    dispatch: React.Dispatch<PortfolioAction>;
    onClickCommitAction: OnClickCommit;
}): JSX.Element => {
    const network = useStore(selectNetwork);
    const { rows: escrowRows, isLoading } = useUserUnclaimedTokens();
    const totalClaimable = useMemo(
        () => escrowRows.reduce((count, pool) => count + pool.numClaimable, 0),
        [escrowRows],
    );

    const escrowSearchFilter = (pool: UnclaimedRowInfo): boolean => {
        const searchString = escapeRegExp(escrowSearch.toLowerCase());
        return Boolean(pool.poolName.toLowerCase().match(searchString));
    };

    const filteredTokenRows = escrowRows
        .filter((pool: UnclaimedRowInfo) => marketFilter(pool.poolName, escrowMarketFilter))
        .filter(escrowSearchFilter);

    return (
        <OverviewTable
            title="Unclaimed Tokens"
            subTitle="Your tokens, held with the Pool. Available to claim to a wallet at any time."
            firstActionTitle="Markets"
            firstAction={
                <MarketDropdown
                    market={escrowMarketFilter}
                    setMarket={(m) => void dispatch({ type: 'setEscrowMarketFilter', market: m as MarketFilterEnum })}
                    network={network}
                />
            }
            secondAction={
                <OverviewTableSearch
                    search={escrowSearch}
                    setSearch={(search) => void dispatch({ type: 'setEscrowSearch', search })}
                />
            }
            isLoading={isLoading}
            rowCount={totalClaimable}
        >
            <UnclaimedTokensTable rows={filteredTokenRows} onClickCommitAction={onClickCommitAction} />
        </OverviewTable>
    );
};

export default UnclaimedTokens;
