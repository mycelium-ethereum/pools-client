import { CommitActionEnum, NETWORKS, SideEnum } from '@tracer-protocol/pools-js';
import BigNumber from 'bignumber.js';
import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import shallow from 'zustand/shallow';

import { Logo, LogoTicker, tokenSymbolToLogoTicker } from '~/components/General';
import Button from '~/components/General/Button';
import {
    ImportedIndicator,
    Table,
    TableHeader,
    TableHeaderCell,
    TableRow,
    TableRowCell,
} from '~/components/General/TWTable';
import { OracleDetailsBadge, OracleDetailsBadgeContainer } from '~/components/OracleDetailsBadge';
import TimeLeft from '~/components/TimeLeft';
import Actions from '~/components/TokenActions';
import { StyledTooltip } from '~/components/Tooltips';
import { default as UpOrDown } from '~/components/UpOrDown';

import Clock from '~/public/img/general/clock.svg';
import Info from '~/public/img/general/info.svg';
import LinkIcon from '~/public/img/general/link.svg';
import { selectMarketSpotPrices } from '~/store/MarketSpotPricesSlice';
import { selectImportedPools } from '~/store/PoolsSlice';
import { Theme } from '~/store/ThemeSlice/themes';
import { selectWeb3Info } from '~/store/Web3Slice';
import { useStore } from '~/store/main';
import { BlockExplorerAddressType } from '~/types/blockExplorers';
import { PoolStatus } from '~/types/pools';
import { constructBalancerLink } from '~/utils/balancer';
import { calcPercentageDifference, toApproxCurrency } from '~/utils/converters';
import { classNames } from '~/utils/helpers';
import { getBaseAssetFromMarket } from '~/utils/poolNames';
import PoolDetailsModal from '../PoolDetailsModal';
import { BrowseTableRowData, DeltaEnum } from '../state';

const SkewTip: React.FC = ({ children }) => (
    <StyledTooltip title="An indication of the difference between collateral in the long and short side of the pool. Pool Skew is calculated by dividing the TVL in the long side by the TVL in the short side.">
        {children}
    </StyledTooltip>
);

const EffectiveLeverageTip: React.FC = ({ children }) => (
    <StyledTooltip title="The leverage you will receive at the next rebalance depending on if the price of the underlying asset increases or decreases since the last rebalance.">
        {children}
    </StyledTooltip>
);

const SpotPriceTip: React.FC = ({ children }) => (
    <StyledTooltip title="The price of the tracked asset before subjecting it to any Data Manipulations.">
        {children}
    </StyledTooltip>
);
const TracerTip: React.FC = ({ children }) => (
    <StyledTooltip title="The current token price on Mycelium. Please note that the price may change as minting the token is not immediate.">
        {children}
    </StyledTooltip>
);

const IndexPriceTip: React.FC = ({ children }) => (
    <StyledTooltip title="The value used for settling this market.">{children}</StyledTooltip>
);
const BalancerTip: React.FC = ({ children }) => (
    <StyledTooltip title="The current token price on Balancer. You can buy the Pool Token immediately at this price (slippage may impact final pricing)">
        {children}
    </StyledTooltip>
);

const CommittmentTip: React.FC = ({ children }) => (
    <StyledTooltip title="By opening a position now on Mycelium, you will receive the tokens later. You can open a position immediately by trading on Balancer.">
        {children}
    </StyledTooltip>
);

const NoBalancerPoolTip: React.FC<{ market: string }> = ({ children, market }) => (
    <StyledTooltip title={`There are no Balancer pools for the ${market} market yet.`}>{children}</StyledTooltip>
);

const TradeOnBalancerTip: React.FC = ({ children }) => (
    <StyledTooltip title={`Trade instantly on Balancer`}>{children}</StyledTooltip>
);

const EstimatedTVLTip: React.FC<{
    estimatedTvl: number;
    currentTvl: number;
}> = ({ children, estimatedTvl, currentTvl }) => (
    <StyledTooltip
        title={
            <>
                <strong>After all pending commits</strong>
                <div>Estimated TVL: {toApproxCurrency(estimatedTvl)}</div>
                <div>
                    Change: {estimatedTvl > currentTvl ? '+' : ''}
                    {toApproxCurrency(estimatedTvl - currentTvl)}
                </div>
            </>
        }
    >
        {children}
    </StyledTooltip>
);

