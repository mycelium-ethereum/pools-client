import Button from '@components/General/Button';
import { Table, TableHeader, TableRow } from '@components/General/TWTable';
import { SideEnum } from '@libs/constants';
import { toApproxCurrency } from '@libs/utils/converters';
import React, { useMemo, useState } from 'react';
import RebalanceRate from '../RebalanceRate';
import { BrowseTableRowData } from '../state';
import { TWModal } from '@components/General/TWModal';
import TimeLeft from '@components/TimeLeft';
import Actions from '@components/TokenActions';

import QuestionMark from '/public/img/general/question-mark-circle.svg';
import Close from '/public/img/general/close.svg';
import { Logo, tokenSymbolToLogoTicker } from '@components/General';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { ethers } from 'ethers';
import { ArbiscanEnum } from '@libs/utils/rpcMethods';
import Loading from '@components/General/Loading';
import TooltipSelector, { TooltipKeys } from '@components/Tooltips/TooltipSelector';

import Lock from '/public/img/general/lock.svg';
import useIntervalCheck from '@libs/hooks/useIntervalCheck';

export default (({ rows, onClickBuy, onClickSell }) => {
    const [showModalRebalanceRate, setShowModalRebalanceRate] = useState(false);
    const { provider } = useWeb3();
    return (
        <>
            <Table>
                <TableHeader>
                    <span>Token</span>
                    <span>{'Price (USDC) *'}</span>
                    <span className="flex">
                        {'Expected Rebalancing rate * '}
                        <span className="cursor-pointer ml-1" onClick={() => setShowModalRebalanceRate(true)}>
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
            <p className="mt-3 mx-auto max-w-2xl text-sm text-theme-text opacity-80">
                * The <strong>Price</strong> and <strong>Rebalancing Rate</strong> displayed for each token are
                indicative only. The values displayed are the estimated <strong>Price</strong> and{' '}
                <strong>Rebalancing Rate</strong> the next rebalance, given the queued mints and burns and estimated
                value transfer. The actual <strong>Price</strong> and <strong>Rebalancing Rate</strong> for each token
                will be calculated and updated at the next rebalalance.
            </p>
            <TWModal open={showModalRebalanceRate} onClose={() => setShowModalRebalanceRate(false)}>
                <div className="flex justify-between">
                    <div className="text-2xl">Rebalancing Rate</div>
                    <div className="w-3 h-3 cursor-pointer" onClick={() => setShowModalRebalanceRate(false)}>
                        <Close />
                    </div>
                </div>
                <br />
                <div>
                    The <b>Rebalancing Rate</b> is function of collateral skew in the pool. It can result in a polarised
                    leverage effect at rebalance. The Rebalancing Rate is calculated as (long side collateral/short side
                    collateral) - 1.
                </div>
                <br />
                <div>
                    If the <b>Rebalancing Rate = 0</b>, there is an equal amount of collateral held in the long and
                    short side of the pool. At rebalance, the winning side{`'`}s gains are neither amplified or reduced.
                </div>
                <br />
                <div>
                    If the <b>Rebalancing Rate {'>'} 0</b>, there is more collateral held in the long side of the pool.
                    At rebalance, the short side&apos;s gains are effectively amplified relative to their losses.
                    Conversely, the long side&apos;s gains are effectively reduced.
                </div>
                <br />
                <div>
                    If the <b>Rebalancing Rate {'<'} 0</b>, there is more collateral held in the short side of the pool.
                    At rebalance, the short side&apos;s gains are effectively reduced relative to their losses.
                    Conversely, the long side&apos;s gains are effectively amplified.
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

            <RebalanceRate rebalanceRate={token.rebalanceRate} />
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

// const ColoredChangeNumber = (({ number }) => {
//     return (
//         <span className={number >= 0 ? 'text-green-500' : 'text-red-500'}>{`${number >= 0 ? '+' : ''}${number.toFixed(
//             2,
//         )}`}</span>
//     );
// }) as React.FC<{
//     number: number;
// }>;
