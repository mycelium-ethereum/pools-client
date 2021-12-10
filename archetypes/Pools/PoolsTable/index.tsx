import React, { useState, useEffect, useMemo } from 'react';
import Button from '@components/General/Button';
import { Table, TableHeader, TableRow, TableHeaderCell, TableRowCell } from '@components/General/TWTable';
import { ARBITRUM, CommitActionEnum, SideEnum } from '@libs/constants';
import { calcPercentageDifference, tickerToName, toApproxCurrency } from '@libs/utils/converters';
import { BrowseTableRowData, DeltaEnum } from '../state';
import { TWModal } from '@components/General/TWModal';
import TimeLeft from '@components/TimeLeft';
import Actions from '@components/TokenActions';
import { Logo, LogoTicker, tokenSymbolToLogoTicker } from '@components/General';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { ethers } from 'ethers';
import { ArbiscanEnum } from '@libs/utils/rpcMethods';
import Loading from '@components/General/Loading';
import TooltipSelector, { TooltipKeys } from '@components/Tooltips/TooltipSelector';
import useIntervalCheck from '@libs/hooks/useIntervalCheck';
import { LinkOutlined } from '@ant-design/icons';

import Close from '/public/img/general/close.svg';
import ArrowDown from '/public/img/general/arrow-circle-down.svg';
import Equal from '/public/img/general/circle-equal.svg';
import { classNames } from '@libs/utils/functions';
import { constructBalancerLink } from '@archetypes/Exchange/Summary';
import { StyledTooltip } from '@components/Tooltips';

type TProps = {
    onClickMintBurn: (pool: string, side: SideEnum, commitAction: CommitActionEnum) => void;
    showNextRebalance: boolean;
    deltaDenotion: DeltaEnum;
};

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

export default (({ rows, onClickMintBurn, showNextRebalance, deltaDenotion }) => {
    const [showModalEffectiveGain, setShowModalEffectiveGain] = useState(false);
    const { provider, account } = useWeb3();
    return (
        <>
            <Table>
                <TableHeader className="align-baseline">
                    <tr>
                        <TableHeaderCell className="bg-theme-background pl-0" colSpan={showNextRebalance ? 5 : 4}>
                            <div className="capitalize text-lg">{'POOLS'}</div>
                        </TableHeaderCell>
                        <TableHeaderCell className="bg-theme-background pl-0" colSpan={7}>
                            <div className="capitalize text-lg">{'POOL TOKENS'}</div>
                        </TableHeaderCell>
                    </tr>
                    <tr>
                        {/* Pools  Cols */}
                        <TableHeaderCell className="w-1/12">Pool</TableHeaderCell>
                        <TableHeaderCell className="whitespace-nowrap w-1/12">{'BASE PRICE'}</TableHeaderCell>
                        <TableHeaderCell className="whitespace-nowrap w-1/12">{'TVL (USDC)'}</TableHeaderCell>
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
                            {'TVL (USDC)'}
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
                                <div className="capitalize">{'MY HOLDINGS (TOKENS/USDC)'}</div>
                            </TableHeaderCell>
                        ) : null}
                        <TableHeaderCell>{/* Empty header for buttons column */}</TableHeaderCell>
                    </tr>
                    <tr>
                        {/* Pools  Cols */}
                        <TableHeaderCell colSpan={4} />
                        {showNextRebalance ? (
                            <TableHeaderCell className="text-cool-gray-400">
                                <div className="text-cool-gray-400 capitalize">{'Ends in'}</div>
                            </TableHeaderCell>
                        ) : null}

                        {/* Token Cols */}
                        <TableHeaderCell className="border-l-2 border-theme-background" size="sm" colSpan={2} />
                        <TableHeaderCell size="sm">
                            <div className="text-cool-gray-400 capitalize">{'Gains'}</div>
                        </TableHeaderCell>
                        <TableHeaderCell className="text-cool-gray-400" size="sm">
                            <div className="text-cool-gray-400 capitalize">{'Losses'}</div>
                        </TableHeaderCell>
                        <TableHeaderCell className="text-cool-gray-400" size="sm">
                            <div className="text-cool-gray-400 capitalize">{'Tracer'}</div>
                        </TableHeaderCell>
                        {showNextRebalance ? (
                            <TableHeaderCell className="text-cool-gray-400" size="sm">
                                <div className="text-cool-gray-400 capitalize">{'Balancer'}</div>
                            </TableHeaderCell>
                        ) : null}
                        <TableHeaderCell colSpan={showNextRebalance && !!account ? 2 : 1} />
                    </tr>
                </TableHeader>
                {rows.map((pool, index) => {
                    return (
                        <PoolRow
                            pool={pool}
                            onClickMintBurn={onClickMintBurn}
                            index={index}
                            showNextRebalance={showNextRebalance}
                            key={pool.address}
                            account={account}
                            provider={provider}
                            deltaDenotion={deltaDenotion}
                        />
                    );
                })}
            </Table>
            {!rows.length ? <Loading className="w-10 mx-auto my-8" /> : null}
            {showNextRebalance ? (
                <p className="mt-3 text-sm text-theme-text opacity-80 text-left">
                    Values are indicative only. They are estimates given the committed mints and burns, and change in
                    price of the underlying market. All values are subject to change at the next rebalance of each pool.
                </p>
            ) : null}
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
        index: number;
        provider: ethers.providers.JsonRpcProvider | undefined;
    } & TProps