const EstimatedSkewTip: React.FC<{
    estimatedSkew: number;
    currentSkew: number;
}> = ({ children, estimatedSkew, currentSkew }) => (
    <StyledTooltip
        title={
            <>
                <strong>After all pending commits</strong>
                <div>Estimated Skew: {estimatedSkew.toFixed(3)}</div>
                <div>
                    Change: {estimatedSkew > currentSkew ? '+' : ''}
                    {(estimatedSkew - currentSkew).toFixed(3)}
                </div>
            </>
        }
    >
        {children}
    </StyledTooltip>
);

const ClockIcon = styled(Clock)`
    margin-left: 5px;
    width: 16px;
    &:hover {
        cursor: pointer;
    }
`;

const InfoIcon = styled(Info)`
    margin-left: 15px;

    &:hover {
        cursor: pointer;
    }

    path {
        fill: ${({ theme }) => {
            switch (theme.theme) {
                case Theme.Light:
                    return '#111928';
                default:
                    '#fff';
            }
        }};
    }
`;

// Note: hacky
const percentilePools: Record<string, boolean> = {
    '0xDDC2b61C1CC309B97B16704F785D27Ae35c6335b': true,
};

type TProps = {
    onClickMintBurn: (pool: string, side: SideEnum, commitAction: CommitActionEnum) => void;
    showNextRebalance: boolean;
    deltaDenotation: DeltaEnum;
};

