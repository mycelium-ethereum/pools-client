import React, { useState, useEffect, useMemo } from 'react';
import Button from '@components/General/Button';
import { Table, TableHeader, TableRow, TableHeaderCell, TableRowCell } from '@components/General/TWTable';
import { ARBITRUM, CommitActionEnum, SideEnum } from '@libs/constants';
import { calcPercentageDifference, getPriceFeedUrl, toApproxCurrency } from '@libs/utils/converters';
import { BrowseTableRowData, DeltaEnum } from '../state';
import { TWModal } from '@components/General/TWModal';
import TimeLeft from '@components/TimeLeft';
import Actions from '@components/TokenActions';
import { Logo, LogoTicker, tokenSymbolToLogoTicker } from '@components/General';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { ethers } from 'ethers';
import { ArbiscanEnum } from '@libs/utils/rpcMethods';
import TooltipSelector, { TooltipKeys } from '@components/Tooltips/TooltipSelector';
import useIntervalCheck from '@libs/hooks/useIntervalCheck';
import { LinkOutlined } from '@ant-design/icons';
import PoolDetailsModal from '../PoolDetailsModal';
import { useTheme } from '@context/ThemeContext';
import styled from 'styled-components';

import Close from '/public/img/general/close.svg';
import { classNames } from '@libs/utils/functions';
import { constructBalancerLink } from '@archetypes/Exchange/Summary';
import { StyledTooltip } from '@components/Tooltips';
import { default as UpOrDownInner } from '@components/UpOrDown';
import Info from '/public/img/general/info.svg';
import LinkIcon from '@public/img/general/link.svg';

type TProps = {
    onClickMintBurn: (pool: string, side: SideEnum, commitAction: CommitActionEnum) => void;
    showNextRebalance: boolean;
    deltaDenotation: DeltaEnum;
};

const SkewTip: React.FC = ({ children }) => (
    <StyledTooltip title="An indication of the difference between collateral in the long and short side of the pool. Pool Skew is calculated by dividing the TVL in the long side by the TVL in the short side.">
        {children}
    </StyledTooltip>
);

const IndexPriceTip: React.FC = ({ children }) => (
    <StyledTooltip
        title={
            <>
                The index price of the asset tracked by the pool, supplied by an oracle.{' '}
                <a href="https://docs.tracer.finance/tracer/markets" target="_blank" rel="noreferrer noopener">
                    Learn more
                </a>
                .
            </>
        }
    >
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
        fill: ${(props) => (props.isDark ? '#ffffff' : '#111928')};
    }
