import React, { useMemo } from 'react';
import { Transition } from '@headlessui/react';
import { CommitActionEnum } from '@tracer-protocol/pools-js';

import * as Styles from './styles';
import FlipSummary from './FlipSummary';
import MintSummary from './MintSummary';
import BurnSummary from './BurnSummary';
import { SummaryProps } from './types';

export default (({ pool, showBreakdown, amount, isLong, receiveIn, commitAction, gasFee }) => {
    const token = useMemo(() => (isLong ? pool.longToken : pool.shortToken), [isLong, pool.longToken, pool.shortToken]);
    const nextTokenPrice = useMemo(
        () => (isLong ? pool.getNextLongTokenPrice() : pool.getNextShortTokenPrice()),
        [isLong],
    );
    return (
        <Styles.HiddenExpand defaultHeight={0} open={!!pool.name} showBorder={!!pool.name}>
            <Styles.Wrapper>
                <Transition
                    show={showBreakdown}
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
                            nextTokenPrice={nextTokenPrice}
                            token={token}
                            pool={{
                                name: pool.name,
                                oraclePrice: pool.oraclePrice,
                                leverage: pool.leverage,
                            }}
                            gasFee={gasFee}
                        />
                    )}

                    {commitAction === CommitActionEnum.burn && (
                        <BurnSummary
                            amount={amount}
                            nextTokenPrice={nextTokenPrice}
                            gasFee={gasFee}
                            token={token}
                            pool={{
                                settlementTokenSymbol: pool.settlementToken.symbol,
                            }}
                        />
                    )}

                    {commitAction === CommitActionEnum.flip && (
                        <FlipSummary
                            amount={amount}
                            nextTokenPrice={nextTokenPrice}
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
