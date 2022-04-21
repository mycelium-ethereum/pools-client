import React from 'react';
import { CommitActionEnum, SideEnum } from '@tracer-protocol/pools-js';
import useUserTokenOverview from '~/hooks/useUserTokenOverview';
import { MarketFilterEnum } from '~/types/filters';
import { ClaimedTokensTable } from './ClaimedTokensTable';
import { OverviewTable } from '../OverviewTable';
import { MarketDropdown, OverviewTableSearch } from '../OverviewTable/Actions';
import { PortfolioAction, PortfolioState } from '../state';

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
    const { rows } = useUserTokenOverview();
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
            secondActionTitle="Denote in"
            secondAction={
                <OverviewTableSearch
                    search={claimedTokensSearch}
                    setSearch={(search) => void dispatch({ type: 'setClaimedTokensSearch', search })}
                />
            }
        >
            <ClaimedTokensTable rows={rows} onClickCommitAction={onClickCommitAction} />
        </OverviewTable>
    );
};

export default ClaimedTokens;
