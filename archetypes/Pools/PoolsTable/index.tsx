import React, { useState, useEffect } from 'react';
import Button from '@components/General/Button';
import { Table, TableHeader, TableRow, TableHeaderCell, TableRowCell } from '@components/General/TWTable';
import { CommitActionEnum, SideEnum } from '@libs/constants';
import { calcPercentageDifference, toApproxCurrency } from '@libs/utils/converters';
import { BrowseTableRowData } from '../state';
import { TWModal } from '@components/General/TWModal';
import TimeLeft from '@components/TimeLeft';
import Actions from '@components/TokenActions';
import { Logo, LogoTicker } from '@components/General';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { ethers } from 'ethers';
import { ArbiscanEnum } from '@libs/utils/rpcMethods';
import Loading from '@components/General/Loading';
import TooltipSelector, { TooltipKeys } from '@components/Tooltips/TooltipSelector';
import useIntervalCheck from '@libs/hooks/useIntervalCheck';

import Close from '/public/img/general/close.svg';
import ArrowDown from '/public/img/general/arrow-circle-down.svg';
import { classNames } from '@libs/utils/functions';
import MintBurnModal from '../MintBurnModal';
// import { classNames } from '@libs/utils/functions';

type TProps = {
    onClickMintBurn: (pool: string, side: SideEnum, commitAction: CommitActionEnum) => void;
    // onClickSell: (pool: string, side: SideEnum) => void;
    showNextRebalance: boolean;
};

export default (({ rows, onClickMintBurn, showNextRebalance, onMintBurnClose, mintBurnOpen }) => {
    const [showModalEffectiveGain, setShowModalEffectiveGain] = useState(false);
    const { provider } = useWeb3();
    return (
        <>
            <Table>
                <TableHeader>
                    <tr>
                        {/* Pools  Cols */}
                        <TableHeaderCell>Pool</TableHeaderCell>
                        <TableHeaderCell className="whitespace-nowrap">{'TVL (USDC)'}</TableHeaderCell>
                        <TableHeaderCell>{'Skew'}</TableHeaderCell>
                        <TableHeaderCell>{'Rebalancing Rate'}</TableHeaderCell>
                        {showNextRebalance ? <TableHeaderCell>{'Commitment Window'}</TableHeaderCell> : null}
                        {/* Token Cols */}
                        <TableHeaderCell size="sm">{'Side'}</TableHeaderCell>
                        <TableHeaderCell size="sm" className={'whitespace-nowrap'}>
                            {'TVL (USDC)'}
                        </TableHeaderCell>
                        <TableHeaderCell size="sm" colSpan={2} className={'whitespace-nowrap'}>
                            {'Effective Leverage'}
                        </TableHeaderCell>
                        <TableHeaderCell size="sm" colSpan={2} className={'whitespace-nowrap'}>
                            {'Token Price (USD)'}
                        </TableHeaderCell>
                        <TableHeaderCell>{/* Empty header for buttons column */}</TableHeaderCell>
                    </tr>
                    <tr>
                        {/* Pools  Cols */}
                        <TableHeaderCell colSpan={4} />
                        {showNextRebalance ? <TableHeaderCell>{'Ends in'}</TableHeaderCell> : null}

                        {/* Token Cols */}
                        <TableHeaderCell size="sm" colSpan={2} />
                        <TableHeaderCell size="sm">{'On Gains'}</TableHeaderCell>
                        <TableHeaderCell size="sm">{'On Losses'}</TableHeaderCell>
                        <TableHeaderCell size="sm">{'On Tracer'}</TableHeaderCell>
                        <TableHeaderCell size="sm">{'On Balancer'}</TableHeaderCell>
                        <TableHeaderCell />
                    </tr>
                </TableHeader>
                {rows.map((pool, index) => {
                    return (
                        <PoolRow
                            pool={pool}
                            onClickMintBurn={onClickMintBurn}
                            index={index}
                            showNextRebalance={showNextRebalance}
                            key={pool.address}
                            provider={provider}
                        />
                    );
                })}
            </Table>
            {!rows.length ? <Loading className="w-10 mx-auto my-8" /> : null}
            <p className="mt-3 mx-auto max-w-2xl text-sm text-theme-text opacity-80 text-center">
                * <strong>Token Price</strong> values indicative only, and represent the estimated values for the next
                rebalance, given the committed mints and burns and change in price of the underlying asset.
            </p>
            <TWModal open={showModalEffectiveGain} onClose={() => setShowModalEffectiveGain(false)}>
                <div className="flex justify-between">
                    <div className="text-2xl">Leverage on Gains</div>
                    <div className="w-3 h-3 cursor-pointer" onClick={() => setShowModalEffectiveGain(false)}>
                        <Close />
                    </div>
                </div>
                <br />
                <div>
                    This metric is the the effective leverage by which your gains will be determined at the next
                    rebalancing event. While the leverage on losses is always fixed, the leverage on gains varies
                    depending on the capital in the other side of the pool.
                </div>
            </TWModal>
            <MintBurnModal
                open={mintBurnOpen}
                onClose={onMintBurnClose}
            />
        </>
    );
}) as React.FC<
    {
        rows: BrowseTableRowData[];
        mintBurnOpen: boolean;
        onMintBurnClose: () => void;
    } & TProps
