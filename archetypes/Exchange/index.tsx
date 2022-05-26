import React, { useContext, useState, useMemo } from 'react';
import BigNumber from 'bignumber.js';
import styled from 'styled-components';
import { CommitActionEnum, SideEnum } from '@tracer-protocol/pools-js';
import ExchangeButton from '~/components/General/Button/ExchangeButton';
import Divider from '~/components/General/Divider';
import TWButtonGroup from '~/components/General/TWButtonGroup';
import { NetworkHintContainer, NetworkHint } from '~/components/NetworkHint';
import { TooltipKeys } from '~/components/Tooltips/TooltipSelector';
import { CommitActionSideMap } from '~/constants/commits';
import { noDispatch, SwapContext, swapDefaults, useBigNumber } from '~/context/SwapContext';
import useBalancerETHPrice from '~/hooks/useBalancerETHPrice';
import useExpectedCommitExecution from '~/hooks/useExpectedCommitExecution';
import { useGasPrice } from '~/hooks/useGasPrice';
import { usePool } from '~/hooks/usePool';
import { usePoolInstanceActions } from '~/hooks/usePoolInstanceActions';
import CloseIcon from '~/public/img/general/close.svg';
import { useStore } from '~/store/main';
import { selectAccount, selectHandleConnect } from '~/store/Web3Slice';

import { PoolStatus } from '~/types/pools';
import { formatBN } from '~/utils/converters';
import Gas from './Gas';
import Inputs from './Inputs';
import Summary from './Summary';

const getTradeOptions = (poolStatus: PoolStatus) => [
    {
        key: CommitActionEnum.mint,
        text: 'Mint',
        disabled:
            poolStatus === PoolStatus.Deprecated
                ? {
                      optionKey: TooltipKeys.DeprecatedPoolMintCommit,
                  }
                : undefined,
    },
    {
        key: CommitActionEnum.burn,
        text: 'Burn',
    },
    {
        key: CommitActionEnum.flip,
        text: 'Flip',
        disabled:
            poolStatus === PoolStatus.Deprecated
                ? {
                      optionKey: TooltipKeys.DeprecatedPoolFlipCommit,
                  }
                : undefined,
    },
];

const DEFAULT_GAS_FEE = new BigNumber(0);

export default styled((({ onClose, className }) => {
    const account = useStore(selectAccount);
    const handleConnect = useStore(selectHandleConnect);
    const gasPrice = useGasPrice();

    const { swapState = swapDefaults, swapDispatch = noDispatch } = useContext(SwapContext);
    const { selectedPool, amount, commitAction, side, invalidAmount } = swapState || {};
    const { poolInstance: pool, userBalances } = usePool(selectedPool);
    const { commit, approve, commitGasFee } = usePoolInstanceActions();

    const ethPrice = useBalancerETHPrice();

    const [commitGasFees, setCommitGasFees] = useState<Partial<Record<CommitActionEnum, BigNumber>>>({});

    const commitType = CommitActionSideMap[commitAction][side];

    const receiveIn = useExpectedCommitExecution(pool.lastUpdate, pool.updateInterval, pool.frontRunningInterval);
    const amountBN = useBigNumber(amount);

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
                setCommitGasFees({ ...commitGasFees, [commitAction]: ethPrice.times(costInEth) });
            }
        }
    }, [selectedPool, commitType, amountBN, ethPrice, gasPrice]);

    const TRADE_OPTIONS = useMemo(() => {
        return getTradeOptions(swapState.poolStatus);
    }, [swapState.poolStatus]);

    return (
        <div className={className}>
            <Close onClick={onClose} className="close" />
            <Title>
                <NetworkHintContainer>
                    New Commit
                    <NetworkHint />
                </NetworkHintContainer>
            </Title>

            <Header>
                <TWButtonGroupStyled
                    value={commitAction ?? CommitActionEnum.mint}
                    size={'lg'}
                    color={'tracer'}
                    onClick={(val) => {
                        if (swapDispatch) {
                            swapDispatch({ type: 'setAmount', value: '' });
                            swapDispatch({ type: 'setLeverage', value: 1 });
                            swapDispatch({ type: 'setCommitAction', value: val as CommitActionEnum });
                        }
                    }}
                    options={TRADE_OPTIONS}
                />
                <Gas />
            </Header>

            <DividerRow />

            {/** Inputs */}
            <Inputs pool={pool} userBalances={userBalances} swapDispatch={swapDispatch} swapState={swapState} />

            {/* TODO: dependent on auto-claim feature */}
            {/* {CommitActionEnum[swapState.commitAction] === 'flip' && (
                <CheckboxStyled
                    onClick={() => setAutoClaimTokens(!autoClaimTokens)}
                    isChecked={autoClaimTokens}
                    label="Auto-claim tokens"
                    subtext="Once the pool rebalances, a small gas fee is required to retrieve your tokens from escrow. By
                    checking this box, you are request to have this function automated and will be charged a fee.
                    Otherwise, you can manually claim tokens from escrow."
                />
            )} */}

            <Summary
                pool={pool}
                showBreakdown={!invalidAmount.isInvalid}
                isLong={side === SideEnum.long}
                amount={amountBN}
                receiveIn={receiveIn}
                commitAction={commitAction}
                gasFee={commitGasFees[commitAction] ?? DEFAULT_GAS_FEE}
            />

            <ExchangeButton
                onClose={onClose}
                swapState={swapState}
                swapDispatch={swapDispatch}
                account={account}
                handleConnect={handleConnect}
                userBalances={userBalances}
                approve={approve}
                pool={pool}
                amountBN={amountBN}
                commit={commit}
                commitType={commitType}
            />
        </div>
    );
}) as React.FC<{
    onClose: () => void;
    className?: string;
}>)`
    width: 100%;
    justify-content: center;

    @media (min-width: 640px) {
        margin-top: 1.7rem;
    }
`;

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
    top: 1.6rem;
    width: 0.75rem;
    height: 0.75rem;
    cursor: pointer;

    @media (min-width: 640px) {
        right: 4rem;
        top: 3.8rem;
        width: 1rem;
        height: 1rem;
    }
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
`;

const TWButtonGroupStyled = styled(TWButtonGroup)`
    z-index: 0;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.125rem;
    width: auto;
`;

const DividerRow = styled(Divider)`
    margin: 30px 0;
    border-color: ${({ theme }) => theme.border.secondary};
`;

// TODO: dependent on auto-claim feature
// const CheckboxStyled = styled(Checkbox)`
//     margin: 25px 0 50px;

//     @media (min-width: 640px) {
//         margin: 29px 0 60px;
//     }
// `;