> = ({ pool, account, onClickMintBurn, index, provider, showNextRebalance, deltaDenotion }) => {
    const [pendingUpkeep, setPendingUpkeep] = useState(false);

    const isBeforeFrontRunning = useIntervalCheck(pool.nextRebalance, pool.frontRunning);

    useEffect(() => {
        if (isBeforeFrontRunning) {
            setPendingUpkeep(false);
        }
    }, [isBeforeFrontRunning]);

    return (
        <>
            <TableRow rowNumber={index}>
                {/** Pool rows */}
                <TableRowCell rowSpan={2}>
                    <div style={{ minHeight: '3rem' }} className="flex">
                        <Logo
                            className="inline mr-2 my-auto"
                            size={'md'}
                            ticker={pool.name?.split('-')[1]?.split('/')[0] as LogoTicker}
                        />
                        <div className="my-auto">
                            <div className="font-bold">{tickerToName(pool.name)}</div>
                            <div className="text-xs">{pool.name.split('-')[1]}</div>
                        </div>
                    </div>
                </TableRowCell>
                <TableRowCell rowSpan={2}>
                    {showNextRebalance ? (
                        <>
                            <div>{toApproxCurrency(pool.lastPrice)}</div>
                            <div className="mt-1">
                                <UpOrDown
                                    oldValue={pool.lastPrice}
                                    newValue={pool.oraclePrice}
                                    deltaDenotion={deltaDenotion}
                                    poolTicker={pool.name}
                                    tooltipMetric={UpOrDownTipMetric.BasePrice}
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
                                    deltaDenotion={deltaDenotion}
                                    poolTicker={pool.name}
                                    tooltipMetric={UpOrDownTipMetric.BasePrice}
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
                                    deltaDenotion={deltaDenotion}
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
                                    deltaDenotion={deltaDenotion}
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
                                    deltaDenotion={deltaDenotion}
                                    poolTicker={pool.name}
                                    tooltipMetric={UpOrDownTipMetric.Skew}
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
                                    deltaDenotion={deltaDenotion}
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
                    deltaDenotion={deltaDenotion}
                    leverage={pool.leverage}
                    address={pool.address}
                    decimals={pool.decimals}
                    poolTicker={pool.name}
                />
            </TableRow>
            <TableRow rowNumber={index}>
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
                    deltaDenotion={deltaDenotion}
                    leverage={pool.leverage}
                    address={pool.address}
                    decimals={pool.decimals}
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
    ></div>
);
const ShortBalance = () => (
    <div className={`absolute left-0 top-0 w-full h-full z-[-2] bg-red-50 dark:bg-dark-red matrix:bg-dark-red`}></div>
);

const longStyles = 'bg-green-50 dark:bg-dark-green matrix:bg-dark-green';
const shortStyles = 'bg-red-50 dark:bg-dark-red matrix:bg-dark-red';

const TokenRows: React.FC<
    {
        side: SideEnum;
        tokenInfo: BrowseTableRowData['longToken'] | BrowseTableRowData['shortToken'];
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
    leverage,
    address: poolAddress,
    account,
    decimals,
    provider,
    onClickMintBurn,
    showNextRebalance,
    deltaDenotion,
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
                                deltaDenotion={deltaDenotion}
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
                                deltaDenotion={deltaDenotion}
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
                    toApproxCurrency(tokenInfo.nextTCRPrice)
                ) : (
                    <>
                        <div className="flex">
                            <div className="mr-1">{toApproxCurrency(pastUpkeepTokenInfo.tokenPrice)}</div>
                            <UpOrDown
                                oldValue={antecedentUpkeepTokenInfo.tokenPrice}
                                newValue={pastUpkeepTokenInfo.tokenPrice}
                                deltaDenotion={deltaDenotion}
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
                    {toApproxCurrency(tokenInfo.balancerPrice)}
                    <LinkOutlined
                        className="align-middle ml-1"
                        onClick={() => {
                            open(constructBalancerLink(tokenInfo.address, ARBITRUM, true), 'blank');
                        }}
                    />
                </TableRowCell>
            ) : null}
            {showNextRebalance && !!account ? (
                <TableRowCell size={'sm'} className={styles}>
                    <div className="flex">
                        <Logo size="xs" ticker={tokenSymbolToLogoTicker(tokenInfo.symbol)} className="mr-1 my-auto" />
                        {tokenInfo.userHoldings === 0 ? '-' : tokenInfo.userHoldings.toFixed(3)}
                    </div>
                    <div className="flex">
                        <Logo size="xs" ticker="USDC" className="mr-1 my-auto" />
                        {tokenInfo.userHoldings === 0
                            ? '-'
                            : toApproxCurrency(tokenInfo.userHoldings * tokenInfo.nextTCRPrice)}
                    </div>
                </TableRowCell>
            ) : null}
            <TableRowCell size={'sm'} className={styles}>
                {showNextRebalance ? (
                    <div className="flex">
                        <Button
                            className="mx-1 w-[70px] my-auto ml-auto font-bold uppercase "
                            size="xs"
                            variant="primary-light"
                            onClick={() => onClickMintBurn(poolAddress, side, CommitActionEnum.mint)}
                        >
                            Mint
                        </Button>
                        <Button
                            className="mx-1 w-[70px] my-auto font-bold uppercase "
                            size="xs"
                            variant="primary-light"
                            disabled={!tokenInfo.userHoldings}
                            onClick={() => onClickMintBurn(poolAddress, side, CommitActionEnum.burn)}
                        >
                            Burn
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
    BasePrice = 'base price',
}

const UpOrDownTip: React.FC<{
    metric: UpOrDownTipMetric;
    currency: boolean;
    side?: 'long' | 'short';
    valueText: string;
    value: number;
    poolTicker: string;
    showNextRebalance: boolean;
}> = ({ metric, side, valueText, value, showNextRebalance, poolTicker, children }) => {
    let message;
    if (parseFloat(value.toFixed(3)) === 0) {
        message = showNextRebalance
            ? `The ${side ? side : ''} ${metric} has not changed since the last rebalance of the ${poolTicker} pool.`
            : `The ${side ? side : ''} ${metric} did not change during the last rebalance of the ${poolTicker} pool.`;
    } else {
        message = showNextRebalance
            ? `The ${side ? side : ''} ${metric} is currently ${valueText} ${
                  value > 0 ? 'greater than' : 'less than'
              } it was at the last rebalance of the ${poolTicker} pool.`
            : `The ${side ? side : ''} ${metric} ${
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
    deltaDenotion: DeltaEnum;
}> = ({
    oldValue,
    newValue,
    deltaDenotion,
    tooltipMetric,
    showNextRebalance,
    poolTicker,
    tokenMetricSide,
    currency = true,
}) => {
    const value = useMemo(
        () =>
            deltaDenotion === DeltaEnum.Numeric ? newValue - oldValue : calcPercentageDifference(newValue, oldValue),
        [deltaDenotion, oldValue, newValue],
    );
    const approxValue = Math.abs(parseFloat(value.toFixed(3)));
    return (
        <UpOrDownTip
            metric={tooltipMetric}
            valueText={
                deltaDenotion === DeltaEnum.Numeric
                    ? currency
                        ? toApproxCurrency(value).replace('-', '')
                        : approxValue.toString()
                    : `${approxValue}%`
            }
            side={tokenMetricSide === SideEnum.long ? 'long' : 'short'}
            value={value}
            currency={currency}
            poolTicker={poolTicker}
            showNextRebalance={showNextRebalance}
        >
            <div
                className={classNames(
                    approxValue === 0 ? 'text-cool-gray-500' : value > 0 ? 'text-green-600' : 'text-red-600',
                    'flex',
                )}
            >
                <div className="mr-1 flex">
                    {approxValue === 0 ? (
                        <Equal className="h-5 my-auto" />
                    ) : (
                        <ArrowDown className={classNames(value > 0 ? 'rotate-180' : '', 'h-5')} />
                    )}
                </div>
                <div>
                    {deltaDenotion === DeltaEnum.Numeric
                        ? currency
                            ? toApproxCurrency(value).replace('-', '')
                            : approxValue
                        : `${approxValue}%`}
                </div>
            </div>
        </UpOrDownTip>
    );
};