>;

const calcPercentage: (value: number, total: number) => number = (value, total) => (value / total) * 100;
const PoolRow: React.FC<
    {
        pool: BrowseTableRowData;
        index: number;
        provider: ethers.providers.JsonRpcProvider | undefined;
    } & TProps
> = ({ pool, onClickMintBurn, index, provider, showNextRebalance }) => {
    const [pendingUpkeep, setPendingUpkeep] = useState(false);

    const isBeforeFrontRunning = useIntervalCheck(pool.nextRebalance, pool.frontRunning);

    const skewDelta = calcPercentageDifference(pool.nextSkew, pool.skew);
    const tvlDelta = calcPercentageDifference(pool.nextTVL, pool.tvl);
    const rebalanceRateDelta = calcPercentageDifference(pool.nextRebalanceRate, pool.rebalanceRate);

    useEffect(() => {
        if (isBeforeFrontRunning) {
            setPendingUpkeep(false);
        }
    }, [isBeforeFrontRunning]);

    return (
        <>
            <TableRow rowNumber={index}>
                {/** Pool rows */}
                <TableRowCell rowSpan={2}>
                    <Logo
                        className="inline mr-2"
                        size={'md'}
                        ticker={pool.name?.split('-')[1]?.split('/')[0] as LogoTicker}
                    />
                    {pool.name}
                </TableRowCell>
                <TableRowCell rowSpan={2}>
                    {showNextRebalance ? (
                        <>
                            <div>{toApproxCurrency(pool.nextTVL)}</div>
                            <div className="mt-1">
                                <UpOrDown value={tvlDelta} />
                            </div>
                        </>
                    ) : (
                        <div>{toApproxCurrency(pool.tvl)}</div>
                    )}
                </TableRowCell>
                <TableRowCell rowSpan={2} className={'relative bg-opacity-0 z-[1]'}>
                    <LongBalance width={calcPercentage(pool.longToken.tvl, pool.tvl)} />
                    <ShortBalance />
                    {showNextRebalance ? (
                        <>
                            <div>{pool.skew.toFixed(2)}</div>
                            <div className="mt-1">
                                <UpOrDown value={skewDelta} />
                            </div>
                        </>
                    ) : (
                        <div>{pool.skew.toFixed(2)}</div>
                    )}
                </TableRowCell>
                <TableRowCell rowSpan={2}>
                    {showNextRebalance ? (
                        <>
                            <div>{pool.nextRebalanceRate.toFixed(2)}</div>
                            <div className="mt-1">
                                <UpOrDown value={rebalanceRateDelta} />
                            </div>
                        </>
                    ) : (
                        <div>{pool.rebalanceRate.toFixed(2)}</div>
                    )}
                </TableRowCell>
                {showNextRebalance ? (
                    <TableRowCell rowSpan={2}>
                        {!isBeforeFrontRunning ? (
                            <TooltipSelector tooltip={{ key: TooltipKeys.Lock }}>
                                <div>Front-running interval reached</div>
                                <div className="opacity-80">
                                    {'Mint and burn in '}
                                    {!pendingUpkeep ? (
                                        <TimeLeft
                                            targetTime={pool.nextRebalance}
                                            countdownEnded={() => {
                                                setPendingUpkeep(true);
                                            }}
                                        />
                                    ) : (
                                        'progress'
                                    )}
                                </div>
                            </TooltipSelector>
                        ) : (
                            <TimeLeft targetTime={pool.nextRebalance - pool.frontRunning} />
                        )}
                    </TableRowCell>
                ) : null}

                {/** Token rows */}
                <TokenRows
                    side={SideEnum.long}
                    provider={provider}
                    showNextRebalance={showNextRebalance}
                    onClickMintBurn={onClickMintBurn}
                    tokenInfo={pool.longToken}
                    {...pool}
                />
            </TableRow>
            <TableRow rowNumber={index}>
                <TokenRows
                    side={SideEnum.short}
                    provider={provider}
                    showNextRebalance={showNextRebalance}
                    onClickMintBurn={onClickMintBurn}
                    tokenInfo={pool.shortToken}
                    {...pool}
                />
            </TableRow>
        </>
    );
};