`;

export default (({ rows, onClickMintBurn, showNextRebalance, deltaDenotation }) => {
    const [showModalEffectiveGain, setShowModalEffectiveGain] = useState(false);
    const [showModalPoolDetails, setShowModalPoolDetails] = useState(false);
    const [poolDetails, setPoolDetails] = useState<any>({});
    const { provider, account, config } = useWeb3();
    const { isDark } = useTheme();

    const handlePoolDetailsClick = (data: any) => {
        setShowModalPoolDetails(true);
        setPoolDetails(data);
    };

    return (
        <>
            <Table>
                <TableHeader className="align-baseline">
                    <tr>
                        <TableHeaderCell
                            className="bg-cool-gray-50 dark:bg-theme-background-secondary rounded-xl"
                            colSpan={13}
                        >
                            <div className="flex justify-between divide-x-[3px] divide-cool-gray-200 dark:divide-cool-gray-900 text-base">
                                <div className="flex pr-10">
                                    <Logo
                                        className="inline mr-3 my-auto"
                                        size="lg"
                                        ticker={rows[0].name.split('-')[1].split('/')[0] as LogoTicker}
                                    />
                                    <div className="my-auto">
                                        <div className="font-bold text-lg">{rows[0].name.split('-')[1]}</div>
                                    </div>
                                </div>
                                <div className="px-10">
                                    <div className="text-cool-gray-500 dark:text-cool-gray-400 font-semibold">
                                        SPOT PRICE
                                    </div>
                                    <div className="font-bold">{toApproxCurrency(rows[0].oraclePrice)}</div>
                                </div>
                                <div className="px-10">
                                    <div className="text-cool-gray-500 dark:text-cool-gray-400 font-semibold">
                                        ORACLE
                                    </div>
                                    <a
                                        href={getPriceFeedUrl(rows[0].name)}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center"
                                    >
                                        <img className="mr-2" src={'/img/general/chainlink.svg'} alt="Chainlink" />
                                        <div className="mr-2 font-bold normal-case">Chainlink</div>
                                        <LinkIcon alt="Link" />
                                    </a>
                                </div>
                                <div className="px-10 text-cool-gray-500 dark:text-cool-gray-400 font-semibold">
                                    24H VOLUME
                                </div>
                                <div className="px-10">
                                    <div className="text-cool-gray-500 dark:text-cool-gray-400 font-semibold">
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
                        <TableHeaderCell className="whitespace-nowrap w-1/12">
                            {/* TODO: do something else when we have a pool using a non-USDC underlying feed */}
                            <IndexPriceTip>{'INDEX PRICE (USD)'}</IndexPriceTip>
                        </TableHeaderCell>
                        <TableHeaderCell className="whitespace-nowrap w-1/12">{'TVL (USD)'}</TableHeaderCell>
                        <TableHeaderCell className={showNextRebalance ? 'w-1/12' : 'w-3/12'}>
                            <SkewTip>
                                <div>{'Skew'}</div>
                            </SkewTip>
                        </TableHeaderCell>
                        {showNextRebalance ? (
                            <TableHeaderCell className="w-2/12">
                                <CommittmentTip>
                                    <div>{'Commitment Window'}</div>
                                </CommittmentTip>
                            </TableHeaderCell>
                        ) : null}
                        {/* Token Cols */}
                        <TableHeaderCell className="border-l-2 border-theme-background w-16" size="sm">
                            {'Side'}
                        </TableHeaderCell>
                        <TableHeaderCell size="sm" className={'whitespace-nowrap w-2/12'}>
                            {'TVL (USD)'}
                        </TableHeaderCell>
                        <TableHeaderCell size="sm" colSpan={2} className={'whitespace-nowrap w-[12%]'}>
                            <EffectiveLeverageTip>
                                <div>{'Effective Leverage'}</div>
                            </EffectiveLeverageTip>
                        </TableHeaderCell>
                        <TableHeaderCell size="sm" colSpan={showNextRebalance ? 2 : 1} className={'whitespace-nowrap'}>
                            {'Token Price (USD)'}
                        </TableHeaderCell>
                        {showNextRebalance && !!account ? (
                            <TableHeaderCell size="sm">
                                <div className="capitalize">{'MY HOLDINGS'}</div>
                            </TableHeaderCell>
                        ) : null}
                        <TableHeaderCell>{/* Empty header for buttons column */}</TableHeaderCell>
                    </tr>
                    <tr>
                        {/* Pools  Cols */}
                        <TableHeaderCell colSpan={4} />
                        {showNextRebalance ? (
                            <TableHeaderCell size="default-x" className="text-cool-gray-400">
                                <div className="text-cool-gray-400 capitalize">{'Ends in'}</div>
                            </TableHeaderCell>
                        ) : null}

                        {/* Token Cols */}
                        <TableHeaderCell className="border-l-2 border-theme-background" size="sm-x" colSpan={2} />
                        <TableHeaderCell size="sm-x">
                            <div className="text-cool-gray-400 capitalize">{'Gains'}</div>
                        </TableHeaderCell>
                        <TableHeaderCell className="text-cool-gray-400" size="sm-x">
                            <div className="text-cool-gray-400 capitalize">{'Losses'}</div>
                        </TableHeaderCell>
                        <TableHeaderCell className="text-cool-gray-400" size="sm-x">
                            <div className="text-cool-gray-400 capitalize">{'Tracer'}</div>
                        </TableHeaderCell>
                        {showNextRebalance ? (
                            <TableHeaderCell className="text-cool-gray-400" size="sm-x">
                                <div className="text-cool-gray-400 capitalize">{'Balancer'}</div>
                            </TableHeaderCell>
                        ) : null}
                        <TableHeaderCell colSpan={showNextRebalance && !!account ? 2 : 1} />
                    </tr>
                </TableHeader>
                {rows.map((pool) => {
                    return (
                        <PoolRow
                            pool={pool}
                            onClickMintBurn={onClickMintBurn}
                            onClickShowPoolDetailsModal={() => handlePoolDetailsClick(pool)}
                            showNextRebalance={showNextRebalance}
                            key={pool.address}
                            account={account}
                            provider={provider}
                            deltaDenotation={deltaDenotation}
                            isDark={isDark}
                        />
                    );
                })}
            </Table>
            {/*{showNextRebalance ? (*/}
            {/*    <p className="mt-3 text-sm text-theme-text opacity-80 text-left">*/}
            {/*        Values are indicative only. They are estimates given the committed mints and burns, and change in*/}
            {/*        price of the underlying market. All values are subject to change at the next rebalance of each pool.*/}
            {/*    </p>*/}
            {/*) : null}*/}
            <TWModal open={showModalEffectiveGain} onClose={() => setShowModalEffectiveGain(false)}>
                <div className="flex justify-between">
                    <div className="text-2xl">Leverage on Gains</div>
                    <div className="w-3 h-3 cursor-pointer" onClick={() => setShowModalEffectiveGain(false)}>
                        <Close />
                    </div>
                </div>
                <br />
                <div>
                    This metric is the the effective leverage by which your gains will be determined at the next
                    rebalancing event. While the leverage on losses is always fixed, the leverage on gains varies
                    depending on the capital in the other side of the pool.
                </div>
            </TWModal>
            <PoolDetailsModal
                open={showModalPoolDetails}
                onClose={() => setShowModalPoolDetails(false)}
                poolDetails={poolDetails}
                previewUrl={config?.previewUrl || ''}
                isDark={isDark}
            />
        </>
    );
}) as React.FC<
    {
        rows: BrowseTableRowData[];
    } & TProps
>;

const calcPercentage: (value: number, total: number) => number = (value, total) => (value / total) * 100;
const PoolRow: React.FC<
    {
        pool: BrowseTableRowData;
        account: string | undefined;
        provider: ethers.providers.JsonRpcProvider | undefined;
        onClickShowPoolDetailsModal: () => void;
        isDark: boolean;
    } & TProps
> = ({
    pool,
    account,
    onClickMintBurn,
    provider,
    showNextRebalance,
    deltaDenotation,
    onClickShowPoolDetailsModal,
    isDark,
}) => {
    const [pendingUpkeep, setPendingUpkeep] = useState(false);

    const isBeforeFrontRunning = useIntervalCheck(pool.nextRebalance, pool.frontRunning);

    useEffect(() => {
        if (isBeforeFrontRunning) {
            setPendingUpkeep(false);
        }
    }, [isBeforeFrontRunning]);

    return (
        <>
            <TableRow lined>
                {/** Pool rows */}
                <TableRowCell rowSpan={2}>
                    <div className="font-bold">{pool.name.split('-')[0][0]}</div>
                    <div className="flex items-center">
                        USDC
                        <InfoIcon onClick={onClickShowPoolDetailsModal} isDark={isDark} />
                    </div>
                </TableRowCell>
                <TableRowCell rowSpan={2}>
                    {showNextRebalance ? (
                        <>
                            <div>{toApproxCurrency(pool.oraclePrice)}</div>
                            <div className="mt-1">
                                <UpOrDown
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
                                <UpOrDown
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
                                <UpOrDown
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
                                <UpOrDown
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
                    className={classNames('relative bg-opacity-0 z-[1]', !showNextRebalance ? 'w-1/6' : '')}
                >
                    <LongBalance width={calcPercentage(pool.longToken.tvl, pool.tvl)} />
                    <ShortBalance />
                    {showNextRebalance ? (
                        <>
                            <div>{pool.skew.toFixed(3)}</div>
                            <div className="mt-1">
                                <UpOrDown
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
                                <UpOrDown
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
                        {!isBeforeFrontRunning ? (
                            <TooltipSelector tooltip={{ key: TooltipKeys.Lock }}>
                                <div>Front-running interval reached</div>
                                <div className="opacity-80">
                                    {'Mint and burn in '}
                                    {!pendingUpkeep ? (
                                        <TimeLeft
                                            targetTime={pool.nextRebalance}
                                            countdownEnded={() => {
                                                setPendingUpkeep(true);
                                            }}
                                        />
                                    ) : (
                                        'progress'
                                    )}
                                </div>
                            </TooltipSelector>
                        ) : (
                            <TimeLeft targetTime={pool.nextRebalance - pool.frontRunning} />
                        )}
                    </TableRowCell>
                ) : null}

                {/** Token rows */}
                <TokenRows
                    side={SideEnum.long}
                    provider={provider}
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
                    quoteTokenSymbol={pool.quoteTokenSymbol}
                    poolTicker={pool.name}
                />
            </TableRow>
            <TableRow lined>
                <TokenRows
                    side={SideEnum.short}
                    provider={provider}
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
                    quoteTokenSymbol={pool.quoteTokenSymbol}
                    poolTicker={pool.name}
                />
            </TableRow>
        </>
    );
};

const LongBalance: React.FC<{ width: number }> = ({ width }) => (
    <div
        style={{ width: `${width}%` }}
        className={`absolute left-0 top-0 h-full z-[-1] bg-green-50 dark:bg-dark-green matrix:bg-dark-green`}
    />
);
const ShortBalance = () => (
    <div className={`absolute left-0 top-0 w-full h-full z-[-2] bg-red-50 dark:bg-dark-red matrix:bg-dark-red`} />
);

const longStyles = 'bg-green-50 dark:bg-dark-green matrix:bg-dark-green';
const shortStyles = 'bg-red-50 dark:bg-dark-red matrix:bg-dark-red';

const TokenRows: React.FC<
    {
        side: SideEnum;
        tokenInfo: BrowseTableRowData['longToken'] | BrowseTableRowData['shortToken'];
        quoteTokenSymbol: string;
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
        provider: ethers.providers.JsonRpcProvider | undefined;
    } & TProps
> = ({
    side,
    tokenInfo,
    quoteTokenSymbol,
    leverage,
    address: poolAddress,
    account,
    decimals,
    provider,
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
                            <UpOrDown
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
                            <UpOrDown
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
                            <UpOrDown
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
                                className="align-middle ml-1"
                                onClick={() => {
                                    open(constructBalancerLink(tokenInfo.address, ARBITRUM, true), 'blank');
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
                        <Logo size="xs" ticker={tokenSymbolToLogoTicker(tokenInfo.symbol)} className="mr-1 my-auto" />
                        {tokenInfo.userHoldings === 0 ? '-' : tokenInfo.userHoldings.toFixed(3)}
                    </div>
                    <div className="flex">
                        <Logo size="xs" ticker={quoteTokenSymbol as LogoTicker} className="mr-1 my-auto" />
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
                            className="mx-1 w-[70px] my-auto ml-auto uppercase"
                            size="xs"
                            variant="primary-light"
                            onClick={() => onClickMintBurn(poolAddress, side, CommitActionEnum.mint)}
                        >
                            COMMIT
                        </Button>
                        <Actions
                            provider={provider as ethers.providers.JsonRpcProvider}
                            token={{
                                address: poolAddress,
                                decimals: decimals,
                                symbol: tokenInfo.symbol,
                            }}
                            arbiscanTarget={{
                                type: ArbiscanEnum.token,
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

const UpOrDownTip: React.FC<{
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

const UpOrDown: React.FC<{
    oldValue: number;
    newValue: number;
    tokenMetricSide?: SideEnum;
    poolTicker: string;
    tooltipMetric: UpOrDownTipMetric;
    showNextRebalance: boolean;
    currency?: boolean;
    deltaDenotation: DeltaEnum;
}> = ({
    oldValue,
    newValue,
    deltaDenotation,
    tooltipMetric,
    showNextRebalance,
    poolTicker,
    tokenMetricSide,
    currency = true,
}) => {
    const value = useMemo(
        () =>
            deltaDenotation === DeltaEnum.Numeric ? newValue - oldValue : calcPercentageDifference(newValue, oldValue),
        [deltaDenotation, oldValue, newValue],
    );
    const approxValue = Math.abs(parseFloat(value.toFixed(3)));
    return (
        <UpOrDownTip
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
            <UpOrDownInner
                oldValue={oldValue}
                newValue={newValue}
                deltaDenotation={deltaDenotation}
                currency={'USD'}
                showCurrencyTicker={false}
            />
        </UpOrDownTip>
    );
};
