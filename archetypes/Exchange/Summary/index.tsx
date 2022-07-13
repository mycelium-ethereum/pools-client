import React, { useMemo } from 'react';
import { Transition } from '@headlessui/react';
import { CommitActionEnum } from '@tracer-protocol/pools-js';

import { Logo, tokenSymbolToLogoTicker } from '~/components/General';
import BurnSummary from './BurnSummary';
import FlipSummary from './FlipSummary';
import MintSummary from './MintSummary';
import * as Styles from './styles';
import { SummaryProps } from './types';

export default (({ pool, showBreakdown, amount, isLong, receiveIn, commitAction, gasFee, showTokenImage }) => {
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
                    {showTokenImage && token ? (
                        <div className="mb-4 flex items-center">
                            <Logo className="mr-2 inline" size="md" ticker={tokenSymbolToLogoTicker(token?.symbol)} />
                            <span className="font-bold">{token?.symbol}</span>
                        </div>
                    ) : null}
                    {commitAction === CommitActionEnum.mint && (
                        <MintSummary
                            amount={amount}
                            nextTokenPrice={nextTokenPrice}
                            token={token}
                            pool={{
                                name: pool.name,
                                oraclePrice: pool.oraclePrice,
                                leverage: pool.leverage,
                                settlementTokenSymbol: pool.settlementToken.symbol,
                            }}
                            gasFee={gasFee}
                            isLong={isLong}
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