const LongBalance: React.FC<{ width: number }> = ({ width }) => (
    <div
        style={{ width: `${width}%` }}
        className={`absolute left-0 top-0 h-full z-[-1] bg-green-50 dark:bg-dark-green`}
    ></div>
);
const ShortBalance = () => (
    <div className={`absolute left-0 top-0 w-full h-full z-[-2] bg-red-50 dark:bg-dark-red`}></div>
);

const longStyles = 'bg-green-50 dark:bg-dark-green';
const shortStyles = 'bg-red-50 dark:bg-dark-red';

const TokenRows: React.FC<
    {
        side: SideEnum;
        tokenInfo: BrowseTableRowData['longToken'] | BrowseTableRowData['shortToken'];
        leverage: number;
        address: string;
        decimals: number;
        provider: ethers.providers.JsonRpcProvider | undefined;
    } & TProps
> = ({
    side,
    tokenInfo,
    leverage,
    address: poolAddress,
    decimals,
    provider,
    onClickMintBurn,
    showNextRebalance,
}) => {
    const styles = side === SideEnum.long ? longStyles : shortStyles;
    const tvlDelta = calcPercentageDifference(tokenInfo.nextTvl, tokenInfo.tvl);

    return (
        <>
            <TableRowCell size={'sm'} className={styles}>
                {side === SideEnum.long ? 'Long' : 'Short'}
            </TableRowCell>
            <TableRowCell size={'sm'} className={styles}>
                {showNextRebalance ? (
                    <>
                        <div className="flex">
                            <div className="mr-1">{toApproxCurrency(tokenInfo.nextTvl)}</div>
                            <UpOrDown value={tvlDelta} />
                        </div>
                    </>
                ) : (
                    toApproxCurrency(tokenInfo.tvl)
                )}
            </TableRowCell>
            <TableRowCell size={'sm'} className={styles}>
                {tokenInfo.effectiveGain.toFixed(2)}
            </TableRowCell>
            <TableRowCell size={'sm'} className={styles}>
                {leverage}
            </TableRowCell>
            <TableRowCell size={'sm'} className={styles}>
                {showNextRebalance
                    ? toApproxCurrency(tokenInfo.nextTCRPrice)
                    : toApproxCurrency(tokenInfo.lastTCRPrice)}
            </TableRowCell>
            <TableRowCell size={'sm'} className={styles}>
                {toApproxCurrency(tokenInfo.balancerPrice)}
            </TableRowCell>
            <TableRowCell size={'sm'} className={styles}>
                <div className="flex">
                    <Button
                        className="mx-1 w-[70px] my-auto font-bold uppercase "
                        size="xs"
                        variant="primary-light"
                        onClick={() => onClickMintBurn(poolAddress, side, CommitActionEnum.mint)}
                    >
                        Mint
                    </Button>
                    <Button
                        className="mx-1 w-[70px] my-auto font-bold uppercase "
                        size="xs"
                        variant="primary-light"
                        onClick={() => onClickMintBurn(poolAddress, side, CommitActionEnum.burn)}
                    >
                        Burn
                    </Button>
                    <Actions
                        provider={provider as ethers.providers.JsonRpcProvider}
                        token={{
                            address: poolAddress,
                            decimals: decimals,
                            symbol: tokenInfo.symbol,
                        }}
                        arbiscanTarget={{
                            type: ArbiscanEnum.token,
                            target: poolAddress,
                        }}
                    />
                </div>
            </TableRowCell>
        </>
    );
};

const UpOrDown: React.FC<{ value: number }> = ({ value }) => (
    <div className={classNames(value > 0 ? 'text-green-600' : 'text-red-600', 'flex')}>
        <div className="mr-1">
            <ArrowDown className={value > 0 ? 'rotate-180' : ''} />
        </div>
        <div>{value.toFixed(2)}%</div>
    </div>
);