export const PoolsTable = ({
    rows,
    onClickMintBurn,
    showNextRebalance,
    deltaDenotation,
    oneDayVolume,
}: {
    rows: BrowseTableRowData[];
    oneDayVolume: BigNumber;
} & TProps): JSX.Element => {
    const { account, network = NETWORKS.ARBITRUM } = useStore(selectWeb3Info, shallow);
    const [showModalPoolDetails, setShowModalPoolDetails] = useState(false);
    const [poolDetails, setPoolDetails] = useState<any>({});
    const marketSpotPrices = useStore(selectMarketSpotPrices, shallow);

    const handlePoolDetailsClick = useCallback((data: BrowseTableRowData) => {
        setShowModalPoolDetails(true);
        setPoolDetails(data);
    }, []);

    const isPercentilePool = percentilePools[rows[0].address];

    return (
        <>
            <Table>
                <TableHeader className="align-baseline">
                    <TableRow className="border-none">
                        <TableHeaderCell
                            className="rounded-xl bg-cool-gray-50 py-0 dark:bg-theme-background"
                            colSpan={14}
                        >
                            <div className="flex justify-between text-base">
                                <div className="flex pr-10">
                                    <div className="flex">
                                        <Logo
                                            className="my-auto mr-3"
                                            size="lg"
                                            ticker={getBaseAssetFromMarket(rows[0].marketSymbol) as LogoTicker}
                                        />
                                    </div>
                                    <div className="my-auto">
                                        <div className="text-lg font-bold normal-case">{rows[0].marketSymbol}</div>
                                    </div>
                                </div>
                                <div className="flex">
                                    <div className="px-10">
                                        <div className="font-bold">
                                            {marketSpotPrices[rows[0].marketSymbol]
                                                ? isPercentilePool
                                                    ? `${marketSpotPrices[rows[0].marketSymbol].toFixed(2)} %`
                                                    : toApproxCurrency(marketSpotPrices[rows[0].marketSymbol])
                                                : '-'}
                                        </div>
                                        <SpotPriceTip>
                                            <div className="text-sm text-cool-gray-500 dark:text-cool-gray-400">
                                                {isPercentilePool ? 'SPOT RATE' : 'SPOT PRICE'}
                                            </div>
                                        </SpotPriceTip>
                                    </div>
                                    <div className="px-10">
                                        <div className="font-bold">{toApproxCurrency(oneDayVolume)}</div>
                                        <div className="text-sm text-cool-gray-500 dark:text-cool-gray-400">
                                            24H Volume
                                        </div>
                                    </div>
                                    <div className="px-10">
                                        <div className="font-bold">{rows.length}</div>
                                        <div className="text-sm text-cool-gray-500 dark:text-cool-gray-400">
                                            NUMBER OF POOLS
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TableHeaderCell>
                    </TableRow>
                    <TableRow className="h-5" />
                    <TableRow>
                        {/* Pools  Cols */}
                        <TableHeaderCell
                            noPaddingBottom
                            className="w-1/12 pb-0 dark:bg-theme-background 2xl:whitespace-nowrap"
                        >
                            Leverage
                        </TableHeaderCell>
                        <TableHeaderCell
                            noPaddingBottom
                            className="w-1/12 dark:bg-theme-background 2xl:whitespace-nowrap"
                        >
                            Collateral
                        </TableHeaderCell>
                        <TableHeaderCell noPaddingBottom className="w-1/12 whitespace-nowrap">
                            {/* TODO: do something else when we have a pool using a non-USDC underlying feed */}
                            <IndexPriceTip>{isPercentilePool ? 'INDEX RATE' : 'INDEX PRICE (USD)'}</IndexPriceTip>
                        </TableHeaderCell>
                        <TableHeaderCell noPaddingBottom className={showNextRebalance ? 'w-1/12' : 'w-3/12'}>
                            <SkewTip>
                                <div>{'Skew'}</div>
                            </SkewTip>
                        </TableHeaderCell>
                        {showNextRebalance ? (
                            <TableHeaderCell noPaddingBottom className="w-2/12">
                                <CommittmentTip>
                                    <div>{'Trade Wait Time'}</div>
                                </CommittmentTip>
                            </TableHeaderCell>
                        ) : null}
                        {/* Token Cols */}
                        <TableHeaderCell noPaddingBottom className="w-16" size="sm">
                            {'Side'}
                        </TableHeaderCell>
                        <TableHeaderCell noPaddingBottom size="sm" className={'w-2/12 whitespace-nowrap'}>
                            {'TVL (USD)'}
                        </TableHeaderCell>
                        <TableHeaderCell noPaddingBottom size="sm" colSpan={2} className={'w-[12%] whitespace-nowrap'}>
                            <EffectiveLeverageTip>
                                <div>{'Effective Leverage'}</div>
                            </EffectiveLeverageTip>
                        </TableHeaderCell>
                        <TableHeaderCell
                            noPaddingBottom
                            size="sm"
                            colSpan={showNextRebalance ? 2 : 1}
                            className={'whitespace-nowrap'}
                        >
                            {'Token Price (USD)'}
                        </TableHeaderCell>
                        {showNextRebalance && !!account ? (
                            <TableHeaderCell noPaddingBottom size="sm">
                                <div className="whitespace-nowrap capitalize">{'MY HOLDINGS'}</div>
                            </TableHeaderCell>
                        ) : null}
                        <TableHeaderCell>{/* Empty header for buttons column */}</TableHeaderCell>
                    </TableRow>
                    <TableRow className="border-none">
                        {/* Pools  Cols */}
                        <TableHeaderCell colSpan={showNextRebalance ? 5 : 4} />

                        {/* Token Cols */}
                        <TableHeaderCell size="sm" colSpan={2} />
                        <TableHeaderCell size="sm-x">
                            <div className="capitalize text-cool-gray-400">{'Gains'}</div>
                        </TableHeaderCell>
                        <TableHeaderCell className="text-cool-gray-400" size="sm-x">
                            <div className="capitalize text-cool-gray-400">{'Losses'}</div>
                        </TableHeaderCell>
                        <TableHeaderCell className="text-cool-gray-400" size="sm-x">
                            <TracerTip>
                                <div className="capitalize text-cool-gray-400">{'Mycelium'}</div>
                            </TracerTip>
                        </TableHeaderCell>
                        {showNextRebalance ? (
                            <TableHeaderCell className="text-cool-gray-400" size="sm-x">
                                <BalancerTip>
                                    <div className="capitalize text-cool-gray-400">{'Balancer'}</div>
                                </BalancerTip>
                            </TableHeaderCell>
                        ) : null}
                        <TableHeaderCell colSpan={showNextRebalance && !!account ? 2 : 1} />
                    </TableRow>
                </TableHeader>
                <tbody>
                    {rows.map((pool) => {
                        return (
                            <PoolRow
                                pool={pool}
                                onClickMintBurn={onClickMintBurn}
                                onClickShowPoolDetailsModal={handlePoolDetailsClick}
                                showNextRebalance={showNextRebalance}
                                key={pool.address}
                                account={account}
                                deltaDenotation={deltaDenotation}
                            />
                        );
                    })}
                </tbody>
            </Table>
            <PoolDetailsModal
                open={showModalPoolDetails}
                onClose={() => void setShowModalPoolDetails(false)}
                poolDetails={poolDetails}
                network={network}
            />
        </>
    );
};

