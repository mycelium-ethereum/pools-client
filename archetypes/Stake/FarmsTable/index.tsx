import React, { useEffect, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js';
import Button from '@components/General/Button';
import { Table, TableHeader, TableHeaderCell, TableRow, TableRowCell } from '@components/General/TWTable';
import { toApproxCurrency } from '@libs/utils/converters';
import { FarmTableRowData } from '../state';
import { TWModal } from '@components/General/TWModal';
import Close from '/public/img/general/close.svg';
import { Logo, LogoTicker, tokenSymbolToLogoTicker } from '@components/General/Logo';
import Loading from '@components/General/Loading';
import { BalancerPoolAsset } from '@libs/types/Staking';
import { calcAPY, calcBptTokenPrice } from '@tracer-protocol/pools-js';
import { APYTip, RewardsEndedTip } from '@components/Tooltips';
import { TokenToFarmAddressMap } from '@libs/constants';

export default (({ rows, onClickStake, onClickUnstake, onClickClaim, fetchingFarms, rewardsTokenUSDPrices }) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <Table>
                <TableHeader className="uppercase">
                    <tr>
                        <TableHeaderCell>Strategy</TableHeaderCell>
                        <TableHeaderCell>
                            <APYTip>APY</APYTip>/APR
                        </TableHeaderCell>
                        <TableHeaderCell>TVL (USD)</TableHeaderCell>
                        <TableHeaderCell>My Staked (TOKENS/USD)</TableHeaderCell>
                        <TableHeaderCell>My Holdings (TOKENS/USD)</TableHeaderCell>
                        <TableHeaderCell>My Rewards (TCR)</TableHeaderCell>
                        <TableHeaderCell>{/* Empty header for buttons column */}</TableHeaderCell>
                    </tr>
                </TableHeader>
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
            </Table>
            {fetchingFarms ? <Loading className="w-10 mx-auto my-8" /> : null}
            <TWModal open={showModal} onClose={() => setShowModal(false)}>
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
}> = ({ farm, onClickStake, onClickUnstake, onClickClaim, rewardsTokenUSDPrices }) => {
    const tokenPrice = useMemo(
        () =>
            farm?.poolDetails
                ? farm.poolDetails.poolTokenPrice
                : calcBptTokenPrice(farm.stakingTokenSupply, farm?.bptDetails?.tokens),
        [farm],
    );

    const rewardsTokenPrice = rewardsTokenUSDPrices[farm.rewardsTokenAddress] || new BigNumber(0);

    const apr = useMemo(() => {
        const aprNumerator = farm.rewardsPerYear.times(rewardsTokenPrice);
        const aprDenominator = tokenPrice.times(farm.totalStaked);
        return aprDenominator.gt(0) ? aprNumerator.div(aprDenominator) : new BigNumber(0);
    }, [tokenPrice, farm.totalStaked, farm.rewardsPerYear, rewardsTokenPrice]);

    const apy = useMemo(() => calcAPY(apr), [apr]);

    const { bptDetails } = farm;

    useEffect(() => {
        if (
            sessionStorage.getItem('portfolio.selectedToken') !== null &&
            sessionStorage.getItem('portfolio.selectedToken') !== ''
        ) {
            onClickStake(TokenToFarmAddressMap(sessionStorage.getItem('portfolio.selectedToken')));
            sessionStorage.setItem('portfolio.selectedToken', '');
        }
    }, []);

    return (
        <TableRow key={farm.farm} lined>
            <TableRowCell>
                <div className="inline">
                    {farm?.bptDetails ? (
                        <BalancerPoolLogoGroup tokens={bptDetails?.tokens || []} />
                    ) : (
                        <Logo
                            className="inline mr-2"
                            size="md"
                            // since there are no bptDetails, we assume this is a pool token farm
                            ticker={tokenSymbolToLogoTicker(farm.name)}
                        />
                    )}
                </div>
                <div className="inline-flex flex-col justify-center">
                    {farm.link ? (
                        <>
                            <a className="flex" href={farm.link} target="_blank" rel="noopener noreferrer">
                                {farm.name}
                            </a>
                            <a className="flex opacity-50" href={farm.link} target="_blank" rel="noopener noreferrer">
                                {farm.linkText || '(click to view pool)'}
                            </a>
                        </>
                    ) : (
                        <div>{farm.name}</div>
                    )}
                </div>
            </TableRowCell>
            <TableRowCell>
                {farm.rewardsEnded ? (
                    <RewardsEndedTip>N/A</RewardsEndedTip>
                ) : (
                    `${largeDecimal(apy)}% / ${largeDecimal(apr)}%`
                )}
            </TableRowCell>
            <TableRowCell>
                <TableRowCell>{toApproxCurrency(tokenPrice.times(farm.totalStaked))}</TableRowCell>
            </TableRowCell>
            <TableRowCell>
                <div>{farm.myStaked.toFixed(2)}</div>
                <div className="opacity-50">{toApproxCurrency(tokenPrice.times(farm.myStaked))}</div>
            </TableRowCell>
            <TableRowCell>
                <div>{farm.stakingTokenBalance.toFixed(2)}</div>
                <div className="opacity-50">{toApproxCurrency(tokenPrice.times(farm.stakingTokenBalance))}</div>
            </TableRowCell>
            <TableRowCell>
                <span>{farm.myRewards.toFixed(6)}</span>
            </TableRowCell>
            <TableRowCell>
                <Button
                    disabled={farm.rewardsEnded || farm.stakingTokenBalance.eq(0)}
                    className="mx-1 w-[78px] rounded-2xl font-bold uppercase "
                    size="sm"
                    variant="primary-light"
                    onClick={() => onClickStake(farm.farm)}
                >
                    STAKE
                </Button>
                <Button
                    disabled={farm.myStaked.eq(0)}
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
            </TableRowCell>
        </TableRow>
    );
};

const BalancerPoolLogoGroup: React.FC<{ tokens: BalancerPoolAsset[] }> = ({ tokens }) => (
    <>
        {tokens.map((token) => (
            <Logo
                key={`balancer-asset-${token.symbol}`}
                size="md"
                className="inline mr-2"
                ticker={token.isPoolToken ? tokenSymbolToLogoTicker(token.symbol) : (token.symbol as LogoTicker)}
            />
        ))}
    </>
);
