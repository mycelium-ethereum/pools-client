import Button from '@components/General/Button';
import { Table, TableHeader, TableRow, TableHeaderCell } from '@components/General/TWTable';
import { SideEnum } from '@libs/constants';
import { calcPercentageDifference, toApproxCurrency } from '@libs/utils/converters';
import React, { useMemo, useState } from 'react';
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

export default (({ rows, onClickBuy, onClickSell }) => {
    const [showModalEffectiveGain, setShowModalEffectiveGain] = useState(false);
    const { provider } = useWeb3();
    return (
        <>
            <Table>
                <TableHeader>
                    <TableHeaderCell>Token</TableHeaderCell>
                    <TableHeaderCell className="whitespace-nowrap">{'Price (USDC) *'}</TableHeaderCell>
                    <TableHeaderCell className="whitespace-nowrap">
                        <div className="mb-4">Power Leverage</div>
                        <div className="flex font-normal">
                            <span className="mt-auto">For Gains</span>
                            <span className="cursor-pointer ml-1" onClick={() => setShowModalEffectiveGain(true)}>
                                <QuestionMark />
                            </span>
                        </div>
                    </TableHeaderCell>
                    <TableHeaderCell className="whitespace-nowrap font-normal" align="bottom">
                        For Losses
                    </TableHeaderCell>
                    <TableHeaderCell>Next Rebalance</TableHeaderCell>
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
                * <strong>Price</strong> and <strong>△ Price Since Last Rebalance</strong> are indicative only, and
                represent the estimated values for the next rebalance, given the committed mints and burns and change in
                price of the underlying asset.
            </p>
            <TWModal open={showModalEffectiveGain} onClose={() => setShowModalEffectiveGain(false)}>
                <div className="flex justify-between">
                    <div className="text-2xl">Effective Leverage on Gains</div>
                    <div className="w-3 h-3 cursor-pointer" onClick={() => setShowModalEffectiveGain(false)}>
                        <Close />
                    </div>
                </div>
                <br />
                <div>
                    <b>Effective Leverage on Gains:</b> This metric is the the effective leverage by which your gains
                    will be determined at the next rebalancing event. While the leverage on losses is always fixed, the
                    leverage on gains varies depending on the capital in the other side of the pool.
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
    const hasHoldings = useMemo(() => token.myHoldings > 0, [token.myHoldings]);

    const isBeforeFrontRunning = useIntervalCheck(token.nextRebalance, token.frontRunning);

    const priceDelta = calcPercentageDifference(token.nextPrice, token.lastPrice);

    return (
        <TableRow rowNumber={index}>
            <span>
                <Logo className="inline mr-2" size={'md'} ticker={tokenSymbolToLogoTicker(token.symbol)} />
                {token.symbol}
            </span>
            <span>
                <div>{toApproxCurrency(token.nextPrice)}</div>
                <div className="opacity-80">
                    {Math.abs(priceDelta) <= 0.001 ? (
                        'Minimal change'
                    ) : (
                        <span className={priceDelta >= 0 ? 'text-green-500' : 'text-red-500'}>
                            {`${toApproxCurrency(token.nextPrice - token.lastPrice)} (${priceDelta.toFixed(2)}%)`}
                        </span>
                    )}
                    {` since last rebalance`}
                </div>
            </span>
            <span className={token.effectiveGain >= token.leverage ? 'text-green-500' : 'text-red-500'}>
                {`${token.effectiveGain.toFixed(2)}x`}
            </span>
            <span>{`${token.leverage.toFixed(2)}x`}</span>
            <span className="flex">
                {!isBeforeFrontRunning ? (
                    <TooltipSelector tooltip={{ key: TooltipKeys.Lock }}>
                        <div>Front running interval reached</div>
                        <div className="opacity-80">
                            Mint/burn in <TimeLeft targetTime={token.nextRebalance} />
                        </div>
                    </TooltipSelector>
                ) : (
                    <TimeLeft targetTime={token.nextRebalance - token.frontRunning} />
                )}
            </span>
            <span>{toApproxCurrency(token.totalValueLocked)}</span>
            <span>
                <div>{`${token.myHoldings.toFixed(2)}`}</div>
                <div className="opacity-50">{toApproxCurrency(token.myHoldings * token.lastPrice)}</div>
            </span>
            <span>
                <Button
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
            </span>
        </TableRow>
    );
};
