import React, { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { InnerInputText, InputContainer } from '@components/General/Input';
import { Input as NumericInput } from '@components/General/Input/Numeric';
import {
    swapDefaults,
    useSwapContext,
    noDispatch,
    LEVERAGE_OPTIONS,
    SIDE_OPTIONS,
    useBigNumber,
} from '@context/SwapContext';
import { useArbitrumBridge } from '@context/ArbitrumBridgeContext';
import { CommitActionEnum, SideEnum } from '@libs/constants';
import { usePool } from '@context/PoolContext';
import { toApproxCurrency } from '@libs/utils/converters';
import { BuySummary } from '../Summary';
import TWButtonGroup from '@components/General/TWButtonGroup';
import { Currency } from '@components/General/Currency';
import { Dropdown } from '@components/General/Dropdown';
import ExchangeButton from '@components/General/Button/ExchangeButton';
import FeeNote from '@archetypes/Exchange/FeeNote';
import Button from '@components/General/Button';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { TWModal } from '@components/General/TWModal';
import TooltipSelector, { TooltipKeys } from '@components/Tooltips/TooltipSelector';

import Close from '/public/img/general/close.svg';
import useExpectedCommitExecution from '@libs/hooks/useExpectedCommitExecution';
import { classNames } from '@libs/utils/functions';
import { LogoTicker } from '@components/General';

const inputRow = 'relative my-2 ';

/* HELPER FUNCTIONS */
const isInvalidAmount: (
    amount: BigNumber,
    balance: BigNumber,
    minimumCommitSize: BigNumber,
) => { isInvalid: boolean; message?: string } = (amount, balance, minimumCommitSize) => {
    if (amount.eq(0)) {
        return {
            message: undefined,
            isInvalid: false,
        };
    }

    if (amount.gt(balance)) {
        return {
            message: undefined,
            isInvalid: true,
        };
    }

    if (amount.lt(minimumCommitSize)) {
        return {
            message: `The minimum order size is ${toApproxCurrency(minimumCommitSize)}`,
            isInvalid: true,
        };
    }
    return {
        message: undefined,
        isInvalid: false,
    };
};

export default (() => {
    const { account } = useWeb3();
    const { swapState = swapDefaults, swapDispatch = noDispatch } = useSwapContext();
    const { showBridgeModal } = useArbitrumBridge();
    const { leverage, selectedPool, side, amount, invalidAmount, market, markets } = swapState;
    const [showModal, setShowModal] = useState(false);

    const amountBN = useBigNumber(amount);

    const pool = usePool(selectedPool);

    const receiveIn = useExpectedCommitExecution(pool.lastUpdate, pool.updateInterval, pool.frontRunningInterval);

    useEffect(() => {
        if (
            (localStorage.getItem('onboard.selectedWallet') === 'MetaMask' ||
                localStorage.getItem('onboard.selectedWallet') === 'Torus' ||
                localStorage.getItem('onboard.selectedWallet') === 'WalletConnect') &&
            localStorage.getItem('showBridgeFunds') !== 'true'
        ) {
            setShowModal(true);
        }
    }, [account]);

    const onCloseArbitrumModal = () => {
        setShowModal(false);
        localStorage.setItem('showBridgeFunds', 'true');
    };

    useEffect(() => {
        const invalidAmount = isInvalidAmount(
            amountBN,
            pool.quoteToken.balance,
            pool.committer.minimumCommitSize.div(10 ** pool.quoteToken.decimals),
        );

        swapDispatch({
            type: 'setInvalidAmount',
            value: invalidAmount,
        });
    }, [amount, pool.quoteToken.balance]);

    return (
        <>
            <div className={`${inputRow} flex justify-between mb-4`}>
                <span className="w-60">
                    <p className="mb-2">Market</p>
                    <Dropdown
                        className="w-full "
                        placeHolder="Select Market"
                        placeHolderIcon={pool.name?.split('-')[1]?.split('/')[0] as LogoTicker}
                        size="lg"
                        options={Object.keys(markets).map((market) => ({
                            key: market,
                            ticker: market.split('/')[0] as LogoTicker,
                            text: market,
                        }))}
                        value={market}
                        onSelect={(selectedMarket) => {
                            swapDispatch({ type: 'setPoolFromMarket', market: selectedMarket as string });
                        }}
                    />
                </span>
                <span>
                    <p className="mb-2 ">Side</p>
                    <TWButtonGroup
                        value={side}
                        onClick={(option) => swapDispatch({ type: 'setSide', value: option as SideEnum })}
                        size={'lg'}
                        borderColor={'tracer'}
                        options={SIDE_OPTIONS}
                    />
                </span>
            </div>
            <div className={`${inputRow} mb-4`}>
                <TooltipSelector tooltip={{ key: TooltipKeys.PowerLeverage }}>
                    <div className="mb-2  w-min whitespace-nowrap">Power Leverage</div>
                </TooltipSelector>
                <TWButtonGroup
                    value={leverage}
                    borderColor={'tracer'}
                    options={LEVERAGE_OPTIONS.map((option) => ({
                        key: option.leverage,
                        text: `${option.leverage}`,
                        disabled: option.disabled
                            ? {
                                  optionKey: TooltipKeys.ComingSoon,
                              }
                            : undefined,
                    }))}
                    onClick={(index) => {
                        swapDispatch({ type: 'setLeverage', value: index });
                    }}
                />
            </div>
            <div className={`${inputRow} `}>
                <p className="mb-2 ">Amount</p>
                <InputContainer error={invalidAmount.isInvalid}>
                    <NumericInput
                        className="w-3/5 h-full text-base font-normal"
                        value={amount}
                        onUserInput={(val) => {
                            swapDispatch({ type: 'setAmount', value: val || '' });
                        }}
                    />
                    <InnerInputText>
                        <Currency ticker={'USDC'} />
                        <div
                            className="m-auto cursor-pointer hover:underline"
                            onClick={(_e) =>
                                swapDispatch({ type: 'setAmount', value: pool.quoteToken.balance.toString() })
                            }
                        >
                            Max
                        </div>
                    </InnerInputText>
                </InputContainer>

                <div
                    className={classNames(
                        invalidAmount.isInvalid ? 'text-red-500 ' : 'text-theme-text',
                        'opacity-70 text-sm mt-2',
                    )}
                >
                    {invalidAmount.isInvalid && invalidAmount.message ? (
                        invalidAmount.message
                    ) : (
                        <>
                            <span className={`${!!pool.name ? 'inline' : 'hidden'}`}>
                                {`Available: ${toApproxCurrency(pool.quoteToken.balance)} `}
                                <span className="opacity-80">
                                    {!amountBN.eq(0)
                                        ? `>>> ${toApproxCurrency(
                                              BigNumber.max(pool.quoteToken.balance.minus(amount), 0),
                                          )}`
                                        : ''}
                                </span>
                            </span>
                        </>
                    )}
                </div>
            </div>
            <BuySummary
                showBreakdown={!invalidAmount.isInvalid}
                pool={pool}
                amount={amountBN}
                isLong={side === SideEnum.long}
                receiveIn={receiveIn}
            />

            <FeeNote poolName={pool.name} isMint={true} receiveIn={receiveIn} />

            <ExchangeButton actionType={CommitActionEnum.mint} />

            <TWModal open={showModal} onClose={onCloseArbitrumModal}>
                <div className="flex justify-between">
                    <div className="text-xl">Bridge Funds to Arbitrum</div>
                    <div className="w-3 h-3 cursor-pointer" onClick={onCloseArbitrumModal}>
                        <Close />
                    </div>
                </div>
                <br />
                <div>
                    Deposit funds from Ethereum to Arbitrum to get started with Perpetual Pools. Ensure you deposit{' '}
                    <b>USDC</b> for collateral and <b>ETH</b> for gas. Please note that the withdrawal process from
                    Arbitrum to Ethereum takes approximately 7 days.
                    <br />
                    <br />
                    If you have any questions, please{' '}
                    <a
                        className="text-tracer-400 underline"
                        href="https://discord.gg/QU9qgCN368"
                        target="_blank"
                        rel="noreferrer"
                    >
                        contact us.
                    </a>
                </div>
                <br />
                <Button
                    size="lg"
                    variant="primary"
                    onClick={() => {
                        showBridgeModal();
                        setShowModal(false);
                    }}
                >
                    {`Ok, let's bridge funds`}
                </Button>
                <p className="mt-2 text-center">
                    You can also bridge funds using the{' '}
                    <a
                        className="text-tracer-400 underline"
                        href="https://bridge.arbitrum.io"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Official Arbitrum Bridge.
                    </a>
                </p>
            </TWModal>
        </>
    );
}) as React.FC;
