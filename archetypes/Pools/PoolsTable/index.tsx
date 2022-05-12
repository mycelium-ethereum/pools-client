import React, { useState, useMemo, useCallback } from 'react';
import BigNumber from 'bignumber.js';
import { LinkOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import shallow from 'zustand/shallow';
import { CommitActionEnum, NETWORKS, SideEnum } from '@tracer-protocol/pools-js';

import { constructBalancerLink } from '~/archetypes/BalancerBuySell';
import { Logo, LogoTicker, tokenSymbolToLogoTicker } from '~/components/General';
import Button from '~/components/General/Button';
import { Table, TableHeader, TableRow, TableHeaderCell, TableRowCell } from '~/components/General/TWTable';
import TimeLeft from '~/components/TimeLeft';
import Actions from '~/components/TokenActions';
import { StyledTooltip } from '~/components/Tooltips';
import { default as UpOrDown } from '~/components/UpOrDown';
import Info from '~/public/img/general/info.svg';
import LinkIcon from '~/public/img/general/link.svg';
import { useStore } from '~/store/main';
import { Theme } from '~/store/ThemeSlice/themes';
import { selectWeb3Info } from '~/store/Web3Slice';
import { BlockExplorerAddressType } from '~/types/blockExplorers';
import { calcPercentageDifference, toApproxCurrency } from '~/utils/converters';
import { classNames } from '~/utils/helpers';
import { getPriceFeedUrl, getBaseAssetFromMarket } from '~/utils/poolNames';
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

const CommittmentTip: React.FC = ({ children }) => (
    <StyledTooltip title="You must commit your mint or burn before the end of this countdown to have your order filled at the upcoming rebalance.">
        {children}
    </StyledTooltip>
);

const NoBalancerPoolTip: React.FC<{ market: string }> = ({ children, market }) => (
    <StyledTooltip title={`There are no Balancer pools for the ${market} market yet.`}>{children}</StyledTooltip>
);

const InfoIcon = styled(Info)`
    margin-left: 15px;

    :hover {
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

    const handlePoolDetailsClick = useCallback((data: BrowseTableRowData) => {
        setShowModalPoolDetails(true);
        setPoolDetails(data);
    }, []);

    return (
        <>
            <Table>
                <TableHeader className="align-baseline">
                    <tr>
                        <TableHeaderCell
                            className="rounded-xl bg-cool-gray-50 dark:bg-theme-background-secondary"
                            colSpan={13}
                        >
                            <div className="flex justify-between divide-x-[3px] divide-cool-gray-200 text-base dark:divide-cool-gray-900">
                                <div className="flex pr-10">
                                    <Logo
                                        className="my-auto mr-3 inline"
                                        size="lg"
                                        ticker={getBaseAssetFromMarket(rows[0].marketSymbol) as LogoTicker}
                                    />
                                    <div className="my-auto">
                                        <div className="text-lg font-bold">{rows[0].marketSymbol}</div>
                                    </div>
                                </div>
                                <div className="px-10">
                                    <div className="font-semibold text-cool-gray-500 dark:text-cool-gray-400">
                                        SPOT PRICE
                                    </div>
                                    <div className="font-bold">{toApproxCurrency(rows[0].oraclePrice)}</div>
                                </div>
                                <div className="px-10">
                                    <div className="font-semibold text-cool-gray-500 dark:text-cool-gray-400">
                                        ORACLE
                                    </div>
                                    <a
                                        href={getPriceFeedUrl(rows[0].marketSymbol)}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center"
                                    >
                                        <img className="mr-2" src={'/img/general/chainlink.svg'} alt="Chainlink" />
                                        <div className="mr-2 font-bold normal-case">Chainlink</div>
                                        <LinkIcon alt="Link" />
                                    </a>
                                </div>
                                <div className="px-10">
                                    <div className="font-semibold text-cool-gray-500 dark:text-cool-gray-400">
                                        24H Volume
                                    </div>
                                    <div className="font-bold">{toApproxCurrency(oneDayVolume)}</div>
                                </div>
                                <div className="px-10">
                                    <div className="font-semibold text-cool-gray-500 dark:text-cool-gray-400">
                                        NUMBER OF POOLS
                                    </div>
                                    <div className="font-bold">{rows.length}</div>
                                </div>
                            </div>
                        </TableHeaderCell>
                    </tr>
                    <tr className="h-5" />
                    <tr>
                        {/* Pools  Cols */}
                        <TableHeaderCell className="w-1/12">Leverage/Collateral</TableHeaderCell>
                        <TableHeaderCell className="w-1/12 whitespace-nowrap">
                            {/* TODO: do something else when we have a pool using a non-USDC underlying feed */}
                            {'INDEX PRICE (USD)'}
                        </TableHeaderCell>
                        <TableHeaderCell className="w-1/12 whitespace-nowrap">{'TVL (USD)'}</TableHeaderCell>
                        <TableHeaderCell className={showNextRebalance ? 'w-1/12' : 'w-3/12'}>
                            <SkewTip>
                                <div>{'Skew'}</div>
                            </SkewTip>
                        </TableHeaderCell>
                        {showNextRebalance ? (
                            <TableHeaderCell className="w-2/12">
                                <CommittmentTip>
                                    <div>{'Tokens in'}</div>
                                </CommittmentTip>
                            </TableHeaderCell>
                        ) : null}
                        {/* Token Cols */}
                        <TableHeaderCell className="w-16 border-l-2 border-theme-background" size="sm">
                            {'Side'}
                        </TableHeaderCell>
                        <TableHeaderCell size="sm" className={'w-2/12 whitespace-nowrap'}>
                            {'TVL (USD)'}
                        </TableHeaderCell>
                        <TableHeaderCell size="sm" colSpan={2} className={'w-[12%] whitespace-nowrap'}>
                            <EffectiveLeverageTip>
                                <div>{'Effective Leverage'}</div>
                            </EffectiveLeverageTip>
                        </TableHeaderCell>
                        <TableHeaderCell size="sm" colSpan={showNextRebalance ? 2 : 1} className={'whitespace-nowrap'}>
                            {'Token Price (USD)'}
                        </TableHeaderCell>
                        {showNextRebalance && !!account ? (
                            <TableHeaderCell size="sm">
                                <div className="whitespace-nowrap capitalize">{'MY HOLDINGS'}</div>
                            </TableHeaderCell>
                        ) : null}
                        <TableHeaderCell>{/* Empty header for buttons column */}</TableHeaderCell>
                    </tr>
                    <tr>
                        {/* Pools  Cols */}
                        <TableHeaderCell colSpan={showNextRebalance ? 5 : 4} />

                        {/* Token Cols */}
                        <TableHeaderCell className="border-l-2 border-theme-background" size="sm-x" colSpan={2} />
                        <TableHeaderCell size="sm-x">
                            <div className="capitalize text-cool-gray-400">{'Gains'}</div>
                        </TableHeaderCell>
                        <TableHeaderCell className="text-cool-gray-400" size="sm-x">
                            <div className="capitalize text-cool-gray-400">{'Losses'}</div>
                        </TableHeaderCell>
                        <TableHeaderCell className="text-cool-gray-400" size="sm-x">
                            <div className="capitalize text-cool-gray-400">{'Tracer'}</div>
                        </TableHeaderCell>
                        {showNextRebalance ? (
                            <TableHeaderCell className="text-cool-gray-400" size="sm-x">
                                <div className="capitalize text-cool-gray-400">{'Balancer'}</div>
                            </TableHeaderCell>
                        ) : null}
                        <TableHeaderCell colSpan={showNextRebalance && !!account ? 2 : 1} />
                    </tr>
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

const calcPercentage: (value: number, total: number) => number = (value, total) => (value / total) * 100;
const PoolRow: React.FC<
    {
        pool: BrowseTableRowData;
        account: string | undefined;
        onClickShowPoolDetailsModal: (pool: BrowseTableRowData) => void;
    } & TProps
> = ({ pool, account, onClickMintBurn, showNextRebalance, deltaDenotation, onClickShowPoolDetailsModal }) => {
    return (
        <>
            <TableRow lined>
                {/** Pool rows */}
                <TableRowCell rowSpan={2}>
                    <div className="font-bold">{pool.leverage}</div>
                    <div className="flex items-center">
                        {pool.collateralAsset}
                        <InfoIcon onClick={() => onClickShowPoolDetailsModal(pool)} />
                    </div>
                </TableRowCell>
                <TableRowCell rowSpan={2}>
                    {showNextRebalance ? (
                        <>
                            <div>{toApproxCurrency(pool.oraclePrice)}</div>
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
                <TableRowCell rowSpan={2}>
                    {showNextRebalance ? (
                        <>
                            <div>{toApproxCurrency(pool.nextTVL)}</div>
                            <div className="mt-1">
                                <UpOrDownWithTooltip
                                    oldValue={pool.tvl}
                                    newValue={pool.nextTVL}
                                    deltaDenotation={deltaDenotation}
                                    poolTicker={pool.name}
                                    tooltipMetric={UpOrDownTipMetric.TVL}
                                    showNextRebalance={showNextRebalance}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div>{toApproxCurrency(pool.pastUpkeep.tvl)}</div>
                            <div className="mt-1">
                                <UpOrDownWithTooltip
                                    oldValue={pool.antecedentUpkeep.tvl}
                                    newValue={pool.pastUpkeep.tvl}
                                    deltaDenotation={deltaDenotation}
                                    poolTicker={pool.name}
                                    tooltipMetric={UpOrDownTipMetric.TVL}
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
                    <LongBalance width={calcPercentage(pool.longToken.tvl, pool.tvl)} />
                    <ShortBalance />
                    {showNextRebalance ? (
                        <>
                            <div>{pool.skew.toFixed(3)}</div>
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
                />
            </TableRow>
            <TableRow lined>
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
                />
            </TableRow>
        </>
    );
};

const LongBalance: React.FC<{ width: number }> = ({ width }) => (
    <div
        style={{ width: `${width}%` }}
        className={`absolute left-0 top-0 z-[-1] h-full bg-green-50 matrix:bg-dark-green dark:bg-dark-green`}
    />
);
const ShortBalance = () => (
    <div className={`absolute left-0 top-0 z-[-2] h-full w-full bg-red-50 matrix:bg-dark-red dark:bg-dark-red`} />
);

const longStyles = 'bg-green-50 dark:bg-dark-green matrix:bg-dark-green';
const shortStyles = 'bg-red-50 dark:bg-dark-red matrix:bg-dark-red';

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
}) => {
    const styles = side === SideEnum.long ? longStyles : shortStyles;

    return (
        <>
            <TableRowCell size={'sm'} className={classNames(styles, 'border-l-2 border-theme-background')}>
                {side === SideEnum.long ? 'Long' : 'Short'}
            </TableRowCell>
            <TableRowCell size={'sm'} className={classNames(styles)}>
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
            <TableRowCell size={'sm'} className={styles}>
                <div
                    className={
                        tokenInfo.effectiveGain > leverage
                            ? 'text-green-600'
                            : tokenInfo.effectiveGain < leverage
                            ? 'text-red-600'
                            : ''
                    }
                >
                    {tokenInfo.effectiveGain.toFixed(3)}
                </div>
            </TableRowCell>
            <TableRowCell size={'sm'} className={styles}>
                {leverage}
            </TableRowCell>
            <TableRowCell size={'sm'} className={styles}>
                {showNextRebalance ? (
                    toApproxCurrency(tokenInfo.nextTCRPrice, 3)
                ) : (
                    <>
                        <div className="flex">
                            <div className="mr-1">{toApproxCurrency(pastUpkeepTokenInfo.tokenPrice, 3)}</div>
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
                <TableRowCell size={'sm'} className={styles}>
                    {tokenInfo.balancerPrice ? (
                        <>
                            {toApproxCurrency(tokenInfo.balancerPrice, 3)}
                            <LinkOutlined
                                className="ml-1 align-middle"
                                onClick={() => {
                                    open(constructBalancerLink(tokenInfo.address, NETWORKS.ARBITRUM, true), 'blank');
                                }}
                            />
                        </>
                    ) : (
                        <>
                            <NoBalancerPoolTip market={poolTicker}>-</NoBalancerPoolTip>
                        </>
                    )}
                </TableRowCell>
            ) : null}
            {showNextRebalance && !!account ? (
                <TableRowCell size={'sm'} className={styles}>
                    <div className="flex">
                        <Logo size="xs" ticker={tokenSymbolToLogoTicker(tokenInfo.symbol)} className="my-auto mr-1" />
                        {tokenInfo.userHoldings === 0 ? '-' : tokenInfo.userHoldings.toFixed(3)}
                    </div>
                    <div className="flex">
                        <Logo size="xs" ticker={settlementTokenSymbol as LogoTicker} className="my-auto mr-1" />
                        {tokenInfo.userHoldings === 0
                            ? '-'
                            : toApproxCurrency(tokenInfo.userHoldings * tokenInfo.nextTCRPrice, 3)}
                    </div>
                </TableRowCell>
            ) : null}
            <TableRowCell size={'sm'} className={styles}>
                {showNextRebalance ? (
                    <div className="flex">
                        <Button
                            className="mx-1 my-auto ml-auto w-[70px] uppercase"
                            size="xs"
                            variant="primary-light"
                            onClick={() => onClickMintBurn(poolAddress, side, CommitActionEnum.mint)}
                        >
                            COMMIT
                        </Button>
                        <Actions
                            token={{
                                address: poolAddress,
                                decimals: decimals,
                                symbol: tokenInfo.symbol,
                            }}
                            arbiscanTarget={{
                                type: BlockExplorerAddressType.token,
                                target: poolAddress,
                            }}
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
        const approxValue = Math.abs(parseFloat(value.toFixed(3)));
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