export default PoolsTable;

const PoolRow: React.FC<
    {
        pool: BrowseTableRowData;
        account: string | undefined;
        onClickShowPoolDetailsModal: (pool: BrowseTableRowData) => void;
    } & TProps
> = ({ pool, account, onClickMintBurn, showNextRebalance, deltaDenotation, onClickShowPoolDetailsModal }) => {
    const importedPools = useStore(selectImportedPools);
    const isImportedPool = useMemo(() => importedPools.some((v) => v.address === pool.address), [pool]);

    return (
        <>
            <TableRow lined isImported={isImportedPool}>
                {/** Pool rows */}
                <TableRowCell rowSpan={2}>
                    {isImportedPool ? <ImportedIndicator /> : null}
                    <div className="mb-1 flex font-bold">
                        <OracleDetailsBadgeContainer>
                            <div className="mr-2 text-lg">{pool.leverage}</div>
                            <OracleDetailsBadge oracleDetails={pool.oracleDetails} />
                        </OracleDetailsBadgeContainer>
                    </div>
                </TableRowCell>
                <TableRowCell rowSpan={2}>
                    <div className="flex items-center">
                        {pool.collateralAsset}
                        <InfoIcon onClick={() => onClickShowPoolDetailsModal(pool)} />
                    </div>
                </TableRowCell>
                <TableRowCell rowSpan={2}>
                    {showNextRebalance ? (
                        <>
                            <div>
                                {percentilePools[pool.address]
                                    ? `${pool.oraclePrice.toFixed(2)} %`
                                    : toApproxCurrency(pool.oraclePrice)}
                            </div>
                            <div className="mt-1">
                                <UpOrDownWithTooltip
                                    oldValue={pool.lastPrice}
                                    newValue={pool.oraclePrice}
                                    deltaDenotation={deltaDenotation}
                                    poolTicker={pool.name}
                                    tooltipMetric={UpOrDownTipMetric.IndexPrice}
                                    showNextRebalance={showNextRebalance}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div>{toApproxCurrency(pool.pastUpkeep.newPrice)}</div>
                            <div className="mt-1">
                                <UpOrDownWithTooltip
                                    oldValue={pool.pastUpkeep.oldPrice}
                                    newValue={pool.pastUpkeep.newPrice}
                                    deltaDenotation={deltaDenotation}
                                    poolTicker={pool.name}
                                    tooltipMetric={UpOrDownTipMetric.IndexPrice}
                                    showNextRebalance={showNextRebalance}
                                />
                            </div>
                        </>
                    )}
                </TableRowCell>
                <TableRowCell
                    rowSpan={2}
                    className={classNames('relative z-[1] bg-opacity-0', !showNextRebalance ? 'w-1/6' : '')}
                >
                    {showNextRebalance ? (
                        <>
                            <div className="flex">
                                {pool.nextSkew.toFixed(3)}
                                {pool.poolStatus === PoolStatus.Live ? (
                                    <EstimatedSkewTip estimatedSkew={pool.estimatedSkew} currentSkew={pool.skew}>
                                        <ClockIcon />
                                    </EstimatedSkewTip>
                                ) : null}
                            </div>
                            <div className="mt-1">
                                <UpOrDownWithTooltip
                                    oldValue={pool.skew}
                                    currency={false}
                                    newValue={pool.nextSkew}
                                    deltaDenotation={deltaDenotation}
                                    poolTicker={pool.name}
                                    tooltipMetric={UpOrDownTipMetric.ExpectedSkew}
                                    showNextRebalance={showNextRebalance}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div>{pool.skew.toFixed(3)}</div>
                            <div className="mt-1">
                                <UpOrDownWithTooltip
                                    oldValue={pool.antecedentUpkeep.skew}
                                    newValue={pool.pastUpkeep.skew}
                                    deltaDenotation={deltaDenotation}
                                    poolTicker={pool.name}
                                    tooltipMetric={UpOrDownTipMetric.Skew}
                                    currency={false}
                                    showNextRebalance={showNextRebalance}
                                />
                            </div>
                        </>
                    )}
                </TableRowCell>
                {showNextRebalance ? (
                    <TableRowCell rowSpan={2}>
                        <TimeLeft targetTime={pool.expectedExecution} />
                    </TableRowCell>
                ) : null}

                {/** Token rows */}
                <TokenRows
                    side={SideEnum.long}
                    showNextRebalance={showNextRebalance}
                    onClickMintBurn={onClickMintBurn}
                    antecedentUpkeepTokenInfo={{
                        tokenPrice: pool.antecedentUpkeep.longTokenPrice,
                        tokenBalance: pool.antecedentUpkeep.longTokenBalance,
                    }}
                    pastUpkeepTokenInfo={{
                        tokenPrice: pool.pastUpkeep.longTokenPrice,
                        tokenBalance: pool.pastUpkeep.longTokenBalance,
                    }}
                    account={account}
                    tokenInfo={pool.longToken}
                    deltaDenotation={deltaDenotation}
                    leverage={pool.leverage}
                    address={pool.address}
                    decimals={pool.decimals}
                    settlementTokenSymbol={pool.settlementTokenSymbol}
                    poolTicker={pool.name}
                    isImportedPool={isImportedPool}
                />
            </TableRow>
            <TableRow lined isImported={isImportedPool}>
                <TokenRows
                    side={SideEnum.short}
                    onClickMintBurn={onClickMintBurn}
                    showNextRebalance={showNextRebalance}
                    account={account}
                    antecedentUpkeepTokenInfo={{
                        tokenPrice: pool.antecedentUpkeep.shortTokenPrice,
                        tokenBalance: pool.antecedentUpkeep.shortTokenBalance,
                    }}
                    pastUpkeepTokenInfo={{
                        tokenPrice: pool.pastUpkeep.shortTokenPrice,
                        tokenBalance: pool.pastUpkeep.shortTokenBalance,
                    }}
                    tokenInfo={pool.shortToken}
                    deltaDenotation={deltaDenotation}
                    leverage={pool.leverage}
                    address={pool.address}
                    decimals={pool.decimals}
                    settlementTokenSymbol={pool.settlementTokenSymbol}
                    poolTicker={pool.name}
                    isImportedPool={isImportedPool}
                />
            </TableRow>
        </>
    );
};

