import Button from '@components/General/Button';
import { Table, TableHeader, TableRow } from '@components/General/TWTable';
import { toApproxCurrency } from '@libs/utils/converters';
import React, { useState } from 'react';
import { FarmTableRowData } from '../state';
import Modal from '@components/General/Modal';
import Close from '/public/img/general/close-black.svg';
import { Logo, tokenSymbolToLogoTicker } from '@components/General';

export default (({ rows, onClickStake, onClickUnstake, onClickClaim }) => {
    console.debug('Browse table rows', rows);
    const [showModal, setShowModal] = useState(false);
    return (
        <>
            <Table>
                <TableHeader className="uppercase">
                    <span>Farm</span>
                    <span>APY</span>
                    <span>TVL (USDC)</span>
                    <span>My Staked (TOKENS/USDC)</span>
                    <span>My Holdings (TOKENS/USDC)</span>
                    <span>{/* Empty header for buttons column */}</span>
                </TableHeader>
                {rows.map((farm, index) => {
                    return (
                        <TableRow key={farm.farm} rowNumber={index}>
                            <span>
                                <Logo
                                    className="inline w-[25px] mr-2"
                                    ticker={tokenSymbolToLogoTicker(farm.tokenSymbol)}
                                />
                                {farm.tokenSymbol}
                            </span>
                            <span>{farm.apy}%</span>
                            <span>{toApproxCurrency(farm.tvl)}</span>
                            <span>{toApproxCurrency(farm.myStaked)}</span>
                            <span>{toApproxCurrency(farm.myRewards)}</span>
                            <span>
                                <Button
                                    className="mx-1 px-2 w-[70px] rounded-2xl font-bold uppercase "
                                    size="sm"
                                    variant="primary-light"
                                    onClick={() => onClickStake()}
                                >
                                    Stake
                                </Button>
                                <Button
                                    className="mx-1 px-2 w-[90px] rounded-2xl font-bold uppercase "
                                    size="sm"
                                    variant="primary-light"
                                    // disabled={!hasHoldings}
                                    onClick={() => onClickUnstake()}
                                >
                                    Unstake
                                </Button>
                                <Button
                                    className="mx-1 px-2 w-[70px] rounded-2xl font-bold uppercase "
                                    size="sm"
                                    variant="primary-light"
                                    // disabled={!hasHoldings}
                                    onClick={() => onClickClaim()}
                                >
                                    Claim
                                </Button>
                            </span>
                        </TableRow>
                    );
                })}
            </Table>
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <div className="flex justify-between">
                    <div className="text-2xl">Rebalance Rate</div>
                    <div className="w-3 h-3 cursor-pointer" onClick={() => setShowModal(false)}>
                        <Close />
                    </div>
                </div>
                <br />
                <div>
                    The <b>Rebalance Rate</b> is function of collateral skew in the pool. It can result in a polarised
                    leverage effect at rebalance. The Rebalance Rate is calculated as (long side collateral/short side
                    collateral) - 1.
                </div>
                <br />
                <div>
                    If the <b>Rebalance Rate = 0</b>, there is an equal amount of collateral held in the long and short
                    side of the pool. At rebalance, the winning side gains are neither amplified or reduced.
                </div>
                <br />
                <div>
                    If the <b>Rebalance Rate {'>'} 0</b>, there is more collateral held in the long side of the pool. At
                    rebalance, the short side&apos;s gains are effectively amplified relative to their losses.
                    Conversely, the long side&apos;s gains are effectively reduced.
                </div>
                <br />
                <div>
                    If the <b>Rebalance Rate {'<'} 0</b>, there is more collateral held in the short side of the pool.
                    At rebalance, the short side&apos;s gains are effectively reduced relative to their losses.
                    Conversely, the long side&apos;s gains are effectively amplified.
                </div>
            </Modal>
        </>
    );
}) as React.FC<{
    rows: FarmTableRowData[];
    onClickStake: () => void;
    onClickUnstake: () => void;
    onClickClaim: () => void;
}>;

// const ColoredChangeNumber = (({ number }) => {
//     return (
//         <span className={number >= 0 ? 'text-green-500' : 'text-red-500'}>{`${number >= 0 ? '+' : ''}${number.toFixed(
//             2,
//         )}`}</span>
//     );
// }) as React.FC<{
//     number: number;
// }>;
