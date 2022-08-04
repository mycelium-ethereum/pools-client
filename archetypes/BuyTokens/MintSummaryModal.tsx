import React, { useContext, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js';
import styled from 'styled-components';
import { CommitActionEnum, CommitEnum, PoolToken, SideEnum } from '@tracer-protocol/pools-js';
import MintButton from '~/archetypes/BuyTokens/MintButton';
import Summary from '~/archetypes/Exchange/Summary';
import { TWModal } from '~/components/General/TWModal';
import { CommitActionSideMap } from '~/constants/commits';
import { AnalyticsContext } from '~/context/AnalyticsContext';
import { useBigNumber, SwapState } from '~/context/SwapContext';
import useBalancerETHPrice from '~/hooks/useBalancerETHPrice';
import useExpectedCommitExecution from '~/hooks/useExpectedCommitExecution';
import { useGasPrice } from '~/hooks/useGasPrice';
import { usePool } from '~/hooks/usePool';
import { usePoolInstanceActions } from '~/hooks/usePoolInstanceActions';
import usePools from '~/hooks/usePools';
import CloseIcon from '~/public/img/general/close.svg';
import { AggregateBalances, TokenBalance, TradeStats } from '~/types/pools';
import { formatBN } from '~/utils/converters';

const DEFAULT_GAS_FEE = new BigNumber(0);

type MSModalProps = {
    isOpen: boolean;
    amount: string;
    selectedPool: string | undefined;
    side: SideEnum;
    commitAction: CommitActionEnum;
    commitType: CommitEnum;
    invalidAmount: {
        message?: string | undefined;
        isInvalid: boolean;
    };
    swapState: SwapState;
    swapDispatch: any;
    userBalances: {
        shortToken: TokenBalance;
        longToken: TokenBalance;
        settlementToken: TokenBalance;
        aggregateBalances: AggregateBalances;
        tradeStats: TradeStats;
    };
    token: PoolToken;
    isLong: boolean;
    onClose: () => void;
    isSummaryOpen: boolean;
};

const MintSummaryModal: React.FC<MSModalProps> = ({
    amount,
    selectedPool,
    side,
    commitAction,
    invalidAmount,
    swapState,
    swapDispatch,
    userBalances,
    token,
    isLong,
    onClose,
    isSummaryOpen,
}) => {
    const { pools } = usePools();
    const { commit, approve } = usePoolInstanceActions();
    const { trackBuyAction } = useContext(AnalyticsContext);
    const { commitGasFee } = usePoolInstanceActions();
    const [commitGasFees, setCommitGasFees] = useState<Partial<Record<CommitActionEnum, BigNumber>>>({});
    const gasPrice = useGasPrice();
    const ethPrice = useBalancerETHPrice();

    const { nextPoolState } = pools[selectedPool as string] || {};
    const { expectedLongTokenPrice, expectedShortTokenPrice } = nextPoolState || {};
    const tokenPrice = useMemo(
        () => (isLong ? expectedLongTokenPrice : expectedShortTokenPrice),
        [isLong, nextPoolState],
    );

    const amountBN = useBigNumber(amount);
    const commitType = CommitActionSideMap[commitAction][side];

    const { poolInstance: pool } = usePool(selectedPool);

    const receiveIn = useExpectedCommitExecution(pool.lastUpdate, pool.updateInterval, pool.frontRunningInterval);

    useMemo(async () => {
        if (commitGasFee) {
            const fee: BigNumber | undefined = await commitGasFee(
                selectedPool ?? '',
                commitType,
                swapState.balanceType,
                amountBN,
            ).catch((_err) => undefined);
            if (fee) {
                const gasPriceInEth = formatBN(new BigNumber(gasPrice ?? 0), 9);
                const costInEth = fee.times(gasPriceInEth);
                setCommitGasFees({
                    ...commitGasFees,
                    [commitAction]: ethPrice.times(costInEth),
                });
            }
        }
    }, [selectedPool, commitType, amountBN, ethPrice, gasPrice]);

    return (
        <TWModal open={isSummaryOpen} onClose={onClose}>
            <Close onClick={onClose} className="close" />
            <Title>Mint Summary</Title>
            <Summary
                pool={pool}
                showBreakdown={!invalidAmount.isInvalid}
                isLong={isLong}
                amount={amountBN}
                receiveIn={receiveIn}
                commitAction={commitAction}
                gasFee={commitGasFees[commitAction] ?? DEFAULT_GAS_FEE}
                showTokenImage
            />
            <MintButton
                swapState={swapState}
                swapDispatch={swapDispatch}
                userBalances={userBalances}
                approve={approve}
                pool={pool}
                amountBN={amountBN}
                commit={commit}
                commitType={commitType}
                token={token}
                trackBuyAction={trackBuyAction}
                handleModalClose={onClose}
                tokenPrice={tokenPrice}
            />
        </TWModal>
    );
};

export default MintSummaryModal;

const Title = styled.h2`
    font-weight: 600;
    font-size: 20px;
    color: ${({ theme }) => theme.fontColor.primary};
    margin-bottom: 15px;

    @media (min-width: 640px) {
        margin-bottom: 20px;
    }
`;

const Close = styled(CloseIcon)`
    position: absolute;
    right: 1rem;
    top: 1.5rem;
    width: 0.75rem;
    height: 0.75rem;
    cursor: pointer;

    @media (min-width: 640px) {
        right: 2.5rem;
        top: 3rem;
        width: 1rem;
        height: 1rem;
    }
`;