// const longStyles = 'bg-green-50 dark:bg-dark-green matrix:bg-dark-green';
// const longStyles = 'linear-gradient(90deg, rgba(140, 198, 63, 0.2) 0%, rgba(140, 198, 63, 0) 73%);';
const longStyles = 'bg-gradient-to-r from-long-gradient-start';
const shortStyles = 'bg-gradient-to-r from-short-gradient-start';

const TokenRows: React.FC<
    {
        side: SideEnum;
        tokenInfo: BrowseTableRowData['longToken'] | BrowseTableRowData['shortToken'];
        settlementTokenSymbol: string;
        leverage: number;
        address: string;
        decimals: number;
        account: string | undefined;
        pastUpkeepTokenInfo: {
            tokenPrice: number;
            tokenBalance: number;
        };
        antecedentUpkeepTokenInfo: {
            tokenPrice: number;
            tokenBalance: number;
        };
        poolTicker: string;
        isImportedPool: boolean;
    } & TProps
> = ({
    side,
    tokenInfo,
    settlementTokenSymbol,
    leverage,
    address: poolAddress,
    account,
    decimals,
    onClickMintBurn,
    showNextRebalance,
    deltaDenotation,
    antecedentUpkeepTokenInfo,
    pastUpkeepTokenInfo,
    poolTicker,
    isImportedPool,
}) => {
    const isLong = side === SideEnum.long;
    const styles = isLong ? longStyles : shortStyles;

    return (
        <>
            <TableRowCell size={'sm'} className={classNames(styles, isLong ? 'text-up-green' : 'text-down-red')}>
                {isLong ? 'Long' : 'Short'}
            </TableRowCell>
            <TableRowCell size={'sm'}>
                {showNextRebalance ? (
                    <>
                        <div className="flex">
                            <div className="mr-1">{toApproxCurrency(tokenInfo.nextTvl)}</div>
                            <UpOrDownWithTooltip
                                oldValue={tokenInfo.tvl}
                                newValue={tokenInfo.nextTvl}
                                deltaDenotation={deltaDenotation}
                                poolTicker={poolTicker}
                                tooltipMetric={UpOrDownTipMetric.TVL}
                                tokenMetricSide={side}
                                showNextRebalance={showNextRebalance}
                            />
                            {tokenInfo.poolStatus === PoolStatus.Live ? (
                                <EstimatedTVLTip estimatedTvl={tokenInfo.estimatedTvl} currentTvl={tokenInfo.tvl}>
                                    <ClockIcon />
                                </EstimatedTVLTip>
                            ) : null}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex">
                            <div className="mr-1">{toApproxCurrency(pastUpkeepTokenInfo.tokenBalance)}</div>
                            <UpOrDownWithTooltip
                                oldValue={antecedentUpkeepTokenInfo.tokenBalance}
                                newValue={pastUpkeepTokenInfo.tokenBalance}
                                deltaDenotation={deltaDenotation}
                                poolTicker={poolTicker}
                                tooltipMetric={UpOrDownTipMetric.TVL}
                                tokenMetricSide={side}
                                showNextRebalance={showNextRebalance}
                            />
                        </div>
                    </>
                )}
            </TableRowCell>
            <TableRowCell size={'sm'}>
                <div
                    className={
                        tokenInfo.effectiveGain > leverage
                            ? 'text-up-green'
                            : tokenInfo.effectiveGain < leverage
                            ? 'text-down-red'
                            : ''
                    }
                >
                    {tokenInfo.effectiveGain.toFixed(3)}
                </div>
            </TableRowCell>
            <TableRowCell size={'sm'}>{leverage}</TableRowCell>
            <TableRowCell size={'sm'}>
                {showNextRebalance ? (
                    toApproxCurrency(tokenInfo.nextTCRPrice, 5)
                ) : (
                    <>
                        <div className="flex">
                            <div className="mr-1">{toApproxCurrency(pastUpkeepTokenInfo.tokenPrice, 5)}</div>
                            <UpOrDownWithTooltip
                                oldValue={antecedentUpkeepTokenInfo.tokenPrice}
                                newValue={pastUpkeepTokenInfo.tokenPrice}
                                deltaDenotation={deltaDenotation}
                                poolTicker={poolTicker}
                                tooltipMetric={UpOrDownTipMetric.TokenPrice}
                                tokenMetricSide={side}
                                showNextRebalance={showNextRebalance}
                            />
                        </div>
                    </>
                )}
            </TableRowCell>
            {showNextRebalance ? (
                <TableRowCell size={'sm'}>
                    {tokenInfo.balancerPrice ? (
                        <div className="flex items-center">
                            {toApproxCurrency(tokenInfo.balancerPrice, 5)}
                            <TradeOnBalancerTip>
                                <LinkIcon
                                    className="ml-2 inline-block"
                                    onClick={() => {
                                        open(
                                            constructBalancerLink(tokenInfo.address, NETWORKS.ARBITRUM, true),
                                            'blank',
                                        );
                                    }}
                                />
                            </TradeOnBalancerTip>
                        </div>
                    ) : (
                        <>
                            <NoBalancerPoolTip market={poolTicker}>-</NoBalancerPoolTip>
                        </>
                    )}
                </TableRowCell>
            ) : null}
            {showNextRebalance && !!account ? (
                <TableRowCell size={'sm'}>
                    <div className="flex">
                        <Logo size="xs" ticker={tokenSymbolToLogoTicker(tokenInfo.symbol)} className="my-auto mr-1" />
                        {tokenInfo.userHoldings === 0 ? '-' : tokenInfo.userHoldings.toFixed(5)}
                    </div>
                    <div className="flex">
                        <Logo size="xs" ticker={settlementTokenSymbol as LogoTicker} className="my-auto mr-1" />
                        {tokenInfo.userHoldings === 0
                            ? '-'
                            : toApproxCurrency(tokenInfo.userHoldings * tokenInfo.nextTCRPrice, 5)}
                    </div>
                </TableRowCell>
            ) : null}
            <TableRowCell size={'sm'}>
                {showNextRebalance ? (
                    <div className="flex">
                        <Button
                            className="gradient-button mx-1 my-auto ml-auto w-[70px] uppercase"
                            size="xs"
                            variant="primary-light"
                            onClick={() => onClickMintBurn(poolAddress, side, CommitActionEnum.burn)}
                        >
                            TRADE
                        </Button>
                        <Actions
                            poolAddress={poolAddress}
                            token={{
                                address: tokenInfo.address,
                                decimals: decimals,
                                symbol: tokenInfo.symbol,
                            }}
                            arbiscanTarget={{
                                type: BlockExplorerAddressType.token,
                                target: poolAddress,
                            }}
                            isImported={isImportedPool}
                        />
                    </div>
                ) : null}
            </TableRowCell>
        </>
    );
};

