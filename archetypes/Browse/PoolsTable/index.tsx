import React, { useState, useEffect } from 'react';
import Button from '@components/General/Button';
import { Table, TableHeader, TableRow, TableHeaderCell, TableRowCell } from '@components/General/TWTable';
import { SideEnum } from '@libs/constants';
import { toApproxCurrency } from '@libs/utils/converters';
import { BrowseTableRowData } from '../state';
import { TWModal } from '@components/General/TWModal';
import TimeLeft from '@components/TimeLeft';
import Actions from '@components/TokenActions';
import { Logo, tokenSymbolToLogoTicker } from '@components/General';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { ethers } from 'ethers';
import { ArbiscanEnum } from '@libs/utils/rpcMethods';
import Loading from '@components/General/Loading';
import TooltipSelector, { TooltipKeys } from '@components/Tooltips/TooltipSelector';
import useIntervalCheck from '@libs/hooks/useIntervalCheck';

import Close from '/public/img/general/close.svg';
// import { classNames } from '@libs/utils/functions';

export default (({ rows, onClickBuy, onClickSell }) => {
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
                        <TableHeaderCell>{'Commitment Window'}</TableHeaderCell>

                        {/* Token Cols */}
                        <TableHeaderCell>{'Side'}</TableHeaderCell>
                        <TableHeaderCell className={'whitespace-nowrap'}>{'TVL (USDC)'}</TableHeaderCell>
                        <TableHeaderCell colSpan={2} className={'whitespace-nowrap'}>{'Effective Leverage'}</TableHeaderCell>
                        <TableHeaderCell colSpan={2} className={'whitespace-nowrap'}>{'Token Price (USD)'}</TableHeaderCell>
                        <TableHeaderCell>{/* Empty header for buttons column */}</TableHeaderCell>
                    </tr>
                    <tr>
                        {/* Pools  Cols */}
                        <TableHeaderCell colSpan={4}/>
                        <TableHeaderCell>{'Ends in'}</TableHeaderCell>

                        {/* Token Cols */}
                        <TableHeaderCell colSpan={2}/>
                        <TableHeaderCell>{'On Gains'}</TableHeaderCell>
                        <TableHeaderCell>{'On Losses'}</TableHeaderCell>
                        <TableHeaderCell>{'On Tracer'}</TableHeaderCell>
                        <TableHeaderCell>{'On Balancer'}</TableHeaderCell>
                        <TableHeaderCell />
                    </tr>
                </TableHeader>
                {rows.map((pool, index) => {
                    return (
                        <PoolRow
                            pool={pool}
                            onClickBuy={onClickBuy}
                            onClickSell={onClickSell}
                            index={index}
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
        </>
    );
}) as React.FC<{
    rows: BrowseTableRowData[];
    onClickBuy: (pool: string, side: SideEnum) => void;
    onClickSell: (pool: string, side: SideEnum) => void;
}>;

const calcPercentage: (value: number, total: number) => number = (value, total) => ((value / total) * 100)
const PoolRow: React.FC<{
    pool: BrowseTableRowData;
    index: number;
    onClickBuy: (pool: string, side: SideEnum) => void;
    onClickSell: (pool: string, side: SideEnum) => void;
    provider: ethers.providers.JsonRpcProvider | undefined;
}> = ({ pool, onClickBuy, onClickSell, index, provider }) => {
    const [pendingUpkeep, setPendingUpkeep] = useState(false);

    // const hasHoldings = useMemo(() => pool.myHoldings > 0, [pool.myHoldings]);

    const isBeforeFrontRunning = useIntervalCheck(pool.nextRebalance, pool.frontRunning);

    // const priceDelta = calcPercentageDifference(token.nextPrice, token.lastPrice);

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
                <Logo className="inline mr-2" size={'md'} ticker={tokenSymbolToLogoTicker(pool.name)} />
                {pool.name}
            </TableRowCell>
            <TableRowCell rowSpan={2}>
                {toApproxCurrency(pool.longToken.tvl + pool.shortToken.tvl)}
            </TableRowCell>
            <TableRowCell rowSpan={2} className={'relative bg-opacity-0 z-[1]'}>
                <LongBalance width={calcPercentage(pool.longToken.tvl, pool.longToken.tvl + pool.shortToken.tvl)} />
                <ShortBalance />
                {pool.skew.toFixed(2)}
            </TableRowCell>
            <TableRowCell rowSpan={2}>
                {pool.skew.toFixed(2)}
            </TableRowCell>
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

            {/** Token rows */}
            <TokenRows 
                side={SideEnum.long}
                provider={provider}
                onClickBuy={onClickBuy}
                onClickSell={onClickSell}
                tokenInfo={pool.longToken}
                {...pool}
            />
        </TableRow>
        <TableRow rowNumber={index}>
            <TokenRows 
                side={SideEnum.short}
                provider={provider}
                onClickBuy={onClickBuy}
                onClickSell={onClickSell}
                tokenInfo={pool.shortToken}
                {...pool}
            />
        </TableRow>
        </>
    );
};

const LongBalance: React.FC<{ width: number }> = ({ width }) => (<div style={{ width: `${width}%`}} className={`absolute left-0 top-0 h-full z-[-1] bg-green-50 dark:bg-dark-green`}></div>)
const ShortBalance = () => (<div className={`absolute left-0 top-0 w-full h-full z-[-2] bg-red-50 dark:bg-dark-red`}></div>)

const longStyles = 'bg-green-50 dark:bg-dark-green'
const shortStyles = 'bg-red-50 dark:bg-dark-red'

const TokenRows: React.FC<{
    side: SideEnum,
    tokenInfo: BrowseTableRowData['longToken'] | BrowseTableRowData['shortToken']
    leverage: number,
    address: string,
    decimals: number,
    onClickBuy: (pool: string, side: SideEnum) => void;
    onClickSell: (pool: string, side: SideEnum) => void;
    provider: ethers.providers.JsonRpcProvider | undefined;
}> = ({ 
    side,
    tokenInfo,
    leverage,
    address: poolAddress,
    decimals,
    provider,
    onClickBuy,
    onClickSell
}) => {
    const styles = side === SideEnum.long ? longStyles : shortStyles;

    return (
        <>
        <TableRowCell className={styles}>
            {side === SideEnum.long ? 'Long' : 'Short'}
        </TableRowCell>
        <TableRowCell className={styles}>
            {toApproxCurrency(tokenInfo.tvl)}
        </TableRowCell>
        <TableRowCell className={styles}>
            {tokenInfo.effectiveGain.toFixed(2)}
        </TableRowCell>
        <TableRowCell className={styles}>
            {leverage}
        </TableRowCell>
        <TableRowCell className={styles}>
            {toApproxCurrency(tokenInfo.lastTCRPrice)}
        </TableRowCell>
        <TableRowCell className={styles}>
            {toApproxCurrency(tokenInfo.lastTCRPrice)}
        </TableRowCell>
        <TableRowCell className={styles}>
            <Button
                className="mx-1 w-[70px] rounded-2xl font-bold uppercase "
                size="sm"
                variant="primary-light"
                onClick={() => onClickBuy(poolAddress, side)}
            >
                Mint
            </Button>
            <Button
                className="mx-1 w-[70px] rounded-2xl font-bold uppercase "
                size="sm"
                variant="primary-light"
                onClick={() => onClickSell(poolAddress, side)}
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
        </TableRowCell>
        </>
    )
}
