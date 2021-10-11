import Button from '@components/General/Button';
import { Table, TableHeader, TableRow } from '@components/General/TWTable';
import { SideEnum } from '@libs/constants';
import { toApproxCurrency } from '@libs/utils/converters';
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
import Lock from '/public/img/general/lock.svg';

export default (({ rows, onClickBuy, onClickSell }) => {
    const [showModalEffectiveGain, setShowModalEffectiveGain] = useState(false);
    const { provider } = useWeb3();
    return (
        <>
            <Table>
                <TableHeader>
                    <span>Token</span>
                    <span>{'Price (USDC) *'}</span>
                    <span className="flex">
                        {'Leverage Gain / Leverage Loss * '}
                        <span className="cursor-pointer ml-1" onClick={() => setShowModalEffectiveGain(true)}>
                            <QuestionMark />
                        </span>
                    </span>
                    <span>Next Rebalancing Event</span>
                    <span>TVL (USDC)</span>
                    <span>My Holdings (TOKENS/USDC)</span>
                    <span>{/* Empty header for buttons column */}</span>
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
                * The <strong>Price</strong> and <strong>Rebalancing Rate</strong> displayed for each token are
                indicative only. The values displayed are the estimated <strong>Price</strong> and{' '}
                <strong>Rebalancing Rate</strong> the next rebalance, given the queued mints and burns and estimated
                value transfer. The actual <strong>Price</strong> and <strong>Rebalancing Rate</strong> for each token
                will be calculated and updated at the next rebalalance.
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
                    <b>Effective Leverage on Gains:</b>  This metric is the the effective leverage by which your gains will be determined at the next rebalancing event. While the leverage on losses is always fixed, the leverage on gains varies depending on the capital in the other side of the pool.
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

    return (
        <TableRow rowNumber={index}>
            <span>
                <Logo className="inline mr-2" size={'md'} ticker={tokenSymbolToLogoTicker(token.symbol)} />
                {token.symbol}
            </span>
            <span>{toApproxCurrency(token.lastPrice)}</span>
            <GainsAndLosses 
                effectiveGain={token.effectiveGain}
                leverage={token.leverage}
            />
            <span className="flex">
                {!isBeforeFrontRunning ? (
                    <TooltipSelector tooltip={{ key: TooltipKeys.Lock }}>
                        <Lock className="mr-2" />
                    </TooltipSelector>
                ) : null}
                <TimeLeft targetTime={token.nextRebalance} />
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

const GainsAndLosses = (({ effectiveGain, leverage }) => {
    return (
        <>
            <span className={effectiveGain >= leverage ? 'text-green-500' : 'text-red-500'}>
                {`${effectiveGain.toFixed(2)}x`}
            </span>
            {` / `}
            <span>
                {`${leverage.toFixed(2)}x`}
            </span>
        </>
    );
}) as React.FC<{
    effectiveGain: number;
    leverage: number;
}>;