enum UpOrDownTipMetric {
    TVL = 'TVL',
    TokenPrice = 'token price',
    Skew = 'skew',
    ExpectedSkew = 'expected skew',
    IndexPrice = 'index price',
}

const UpOrDownWithTooltipTip: React.FC<{
    metric: UpOrDownTipMetric;
    currency: boolean;
    side?: SideEnum;
    valueText: string;
    value: number;
    poolTicker: string;
    showNextRebalance: boolean;
}> = ({ metric, side, valueText, value, showNextRebalance, poolTicker, children }) => {
    let message;
    const sideText = side === SideEnum.long ? 'long' : 'short';
    if (parseFloat(value.toFixed(3)) === 0) {
        message = showNextRebalance
            ? `The ${
                  side !== undefined ? sideText : ''
              } ${metric} has not changed since the last rebalance of the ${poolTicker} pool.`
            : `The ${
                  side !== undefined ? sideText : ''
              } ${metric} did not change during the last rebalance of the ${poolTicker} pool.`;
    } else {
        message = showNextRebalance
            ? `The ${side !== undefined ? sideText : ''} ${metric} is currently ${valueText} ${
                  value > 0 ? 'greater than' : 'less than'
              } it was at the last rebalance of the ${poolTicker} pool.`
            : `The ${side !== undefined ? sideText : ''} ${metric} ${
                  value > 0 ? 'increased' : 'decreased'
              } by ${valueText} during the last rebalance of the ${poolTicker} pool.`;
    }
    return <StyledTooltip title={message}>{children}</StyledTooltip>;
};

