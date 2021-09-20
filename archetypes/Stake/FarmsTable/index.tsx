import React, { useState } from 'react';
import BigNumber from 'bignumber.js';
import Button from '@components/General/Button';
import { Table, TableHeader, TableRow } from '@components/General/TWTable';
import { toApproxCurrency } from '@libs/utils/converters';
import { FarmTableRowData } from '../state';
import Modal from '@components/General/Modal';
import Close from '/public/img/general/close-black.svg';
import { Logo, tokenSymbolToLogoTicker } from '@components/General/Logo';
import useTokenPrice from '@libs/hooks/useTokenPrice';
import Loading from '@components/General/Loading';

// TODO: use an actual price
const TCR_PRICE = new BigNumber('0.10');

export default (({ rows, onClickStake, onClickUnstake, onClickClaim, fetchingFarms }) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <Table>
                <TableHeader className="uppercase">
                    <span>Strategy</span>
                    <span>APR</span>
                    <span>TVL (USDC)</span>
                    <span>My Staked (TOKENS/USDC)</span>
                    <span>My Holdings (TOKENS/USDC)</span>
                    <span>My Rewards (TCR)</span>
                    <span>{/* Empty header for buttons column */}</span>
                </TableHeader>
                {rows.map((farm, index) => {
                    return (
                        <PoolRow
                            key={`${farm}-${index}`}
                            farm={farm}
                            index={index}
                            onClickClaim={onClickClaim}
                            onClickStake={onClickStake}
                            onClickUnstake={onClickUnstake}
                        />
                    );
                })}
            </Table>
            {fetchingFarms ? <Loading className="w-10 mx-auto my-8" /> : null}
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
    onClickStake: (farmAddress: string) => void;
    onClickUnstake: (farmAddress: string) => void;
    onClickClaim: (farmAddress: string) => void;
    fetchingFarms: boolean;
}>;

const PoolRow: React.FC<{
    farm: FarmTableRowData;
    index: number;
    onClickStake: (farmAddress: string) => void;
    onClickUnstake: (farmAddress: string) => void;
    onClickClaim: (farmAddress: string) => void;
}> = ({ farm, onClickStake, onClickUnstake, onClickClaim, index }) => {
    // totalEmittedTokensPerYear x priceOfRewardsTokens) / (totalSupply x priceOfStakingTokens

    // although this is wasteful, we must always call hooks the same number of times between renders
    const calculateTokenPrice = (farm: FarmTableRowData) => {
        if (!farm.slpDetails) {
            return new BigNumber(0);
        }

        const { token0, token1 } = farm.slpDetails;

        const token0USDCPrice = token0.isPoolToken ? useTokenPrice(token0.address) : token0.usdcPrice;
        const token1USDCPrice = token1.isPoolToken ? useTokenPrice(token1.address) : token1.usdcPrice;

        const token0USDCValue = token0USDCPrice.times(token0.reserves);
        const token1USDCValue = token1USDCPrice.times(token1.reserves);

        const slpPoolCombinedUSDCValue = token0USDCValue.plus(token1USDCValue);

        if (farm.stakingTokenSupply.eq(0)) {
            return new BigNumber(0);
        }

        return slpPoolCombinedUSDCValue.div(farm.stakingTokenSupply);
    };

    const tokenPrice = calculateTokenPrice(farm);

    const aprNumerator = farm.rewardsPerYear.times(TCR_PRICE);
    const aprDenominator = tokenPrice.times(farm.totalStaked);

    const apr = aprDenominator.gt(0) ? aprNumerator.div(aprDenominator) : new BigNumber(0);

    const { slpDetails } = farm;

    return (
        <TableRow key={farm.farm} rowNumber={index}>
            <span>
                {farm.isPoolTokenFarm ? (
                    <Logo className="inline w-[25px] mr-2" ticker={tokenSymbolToLogoTicker(farm.name)} />
                ) : (
                    <>
                        <Logo
                            className="inline w-[25px] mr-2"
                            ticker={tokenSymbolToLogoTicker(
                                (slpDetails?.token0?.isPoolToken
                                    ? slpDetails?.token0?.symbol
                                    : slpDetails?.token1?.symbol) || '',
                            )}
                        />
                        <Logo
                            className="inline w-[25px] mr-2"
                            ticker={tokenSymbolToLogoTicker(
                                (slpDetails?.token0?.isPoolToken
                                    ? slpDetails?.token1?.symbol
                                    : slpDetails?.token0?.symbol) || '',
                            )}
                        />
                    </>
                )}
                {farm.name}
            </span>
            <span>{apr.times(100).toFixed(2)}%</span>
            <span>
                <span>{toApproxCurrency(tokenPrice.times(farm.totalStaked))}</span>
            </span>
            <span>
                <span>{farm.myStaked.toFixed(2)}</span>
                {' / '}
                <span>{toApproxCurrency(tokenPrice.times(farm.myStaked))}</span>
            </span>
            <span>
                <span>{farm.stakingTokenBalance.toFixed(2)}</span>
                {' / '}
                <span>{toApproxCurrency(tokenPrice.times(farm.stakingTokenBalance))}</span>
            </span>
            <span>
                <span>{farm.myRewards.toFixed(6)}</span>
            </span>
            <span>
                <Button
                    disabled={farm.stakingTokenBalance.eq(0)}
                    className="mx-1 w-[78px] rounded-2xl font-bold uppercase "
                    size="sm"
                    variant="primary-light"
                    onClick={() => onClickStake(farm.farm)}
                >
                    STAKE
                </Button>
                <Button
                    disabled={farm.myStaked === 0}
                    className="mx-1 w-[96px] rounded-2xl font-bold uppercase "
                    size="sm"
                    variant="primary-light"
                    onClick={() => onClickUnstake(farm.farm)}
                >
                    UNSTAKE
                </Button>
                <Button
                    disabled={farm.myRewards.eq(0)}
                    className="mx-1 w-[76px] rounded-2xl font-bold uppercase "
                    size="sm"
                    variant="primary-light"
                    onClick={() => onClickClaim(farm.farm)}
                >
                    CLAIM
                </Button>
            </span>
        </TableRow>
    );
};
