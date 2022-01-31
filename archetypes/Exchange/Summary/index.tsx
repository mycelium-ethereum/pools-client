import React, { useMemo, useState } from 'react';
// import { HiddenExpand, Logo, LogoTicker, Section, tokenSymbolToLogoTicker } from '@components/General';
import { HiddenExpand, Section } from '@components/General';
import TimeLeft from '@components/TimeLeft';
import { Pool } from '@libs/types/General';
import { toApproxCurrency } from '@libs/utils/converters';
import {
    // calcEffectiveLongGain,
    // calcEffectiveShortGain,
    calcNotionalValue,
    calcTokenPrice,
} from '@tracer-protocol/tracer-pools-utils';
import { BigNumber } from 'bignumber.js';
import { Transition } from '@headlessui/react';
import { classNames } from '@libs/utils/functions';
// import Link from '/public/img/general/link.svg';
// import { useWeb3 } from '@context/Web3Context/Web3Context';
// import { ARBITRUM } from '@libs/constants';
// import useBalancerSpotPrices from '@libs/hooks/useBalancerSpotPrices';
// import { AvailableNetwork, networkConfig } from '@context/Web3Context/Web3Context.Config';
import Button from '@components/General/Button';
import styled from 'styled-components';
import ArrowDown from '@public/img/general/caret-down-white.svg';

type SummaryProps = {
    pool: Pool;
    showBreakdown: boolean;
    amount: BigNumber;
    isLong: boolean;
    isMint: boolean;
    receiveIn: number;
};

