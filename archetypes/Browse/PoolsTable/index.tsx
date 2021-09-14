import Button from '@components/General/Button';
import { Table, TableHeader, TableRow } from '@components/General/TWTable';
import { SideEnum } from '@libs/constants';
import { toApproxCurrency } from '@libs/utils/converters';
import React, { useState } from 'react';
import RebalanceRate from '../RebalanceRate';
import { BrowseTableRowData } from '../state';
import Modal from '@components/General/Modal';
import TimeLeft from '@components/TimeLeft';
import Gas from '@archetypes/Exchange/Gas';
import { InnerInputText, InputContainer } from '@components/General/Input';
import { Input as NumericInput } from '@components/General/Input/Numeric';

import QuestionMark from '/public/img/general/question-mark-circle.svg';
import Close from '/public/img/general/close-black.svg';
import { Logo, tokenSymbolToLogoTicker } from '@components/General';
import { Currency } from '@components/General/Currency';
import { usePool } from '@context/PoolContext';
import { swapDefaults, useSwapContext } from '@context/SwapContext';
import ClaimModal from './ClaimModal';


export default (({ rows }) => {
    const [showModalRebalanceRate, setShowModalRebalanceRate] = useState(false);
    const [showModalStakeToken, setShowModalStakeToken] = useState(false);
    const [showModalUnstakeToken, setShowModalUnstakeToken] = useState(false);
    const [showModalClaimReward, setShowModalClaimReward] = useState(false);
    const [selectedToken, setSelectedToken] = useState<BrowseTableRowData>();

    return (
        <>
            <Table>
                <TableHeader>
                    <span>Token</span>
                    <span>{'Last price (USDC) *'}</span>
                    <span className="flex">
                        {'Next rebalancing rate * '}
                        <span className="cursor-pointer" onClick={() => setShowModalRebalanceRate(true)}>
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
                        <TableRow key={token.address} rowNumber={index}>
                            <span>
                                <Logo className="inline w-[25px] mr-2" ticker={tokenSymbolToLogoTicker(token.symbol)} />
                                {token.symbol}
                            </span>
                            <span>{toApproxCurrency(token.lastPrice)}</span>

                            <RebalanceRate rebalanceRate={token.rebalanceRate} />
                            <TimeLeft targetTime={token.nextRebalance} />
                            <span>{toApproxCurrency(token.totalValueLocked)}</span>
                            <span>
                                <div>{`${token.myHoldings.toFixed(2)}`}</div>
                                <div className="opacity-50">{toApproxCurrency(token.myHoldings * token.lastPrice)}</div>
                            </span>
                            <span>
                                <Button
                                    className="mx-1 w-[78px] rounded-2xl font-bold uppercase "
                                    size="sm"
                                    variant="primary-light"
                                    onClick={() => {
                                        setSelectedToken(token);
                                        setShowModalStakeToken(true);
                                    }}
                                >
                                    STAKE
                                </Button>
                                <Button
                                    className="mx-1 w-[96px] rounded-2xl font-bold uppercase "
                                    size="sm"
                                    variant="primary-light"
                                    onClick={() => {
                                        setSelectedToken(token);
                                        setShowModalUnstakeToken(true);
                                    }}
                                >
                                    UNSTAKE
                                </Button>
                                <Button
                                    className="mx-1 w-[76px] rounded-2xl font-bold uppercase "
                                    size="sm"
                                    variant="primary-light"
                                    onClick={() => {
                                        setSelectedToken(token);
                                        setShowModalClaimReward(true);
                                    }}
                                >
                                    CLAIM
                                </Button>
                            </span>
                        </TableRow>
                    );
                })}
            </Table>
            <p className="mt-2 text-sm text-cool-gray-900">
                * The <strong>Price</strong> and <strong>Rebalancing Rate</strong> displayed for each token are
                indicative only. The values displayed are the estimated <strong>Price</strong> and{' '}
                <strong>Rebalancing Rate</strong> the next rebalance, given the queued buys and sells and estimated
                value transfer. The actual <strong>Price</strong> and <strong>Rebalancing Rate</strong> for each token
                will be calculated and updated at the next rebalalance.
            </p>
            <Modal show={showModalRebalanceRate} onClose={() => setShowModalRebalanceRate(false)}>
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
            </Modal>
            {selectedToken !== undefined ? (
                <>
                    <TokenModal
                        title="Stake Pool Tokens"
                        btnLabel="Stake"
                        token={selectedToken}
                        showModal={showModalStakeToken}
                        setShowModal={setShowModalStakeToken}
                        onClick={()=>{}}
                    />
                    <TokenModal
                        title="Unstake Pool Tokens"
                        btnLabel="Unstake"
                        token={selectedToken}
                        showModal={showModalUnstakeToken}
                        setShowModal={setShowModalUnstakeToken}
                        onClick={()=>{}}
                    />
                    <ClaimModal
                        token={selectedToken}
                        showModal={showModalClaimReward}
                        setShowModal={setShowModalClaimReward}
                        onClick={()=>{}}
                    />
                </>
            ) : "" }
        </>
    );
}) as React.FC<{
    rows: BrowseTableRowData[];
    onClickBuy: (pool: string, side: SideEnum) => void;
    onClickSell: (pool: string, side: SideEnum) => void;
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


const TokenModal = (({ token, title, btnLabel, onClick, showModal, setShowModal }) => {
    const hasHoldings = token.myHoldings > 0;

    const { swapState = swapDefaults, swapDispatch } = useSwapContext();
    const { selectedPool, side, amount, invalidAmount } = swapState;
    const pool = usePool(selectedPool);

    return (
        <>
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <div className="flex justify-between">
                    <div className="text-2xl">{title}</div>
                    <Gas />
                    <div className="w-3 h-3 ml-4 cursor-pointer self-center" onClick={() => setShowModal(false)}>
                        <Close />
                    </div>
                </div>
                <p className="mb-4 mt-6 text-black font-semibold">Amount</p>
                <InputContainer error={false /* invalidAmount.isInvalid */}>
                    <NumericInput
                        className="w-full h-full text-base font-normal "
                        value={amount}
                        onUserInput={(val) => {
                            // TODO: 
                            // e.g. swapDispatch({ type: 'setAmount', value: parseFloat(val) });
                        }}
                    />
                    <InnerInputText>
                        <Currency label={token.symbol} ticker={tokenSymbolToLogoTicker(token.symbol)} className="shadow-md" />
                        <div
                            className="m-auto cursor-pointer hover:underline"
                            onClick={(_e) =>
                                // TODO:
                                // e.g. swapDispatch({ type: 'setAmount', value: pool.quoteToken.balance.toNumber() })
                                null
                            }
                        >
                            Max
                        </div>
                    </InnerInputText>
                </InputContainer>
                {/* TODO:  */}
                <div className={ (false /* invalidAmount.isInvalid */ ? 'text-red-500 ' : '') + 'mt-4 mb-12'}>
                    { false /* invalidAmount.isInvalid */ &&  ""/* invalidAmount.message */ ? (
                            ""/* invalidAmount.message */
                    ) : (
                        <>
                            {/* TODO: this probably isn't correct */}
                            {`Available: ${toApproxCurrency(pool.quoteToken.balance)}`}
                            {!!amount ? ` > ${toApproxCurrency(pool.quoteToken.balance.minus(amount))}` : ''}
                        </>
                    )}
                </div>
                <Button
                    size="lg"
                    variant="primary"
                    // disabled={!selectedPool || !amount || invalidAmount.isInvalid}
                    disabled={!hasHoldings}
                    onClick={(_e) => onClick()}
                >
                    {btnLabel}
                </Button>
            </Modal>
        </>
    );

}) as React.FC<{
    token: BrowseTableRowData;
    title: String;
    btnLabel: String;
    showModal: Boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
    ;
    onClick: () => void;
}>;
