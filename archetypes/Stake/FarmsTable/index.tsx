import BigNumber from 'bignumber.js';
import React, { useMemo, useState } from 'react';
import Button from '~/components/General/Button';
import Loading from '~/components/General/Loading';
import { Logo, tokenSymbolToLogoTicker } from '~/components/General/Logo';
import { TWModal } from '~/components/General/TWModal';
import { Table, TableHeader, TableHeaderCell, TableRow, TableRowCell } from '~/components/General/TWTable';
import { PoolStatusBadge, PoolStatusBadgeContainer } from '~/components/PoolStatusBadge';
import { RewardsEndedTip, StakingTvlTip } from '~/components/Tooltips';
import { ARB_MYC_TOKEN_ADDRESS, ARB_TCR_TOKEN_ADDRESS } from '~/constants/general';
import { PoolStatus } from '~/types/pools';
import { toApproxCurrency } from '~/utils/converters';
import { getBaseAsset } from '~/utils/poolNames';
import { FarmTableRowData } from '../state';
import Close from '/public/img/general/close.svg';

export enum StakeActionEnum {
    stake = 'Stake',
    unstake = 'Unstake',
    claim = 'Claim',
}

const rewardsTokenSymbolByAddress: Record<string, string> = {
    [ARB_MYC_TOKEN_ADDRESS]: 'MYC',
    [ARB_TCR_TOKEN_ADDRESS]: 'TCR',
};

export default (({ rows, onClickStake, onClickUnstake, onClickClaim, fetchingFarms, rewardsTokenUSDPrices }) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <Table>
                <TableHeader className="uppercase">
                    <tr>
                        <TableHeaderCell>Strategy</TableHeaderCell>
                        <TableHeaderCell>APR</TableHeaderCell>
                        <TableHeaderCell>
                            <StakingTvlTip>
                                <div>TVL (USD)</div>
                            </StakingTvlTip>
                        </TableHeaderCell>
                        <TableHeaderCell>My Staked (TOKENS/USD)</TableHeaderCell>
                        <TableHeaderCell>My Holdings (TOKENS/USD)</TableHeaderCell>
                        <TableHeaderCell>My Rewards</TableHeaderCell>
                        <TableHeaderCell>{/* Empty header for buttons column */}</TableHeaderCell>
                    </tr>
                </TableHeader>
                <tbody>
                    {rows.map((farm) => {
                        return (
                            <PoolRow
                                key={`${farm.farm}`}
                                farm={farm}
                                rewardsTokenUSDPrices={rewardsTokenUSDPrices}
                                onClickClaim={onClickClaim}
                                onClickStake={onClickStake}
                                onClickUnstake={onClickUnstake}
                            />
                        );
                    })}
                </tbody>
            </Table>
            {fetchingFarms ? (
                <div className="text-theme-primary">
                    <Loading className="mx-auto my-8 w-10 text-theme-border" />
                </div>
            ) : null}
            <TWModal open={showModal} onClose={() => setShowModal(false)}>
                <div className="flex justify-between">
                    <div className="text-2xl">Rebalance Rate</div>
                    <div className="h-3 w-3 cursor-pointer" onClick={() => setShowModal(false)}>
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
            </TWModal>
        </>
    );
}) as React.FC<{
    rows: FarmTableRowData[];
    onClickStake: (farmAddress: string) => void;
    onClickUnstake: (farmAddress: string) => void;
    onClickClaim: (farmAddress: string) => void;
    fetchingFarms: boolean;
    rewardsTokenUSDPrices: Record<string, BigNumber>;
}>;

const LARGE_DECIMAL = 10000000000;
const largeDecimal: (num: BigNumber) => string = (num) => {
    if (num.gt(LARGE_DECIMAL)) {
        return `> ${LARGE_DECIMAL}`;
    } else {
        return num.times(100).toFixed(2);
    }
};