// const Summary
export default (({ pool, showBreakdown, amount, isLong, isMint, receiveIn }) => {
    const [showTransactionDetails, setShowTransactionDetails] = useState(false);

    const token = useMemo(() => (isLong ? pool.longToken : pool.shortToken), [isLong, pool.longToken, pool.shortToken]);
    const notional = useMemo(
        () => (isLong ? pool.nextLongBalance : pool.nextShortBalance),
        [isLong, pool.nextLongBalance, pool.nextShortBalance],
    );
    const pendingBurns = useMemo(
        () => (isLong ? pool.committer.pendingLong.burn : pool.committer.pendingShort.burn),
        [isLong, pool.committer.pendingLong.burn, pool.committer.pendingShort.burn],
    );
    const tokenPrice = useMemo(
        () => calcTokenPrice(notional, token.supply.plus(pendingBurns)),
        [notional, token, pendingBurns],
    );

    // const balancesAfter = {
    //     longBalance: pool.nextLongBalance.plus(isLong ? amount : 0).plus(pool.committer.pendingLong.mint),
    //     shortBalance: pool.nextShortBalance.plus(isLong ? 0 : amount).plus(pool.committer.pendingShort.mint),
    // };

    const totalCommitmentAmount = 2000;
    const totalGasFee = 1.78;
    const totalCost = totalCommitmentAmount + totalGasFee;
    const expectedAmount = amount.div(tokenPrice ?? 1).toFixed(3);
    const expectedPrice = ` at ${toApproxCurrency(tokenPrice ?? 1, 2)} USD/token`;
    const expectedTokensMinted = `${expectedAmount} ${token.name}`;
    // const commitAmount = totalCommitmentAmount;
    const poolPowerLeverage = pool.leverage;

    // const effectiveGains = useMemo(() => {
    //     return isLong
    //         ? calcEffectiveLongGain(balancesAfter.shortBalance, balancesAfter.longBalance, new BigNumber(pool.leverage))
    //         : calcEffectiveShortGain(
    //               balancesAfter.shortBalance,
    //               balancesAfter.longBalance,
    //               new BigNumber(pool.leverage),
    //           );
    // }, [isLong, amount, balancesAfter.longBalance, balancesAfter.shortBalance]);

    return (
        <Container>
            <HiddenExpand
                defaultHeight={0}
                open={!!pool.name}
                className={classNames('hidden-expand', !!pool.name ? 'show-border' : 'border-transparent')}
            >
                <div className="wrapper">
                    {/* <h2 className="text-theme-text mb-2">
                    {isMint ? (
                        <>
                            <Logo className="inline mr-2" size="md" ticker={tokenSymbolToLogoTicker(token.symbol)} />
                            {token.name}
                        </>
                    ) : (
                        <>
                            <Logo className="inline mr-2" size="md" ticker={pool.quoteToken.symbol as LogoTicker} />
                            {pool.quoteToken.symbol}
                        </>
                    )}
                </h2> */}
                    <Transition
                        show={showBreakdown}
                        enter="transition-opacity duration-50 delay-100"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity duration-150"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        {isMint ? (
                            <>
                                <Section label="Total Costs">
                                    {/* <span className="sum">{`${amount.div(tokenPrice ?? 1).toFixed(3)}`}</span> */}
                                    <span className="sum">${totalCost}</span>
                                </Section>
                                {showTransactionDetails && (
                                    <div className="section-details">
                                        <Section label="Commit Amount" showSectionDetails>
                                            <div>
                                                <span className="opacity-50">${totalCommitmentAmount}</span>
                                                {/* <span className="opacity-50">{`${toApproxCurrency(
                                                tokenPrice ?? 1,
                                                3,
                                            )}`}</span> */}
                                            </div>
                                        </Section>
                                        {/* <Section label="Protocol Fee" showSectionDetails>
                                        <div>
                                            <span>{`${amount.div(tokenPrice ?? 1).toFixed(3)}`}</span>
                                            <span className="opacity-50">{` @ ${toApproxCurrency(
                                                tokenPrice ?? 1,
                                                3,
                                            )}`}</span>
                                        </div>
                                    </Section> */}
                                        <Section label="Gas Fee" showSectionDetails>
                                            {/* <span className="opacity-50">{`${toApproxCurrency(tokenPrice ?? 1, 3)}`}</span> */}
                                            <span className="opacity-50">${totalGasFee}</span>
                                        </Section>
                                    </div>
                                )}
                                <Section label="Expected Tokens Minted">
                                    <span className="sum">{expectedTokensMinted}</span>
                                </Section>
                                {showTransactionDetails && (
                                    <div className="section-details">
                                        <Section label="Expected Amount" showSectionDetails>
                                            <div>
                                                <span className="opacity-50">
                                                    {`${amount.div(tokenPrice ?? 1).toFixed(3)}`} tokens
                                                </span>
                                            </div>
                                        </Section>
                                        <Section label="Expected Price" showSectionDetails>
                                            <div>
                                                <span className="opacity-50">{expectedPrice}</span>
                                            </div>
                                        </Section>
                                    </div>
                                )}
                                <Section label="Expected Equivalent Exposure">
                                    <span className="text-green-500 font-semibold sum">0.02 BTC</span>
                                </Section>
                                {showTransactionDetails && (
                                    <>
                                        <Section label="Commit Amount (ETH) at $3,000 USD/ETH" showSectionDetails>
                                            <span className="opacity-50">0.01 BTC</span>
                                        </Section>
                                        <Section label="Pool Power Leverage" showSectionDetails>
                                            <span className="opacity-50">{poolPowerLeverage}</span>
                                        </Section>
                                    </>
                                )}
                                <ShowDetailsButton onClick={() => setShowTransactionDetails(!showTransactionDetails)}>
                                    <ArrowDown className={`${showTransactionDetails ? 'open' : ''}`} />
                                </ShowDetailsButton>
                            </>
                        ) : (
                            <>
                                <Section label="Expected Token Value">
                                    <span className="sum">
                                        {`${toApproxCurrency(calcNotionalValue(tokenPrice, amount), 3)}`} USDC
                                    </span>
                                </Section>
                                {showTransactionDetails && (
                                    <div className="section-details">
                                        <Section label="Tokens" showSectionDetails>
                                            <div>
                                                <span className="opacity-50">
                                                    {`${amount.div(tokenPrice ?? 1).toFixed(3)}`} tokens
                                                </span>
                                            </div>
                                        </Section>
                                        <Section label="Expected Price" showSectionDetails>
                                            <div>
                                                <span className="opacity-50">{expectedPrice}</span>
                                            </div>
                                        </Section>
                                    </div>
                                )}

                                <Section label="Expected Fees">
                                    <span className="sum">
                                        {`${toApproxCurrency(calcNotionalValue(tokenPrice, amount), 3)}`} USDC
                                    </span>
                                </Section>
                                {showTransactionDetails && (
                                    <div className="section-details">
                                        <Section label="Protocol Fee" showSectionDetails>
                                            <div>
                                                <span className="opacity-50">
                                                    {`${amount.div(tokenPrice ?? 1).toFixed(3)}`} tokens
                                                </span>
                                            </div>
                                        </Section>
                                        <Section label="Gas Fee" showSectionDetails>
                                            <div>
                                                <span className="opacity-50">{expectedPrice}</span>
                                            </div>
                                        </Section>
                                    </div>
                                )}
                                <ShowDetailsButton onClick={() => setShowTransactionDetails(!showTransactionDetails)}>
                                    <ArrowDown className={`${showTransactionDetails ? 'open' : ''}`} />
                                </ShowDetailsButton>
                            </>
                        )}
                        {/* <BalancerLink token={token} isBuy={isMint} /> */}
                    </Transition>
                    <div className="countdown">
                        {`${isMint ? 'Mint' : 'Burn'} in`}
                        <TimeLeft className="timeleft" targetTime={receiveIn} />
                    </div>
                </div>
            </HiddenExpand>
        </Container>
    );
}) as React.FC<SummaryProps>;

