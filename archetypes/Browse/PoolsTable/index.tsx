import React, { useMemo, useState, useEffect } from 'react';
import Button from '@components/General/Button';
import { Table, TableHeader, TableRow, TableHeaderCell, TableRowCell } from '@components/General/TWTable';
import { SideEnum } from '@libs/constants';
import { calcPercentageDifference, toApproxCurrency } from '@libs/utils/converters';
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

import QuestionMark from '/public/img/general/question-mark-circle.svg';
import Close from '/public/img/general/close.svg';
import { classNames } from '@libs/utils/functions';

export default (({ rows, onClickBuy, onClickSell }) => {
    const [showModalEffectiveGain, setShowModalEffectiveGain] = useState(false);
    const { provider } = useWeb3();
    return (
        <>
            <Table>
                <TableHeader>
                    <TableHeaderCell>Token</TableHeaderCell>
                    <TableHeaderCell className="whitespace-nowrap align-top">{'Token Price (USDC) *'}</TableHeaderCell>
                    <TableHeaderCell className="whitespace-nowrap pr-0">
                        <div className="mb-4">Power Leverage</div>
                        <div className="flex font-normal">
                            <span className="mt-auto">For Gains</span>
                            <span className="cursor-pointer ml-1" onClick={() => setShowModalEffectiveGain(true)}>
                                <QuestionMark />
                            </span>
                        </div>
                    </TableHeaderCell>
                    <TableHeaderCell className="whitespace-nowrap font-normal pl-0" align="bottom">
                        For Losses
                    </TableHeaderCell>
                    <TableHeaderCell>Commitment Ends In</TableHeaderCell>
                    <TableHeaderCell>TVL (USDC)</TableHeaderCell>
                    <TableHeaderCell>My Holdings (TOKENS/USDC)</TableHeaderCell>
                    <TableHeaderCell>{/* Empty header for buttons column */}</TableHeaderCell>
                </TableHeader>
                {rows.map((token, index) => {
                    return (
                        <TokenRow
                            token={token}
                            onClickBuy={onClickBuy}
                            onClickSell={onClickSell}
                            index={index}
                            key={token.address}
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

const TokenRow: React.FC<{
    token: BrowseTableRowData;
    index: number;
    onClickBuy: (pool: string, side: SideEnum) => void;
    onClickSell: (pool: string, side: SideEnum) => void;
    provider: ethers.providers.JsonRpcProvider | undefined;
}> = ({ token, onClickBuy, onClickSell, index, provider }) => {
    const [pendingUpkeep, setPendingUpkeep] = useState(false);

    const hasHoldings = useMemo(() => token.myHoldings > 0, [token.myHoldings]);

    const isBeforeFrontRunning = useIntervalCheck(token.nextRebalance, token.frontRunning);

    const priceDelta = calcPercentageDifference(token.nextPrice, token.lastPrice);

    useEffect(() => {
        if (isBeforeFrontRunning) {
            setPendingUpkeep(false);
        }
    }, [isBeforeFrontRunning]);

    return (
        <TableRow rowNumber={index}>
            <TableRowCell>
                <Logo className="inline mr-2" size={'md'} ticker={tokenSymbolToLogoTicker(token.symbol)} />
                {token.symbol}
            </TableRowCell>
            <TableRowCell>
                <div>{toApproxCurrency(token.nextPrice, 3)}</div>
                <div className="opacity-80">
                    {Math.abs(priceDelta) <= 0.01 ? (
                        'Minimal change'
                    ) : (
                        <span className={priceDelta >= 0 ? 'text-green-500' : 'text-red-500'}>
                            {priceDelta > 0 ? '+' : ''}
                            {`${toApproxCurrency(token.nextPrice - token.lastPrice, 3)} (${priceDelta.toFixed(2)}%)`}
                        </span>
                    )}
                    {` since last rebalance`}
                </div>
            </TableRowCell>
            <TableRowCell className={classNames('pr-0')}>
                <span className={token.effectiveGain >= token.leverage ? 'text-green-500' : 'text-red-500'}>
                    {`${token.effectiveGain.toFixed(2)}`}
                </span>
            </TableRowCell>
            <TableRowCell className="pl-0">{`${token.leverage.toFixed(2)}`}</TableRowCell>
            <TableRowCell>
                {!isBeforeFrontRunning ? (
                    <TooltipSelector tooltip={{ key: TooltipKeys.Lock }}>
                        <div>Front-running interval reached</div>
                        <div className="opacity-80">
                            {'Mint and burn in '}
                            {!pendingUpkeep ? (
                                <TimeLeft
                                    targetTime={token.nextRebalance}
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
                    <TimeLeft targetTime={token.nextRebalance - token.frontRunning} />
                )}
            </TableRowCell>
            <TableRowCell>{toApproxCurrency(token.totalValueLocked)}</TableRowCell>
            <TableRowCell>
                <div>{`${token.myHoldings.toFixed(2)}`}</div>
                <div className="opacity-50">{toApproxCurrency(token.myHoldings * token.lastPrice)}</div>
            </TableRowCell>
            <TableRowCell>
                <Button
                    id="browse-mint"
                    className="mx-1 w-[70px] rounded-2xl font-bold uppercase "
                    size="sm"
                    variant="primary-light"
                    onClick={() => onClickBuy(token.pool, token.side === 'short' ? SideEnum.short : SideEnum.long)}
                >
                    Mint
                </Button>
                <Button
                    className="mx-1 w-[70px] rounded-2xl font-bold uppercase "
                    size="sm"
                    variant="primary-light"
                    disabled={!hasHoldings}
                    onClick={() => onClickSell(token.pool, token.side === 'short' ? SideEnum.short : SideEnum.long)}
                >
                    Burn
                </Button>
                <Actions
                    provider={provider as ethers.providers.JsonRpcProvider}
                    token={{
                        address: token.address,
                        decimals: token.decimals,
                        symbol: token.symbol,
                    }}
                    arbiscanTarget={{
                        type: ArbiscanEnum.token,
                        target: token.address,
                    }}
                />
            </TableRowCell>
        </TableRow>
    );
};