const UpOrDownWithTooltip: React.FC<{
    oldValue: number;
    newValue: number;
    tokenMetricSide?: SideEnum;
    poolTicker: string;
    tooltipMetric: UpOrDownTipMetric;
    showNextRebalance: boolean;
    currency?: boolean;
    deltaDenotation: DeltaEnum;
}> = React.forwardRef(
    (
        {
            oldValue,
            newValue,
            deltaDenotation,
            tooltipMetric,
            showNextRebalance,
            poolTicker,
            tokenMetricSide,
            currency = true,
        },
        _ref,
    ) => {
        const value = useMemo(
            () =>
                deltaDenotation === DeltaEnum.Numeric
                    ? newValue - oldValue
                    : calcPercentageDifference(newValue, oldValue),
            [deltaDenotation, oldValue, newValue],
        );
        const approxValue = Math.abs(parseFloat(value.toFixed(5)));
        return (
            <UpOrDownWithTooltipTip
                metric={tooltipMetric}
                valueText={
                    deltaDenotation === DeltaEnum.Numeric
                        ? currency
                            ? toApproxCurrency(value).replace('-', '')
                            : approxValue.toString()
                        : `${approxValue}%`
                }
                side={tokenMetricSide}
                value={value}
                currency={currency}
                poolTicker={poolTicker}
                showNextRebalance={showNextRebalance}
            >
                {/* Fixes ref error with antd tooltip */}
                <div>
                    <UpOrDown
                        oldValue={oldValue}
                        newValue={newValue}
                        deltaDenotation={deltaDenotation}
                        currency={'USD'}
                        showCurrencyTicker={false}
                    />
                </div>
            </UpOrDownWithTooltipTip>
        );
    },
);