// export const constructBalancerLink: (token: string | undefined, network: AvailableNetwork, isBuy: boolean) => string = (
//     token,
//     network,
//     isBuy,
// ) => {
//     const { usdcAddress, balancerInfo } = networkConfig[network];
//     // balancerInfo will not be undefined due to the network === ARBITRUM in BalancerLink
//     return isBuy
//         ? `${balancerInfo?.baseUri}/${usdcAddress}/${token}`
//         : `${balancerInfo?.baseUri}/${token}/${usdcAddress}`;
// };

// const BalancerLink: React.FC<{
//     token: {
//         address: string;
//         symbol: string;
//     };
//     isBuy: boolean;
// }> = ({ token, isBuy }) => {
//     const { network } = useWeb3();
//     const balancerPoolPrices = useBalancerSpotPrices(network);
//     return network === ARBITRUM && balancerPoolPrices[token?.symbol] ? (
//         <div className="text-sm mt-2">
//             <div className="mr-2 whitespace-nowrap">{`Don't want to wait?`}</div>
//             <div>
//                 <Logo className="inline mr-2" ticker="BALANCER" />
//                 <a
//                     className="text-tracer-400 matrix:text-theme-primary underline hover:opacity-80"
//                     href={constructBalancerLink(token.address, network, isBuy)}
//                     target={'_blank'}
//                     rel={'noopener noreferrer'}
//                 >
//                     {`${isBuy ? 'Buy' : 'Sell'} on Balancer Pools @ ${toApproxCurrency(
//                         balancerPoolPrices[token.symbol],
//                         3,
//                     )}`}
//                     <Link className="inline ml-2 h-4 w-4 text-theme-text opacity-80" />
//                 </a>
//             </div>
//         </div>
//     ) : null;
// };

const Container = styled.div`
    .hidden-expand {
        margin-bottom: 2rem !important;
        font-size: 1rem;
        line-height: 1.5rem;
        border-width: 1px;
        border-color: ${({ theme }) => theme['border-secondary']};
        background-color: ${({ theme }) => theme.background};

        .show-border {
            /* border-color: ${({ theme }) => theme.border}; */
            border-color: #d1d5db;
        }
    }

    .wrapper {
        padding: 1.5rem 1rem 0;
        position: relative;

        .section-details {
            margin-bottom: 5px;
            margin-top: -4px;
        }

        .countdown {
            position: absolute;
            top: -1rem;
            left: 1.5rem;
            padding: 0.375rem;
            font-size: 0.875rem;
            line-height: 1.25rem;
            border-radius: 0.25rem;
            background-color: ${({ theme }) => theme.background};
            z-index: 2;
            font-size: 16px;

            .timeleft {
                display: inline;
                padding: 0.25rem 0.375rem;
                margin-left: 0.375rem;
                border-radius: 0.5rem;
                border-width: 1px;
                background-color: ${({ theme }) => theme['button-bg']};
                border-color: ${({ theme }) => theme['border-secondary']};
            }
        }

        .sum {
            font-size: 16px;
        }
    }
`;

const ShowDetailsButton = styled(Button)`
    width: calc(100% + 2rem);
    margin: 23px -1rem 0;
    background-color: ${({ theme }) => theme['border-secondary']} !important;
    border-top-left-radius: 0 !important;
    border-top-right-radius: 0 !important;
    height: 30px;
    text-align: center;

    svg {
        margin: 0 auto;
        path {
            fill: ${({ theme }) => theme.text} !important;
        }
    }

    .open {
        -webkit-transform: rotateX(180deg);
        transform: rotateX(180deg);
    }
`;