const PoolRow: React.FC<{
    farm: FarmTableRowData;
    rewardsTokenUSDPrices: Record<string, BigNumber>;
    onClickStake: (farmAddress: string) => void;
    onClickUnstake: (farmAddress: string) => void;
    onClickClaim: (farmAddress: string) => void;
}> = ({ farm, onClickUnstake, onClickClaim, rewardsTokenUSDPrices }) => {
    const stakingTokenPrice = useMemo(() => farm.stakingTokenPrice || new BigNumber(1), [farm]);

    const rewardsTokenPrice = rewardsTokenUSDPrices[farm.rewardsTokenAddress] || new BigNumber(0);

    const apr = useMemo(() => {
        const aprNumerator = farm.rewardsPerYear.times(rewardsTokenPrice);
        const aprDenominator = stakingTokenPrice.times(farm.totalStaked);
        return aprDenominator.gt(0) ? aprNumerator.div(aprDenominator) : new BigNumber(0);
    }, [stakingTokenPrice, farm.totalStaked, farm.rewardsPerYear, rewardsTokenPrice]);

    return (
        <TableRow key={farm.farm} lined>
            <TableRowCell>
                <PoolStatusBadgeContainer>
                    <div className="inline self-center">
                        <Logo
                            className="mr-2 inline"
                            size="md"
                            ticker={tokenSymbolToLogoTicker(
                                farm.isBPTFarm ? getBaseAsset(farm.poolDetails.name) : farm.name,
                            )}
                        />
                    </div>
                    <div className="mr-2 inline-flex flex-col justify-center">
                        {farm.link ? (
                            <>
                                <a className="flex" href={farm.link} target="_blank" rel="noopener noreferrer">
                                    {farm.name}
                                </a>
                                <a
                                    className="flex opacity-50"
                                    href={farm.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {farm.linkText || '(click to view pool)'}
                                </a>
                            </>
                        ) : (
                            <div>{farm.name}</div>
                        )}
                    </div>
                    <div className="self-center">
                        <PoolStatusBadge
                            status={farm.rewardsEnded ? PoolStatus.Deprecated : PoolStatus.Live}
                            text={farm.rewardsEnded ? 'Ended' : 'Active'}
                        />
                    </div>
                </PoolStatusBadgeContainer>
            </TableRowCell>
            <TableRowCell>
                {farm.rewardsEnded ? <RewardsEndedTip>N/A</RewardsEndedTip> : `${largeDecimal(apr)}%`}
            </TableRowCell>
            <TableRowCell>
                <div>{toApproxCurrency(stakingTokenPrice.times(farm.totalStaked))}</div>
            </TableRowCell>
            <TableRowCell>
                <div>{farm.myStaked.toFixed(2)}</div>
                <div className="opacity-50">{toApproxCurrency(stakingTokenPrice.times(farm.myStaked))}</div>
            </TableRowCell>
            <TableRowCell>
                <div>{farm.stakingTokenBalance.toFixed(2)}</div>
                <div className="opacity-50">{toApproxCurrency(stakingTokenPrice.times(farm.stakingTokenBalance))}</div>
            </TableRowCell>
            <TableRowCell>
                <span>
                    {farm.myRewards.toFixed(6)} {rewardsTokenSymbolByAddress[farm.rewardsTokenAddress]}
                </span>
            </TableRowCell>
            <TableRowCell>
                {/* <Button
                    disabled={farm.rewardsEnded || farm.stakingTokenBalance.eq(0)}
                    className="mx-1 w-[78px] font-bold uppercase"
                    size="xs"
                    variant="primary-light"
                    onClick={() => {
                        onClickStake(farm.farm);
                    }}
                >
                    STAKE
                </Button> */}
                <Button
                    disabled={farm.myStaked.eq(0)}
                    className="mx-1 w-[96px] font-bold uppercase"
                    size="xs"
                    variant="primary-light"
                    onClick={() => {
                        onClickUnstake(farm.farm);
                    }}
                >
                    UNSTAKE
                </Button>
                <Button
                    disabled={farm.myRewards.eq(0)}
                    className="mx-1 w-[76px] font-bold uppercase"
                    size="xs"
                    variant="primary-light"
                    onClick={() => {
                        onClickClaim(farm.farm);
                    }}
                >
                    CLAIM
                </Button>
            </TableRowCell>
        </TableRow>
    );
};
