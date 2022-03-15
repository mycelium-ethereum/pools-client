import React, { useMemo } from 'react';
import { Transition } from '@headlessui/react';
import { CommitActionEnum } from '@libs/constants';

import * as Styles from './styles';
import FlipSummary from './FlipSummary';
import MintSummary from './MintSummary';
import BurnSummary from './BurnSummary';
import { SummaryProps } from './types';

export default (({ pool, showBreakdown, amount, isLong, receiveIn, commitAction, gasFee }) => {
    const token = useMemo(() => (isLong ? pool.longToken : pool.shortToken), [isLong, pool.longToken, pool.shortToken]);
    const tokenPrice = useMemo(() => (isLong ? pool.getNextLongTokenPrice() : pool.getNextShortTokenPrice()), [isLong]);
    return (
        <Styles.HiddenExpand defaultHeight={0} open={!!pool.name} showBorder={!!pool.name}>
            <Styles.Wrapper isSummaryAvailable={showBreakdown}>
                <Transition
                    show
                    enter="transition-opacity duration-50 delay-100"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    {commitAction === CommitActionEnum.mint && (
                        <MintSummary
                            amount={amount}
                            tokenPrice={tokenPrice}
                            token={token}
                            pool={{
                                name: pool.name,
                                oraclePrice: pool.oraclePrice,
                                leverage: pool.leverage,
                            }}
                            gasFee={gasFee}
                            showBreakdown={showBreakdown}
                        />
                    )}

                    {commitAction === CommitActionEnum.burn && (
                        <BurnSummary
                            amount={amount}
                            tokenPrice={tokenPrice}
                            gasFee={gasFee}
                            token={token}
                            pool={{
                                quoteTokenSymbol: pool.quoteToken.symbol,
                            }}
                        />
                    )}

                    {commitAction === CommitActionEnum.flip && (
                        <FlipSummary
                            amount={amount}
                            tokenPrice={tokenPrice}
                            token={token}
                            isLong={isLong}
                            pool={pool}
                            gasFee={gasFee}
                        />
                    )}
                </Transition>
                <Styles.Countdown>
                    {`${CommitActionEnum[commitAction]} in`}
                    <Styles.TimeLeft className="timeleft" targetTime={receiveIn} />
                </Styles.Countdown>
            </Styles.Wrapper>
        </Styles.HiddenExpand>
    );
}) as React.FC<SummaryProps>;
