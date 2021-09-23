import React, { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { InnerInputText, InputContainer } from '@components/General/Input';
import { Input as NumericInput } from '@components/General/Input/Numeric';
import { swapDefaults, useSwapContext, noDispatch, LEVERAGE_OPTIONS } from '@context/SwapContext';
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

import Close from '/public/img/general/close-black.svg';
import useExpectedCommitExecution from '@libs/hooks/useExpectedCommitExecution';

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

const SIDE_OPTIONS = [
    {
        key: SideEnum.long,
        text: 'Long',
    },
    {
        key: SideEnum.short,
        text: 'Short',
    },
];

export default (() => {
    const { account } = useWeb3();
    const { swapState = swapDefaults, swapDispatch = noDispatch } = useSwapContext();
    const { leverage, selectedPool, side, amount, invalidAmount, market, markets } = swapState;
    const [showModal, setShowModal] = useState(false);

    const pool = usePool(selectedPool);

    const receiveIn = useExpectedCommitExecution(pool.lastUpdate, pool.updateInterval, pool.frontRunningInterval);

    useEffect(() => {
        if (
            (localStorage.getItem('onboard.selectedWallet') === 'MetaMask' ||
                localStorage.getItem('onboard.selectedWallet') === 'Torus') &&
            localStorage.getItem('showBridgeFunds') !== 'true'
        ) {
            setShowModal(true);
            localStorage.setItem('showBridgeFunds', 'true');
        }
    }, [account]);

    useEffect(() => {
        const invalidAmount = isInvalidAmount(
            amount,
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
            <div className={`${inputRow} flex justify-between`}>
                <span className="w-60">
                    <p className="mb-2 text-black">Market</p>
                    <Dropdown
                        className="w-full "
                        placeHolder="Select Market"
                        placeHolderIcon={pool.name?.split('-')[1]?.split('/')[0]}
                        size="lg"
                        options={Object.keys(markets).map((market) => ({
                            key: market,
                            ticker: market.split('/')[0],
                            text: market,
                        }))}
                        value={market}
                        onSelect={(selectedMarket) => {
                            swapDispatch({ type: 'setPoolFromMarket', market: selectedMarket as string });
                        }}
                    />
                </span>
                <span>
                    <p className="mb-2 text-black">Side</p>
                    <TWButtonGroup
                        value={side}
                        onClick={(option) => swapDispatch({ type: 'setSide', value: option as SideEnum })}
                        size={'lg'}
                        options={SIDE_OPTIONS}
                    />
                </span>
            </div>
            <div className={`${inputRow} `}>
                <TooltipSelector tooltip={{ key: TooltipKeys.PowerLeverage }}>
                    <div className="mb-2 text-black w-min whitespace-nowrap">Power Leverage</div>
                </TooltipSelector>
                <TWButtonGroup
                    value={leverage}
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
                <p className="mb-2 text-black">Amount</p>
                <InputContainer error={invalidAmount.isInvalid}>
                    <NumericInput
                        className="w-full h-full text-base font-normal "
                        value={amount.eq(0) ? '' : amount.toFixed()}
                        onUserInput={(val) => {
                            swapDispatch({ type: 'setAmount', value: new BigNumber(val || 0) });
                        }}
                    />
                    <InnerInputText>
                        <Currency ticker={'USDC'} />
                        <div
                            className="m-auto cursor-pointer hover:underline"
                            onClick={(_e) => swapDispatch({ type: 'setAmount', value: pool.quoteToken.balance })}
                        >
                            Max
                        </div>
                    </InnerInputText>
                </InputContainer>

                <div className={invalidAmount.isInvalid ? 'text-red-500 ' : ''}>
                    {invalidAmount.isInvalid && invalidAmount.message ? (
                        invalidAmount.message
                    ) : (
                        <>
                            <span className={`${!!pool.name ? 'inline' : 'hidden'}`}>
                                {`Available: ${toApproxCurrency(pool.quoteToken.balance)} `}
                                <span className="opacity-80">
                                    {!amount.eq(0)
                                        ? `>>> ${toApproxCurrency(pool.quoteToken.balance.minus(amount))}`
                                        : ''}
                                </span>
                            </span>
                        </>
                    )}
                </div>
            </div>

            <BuySummary pool={pool} amount={amount} isLong={side === SideEnum.long} receiveIn={receiveIn} />

            <FeeNote poolName={pool.name} isMint={true} receiveIn={receiveIn} />

            <ExchangeButton actionType={CommitActionEnum.mint} />

            <TWModal open={showModal} onClose={() => setShowModal(false)}>
                <div className="flex justify-between">
                    <div className="text-xl">Bridge Funds to Arbitrum</div>
                    <div className="w-3 h-3 cursor-pointer" onClick={() => setShowModal(false)}>
                        <Close />
                    </div>
                </div>
                <br />
                <div>
                    Tracer runs on Arbitrum mainnet. Be sure to bridge <b>USDC</b> for collateral, and <b>ETH</b> for
                    gas. It’s worth noting that there is a 7 day wait to withdraw your funds back to Ethereum Mainnet.
                    <br />
                    <br />
                    If you have any questions, please{' '}
                    <a
                        className="text-tracer-400 underline"
                        href="https://discord.gg/QU9qgCN368"
                        target="_blank"
                        rel="noreferrer"
                    >
                        contact us
                    </a>
                    .
                </div>
                <br />
                <Button
                    size="lg"
                    variant="primary"
                    onClick={() => window.open('https://bridge.arbitrum.io', '_blank', 'noopener')}
                >
                    Launch Arbitrum Bridge
                </Button>
            </TWModal>
        </>
    );
}) as React.FC;
