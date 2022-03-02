import React, { useCallback } from 'react';
import { Group } from '@visx/group';
import { curveBasis } from '@visx/curve';
import { LinePath, Line, Bar } from '@visx/shape';
import { ParentSize } from '@visx/responsive';
import { scaleTime, scaleLinear } from '@visx/scale';
import { GridRows } from '@visx/grid';
import { AxisLeft, AxisBottom } from '@visx/axis';
import bitcoinPrice, { BitcoinPrice } from '@visx/mock-data/lib/mocks/bitcoinPrice';
import { calcPercentageDifference, toApproxCurrency } from '@libs/utils/converters';
import { useTooltip, useTooltipInPortal, defaultStyles } from '@visx/tooltip';
// @ts-ignore
import { bisector, extent } from 'd3-array';

import { localPoint } from '@visx/event';
import { classNames } from '@libs/utils/functions';

export const background = '#f3f3f3';

const sortedPrices = bitcoinPrice.prices.sort((a, b) => new Date(a.time).valueOf() - new Date(b.time).valueOf());

// accessors
const date = (d: BitcoinPrice) => new Date(d.time).valueOf();
const price = (d: BitcoinPrice) => parseInt(d.price);
const dateBisector = bisector<BitcoinPrice, Date>((d: BitcoinPrice) => new Date(d.time)).left;

// scales
const timeScale = scaleTime<number>({
    domain: extent(sortedPrices, date) as [Date, Date],
});

const priceScale = scaleLinear<number>({
    domain: [
        Math.min(...sortedPrices.map((d) => parseInt(d.price))),
        Math.max(...sortedPrices.map((d) => parseInt(d.price))),
    ],
    nice: true,
});

const defaultMargin = { top: 20, right: 20, bottom: 30, left: 60 };

const TRACER_BLUE = '#5555E9';

export type ThresholdProps = {
    width: number;
    height: number;
    margin?: { top: number; right: number; bottom: number; left: number };
};

export default (({ margin = defaultMargin }) => {
    const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } = useTooltip<BitcoinPrice>();
    const userDeposits = 1200;

    const { containerRef, TooltipInPortal } = useTooltipInPortal({
        detectBounds: true,
        scroll: true,
    });

    // tooltip handler
    const handleTooltip = useCallback(
        (event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>) => {
            const { x } = localPoint(event) || { x: 0 };
            const trueX = x - margin.left;
            const x0 = timeScale.invert(trueX);
            const index = dateBisector(sortedPrices, x0, 1);
            const d0 = sortedPrices[index - 1];
            const d1 = sortedPrices[index];
            let d = d0;
            if (d1 && date(d1)) {
                d = x0.valueOf() - date(d0).valueOf() > date(d1).valueOf() - x0.valueOf() ? d0 : d1;
            }
            showTooltip({
                tooltipData: d,
                tooltipLeft: trueX,
                tooltipTop: priceScale(price(d)),
            });
        },
        [showTooltip],
    );

    return (
        <ParentSize>
            {(parent) => {
                const { width, height } = parent;

                // bounds
                const xMax = width - margin.left - margin.right;
                const yMax = height - margin.top - margin.bottom;

                timeScale.range([0, xMax]);
                priceScale.range([yMax, 0]);
                return (
                    <>
                        <svg ref={containerRef} width={width} height={height}>
                            <rect x={0} y={0} width={width} height={height} fill={'transparent'} rx={14} />
                            <Group left={margin.left} top={margin.top}>
                                <AxisBottom
                                    tickClassName={'axis-ticks'}
                                    top={yMax}
                                    scale={timeScale}
                                    hideAxisLine
                                    hideTicks
                                    numTicks={width > 520 ? 10 : 5}
                                />
                                <AxisLeft
                                    numTicks={4}
                                    tickClassName={'axis-ticks'}
                                    tickStroke={'white'}
                                    hideTicks
                                    hideAxisLine
                                    scale={priceScale}
                                    tickFormat={(tick) => toApproxCurrency(tick.valueOf())}
                                />
                                <GridRows
                                    scale={priceScale}
                                    width={xMax}
                                    className={'grid-line'}
                                    numTicks={3}
                                    strokeWidth={1}
                                />
                                <LinePath
                                    data={sortedPrices}
                                    curve={curveBasis}
                                    x={(d) => timeScale(date(d)) ?? 0}
                                    y={(d) => priceScale(price(d)) ?? 0}
                                    stroke={TRACER_BLUE}
                                    strokeWidth={1.5}
                                />
                                <Bar
                                    width={xMax}
                                    height={yMax}
                                    fill="transparent"
                                    rx={14}
                                    onTouchStart={handleTooltip}
                                    onTouchMove={handleTooltip}
                                    onMouseMove={handleTooltip}
                                    onMouseLeave={() => hideTooltip()}
                                />
                                <Line
                                    from={{ x: 0, y: priceScale(userDeposits) }}
                                    to={{ x: xMax, y: priceScale(userDeposits) }}
                                    stroke={'#A6A6F2'}
                                    strokeWidth={2}
                                    pointerEvents="none"
                                    strokeDasharray="5,2"
                                />
                                {tooltipData && (
                                    <g>
                                        <circle
                                            cx={tooltipLeft}
                                            cy={tooltipTop}
                                            r={3}
                                            fill={parseInt(tooltipData.price) < userDeposits ? '#F05252' : '#0E9F6E'}
                                            strokeWidth={2}
                                            pointerEvents="none"
                                        />
                                        <circle
                                            cx={tooltipLeft}
                                            cy={tooltipTop}
                                            r={5}
                                            fillOpacity={0.5}
                                            fill={parseInt(tooltipData.price) < userDeposits ? '#F05252' : '#0E9F6E'}
                                            strokeWidth={2}
                                            pointerEvents="none"
                                        />
                                    </g>
                                )}
                            </Group>
                        </svg>
                        {tooltipOpen &&
                            (() => {
                                const difference = calcPercentageDifference(
                                    parseInt(tooltipData?.price ?? '0'),
                                    userDeposits,
                                );
                                return (
                                    <TooltipInPortal
                                        // set this to random so it correctly updates with parent bounds
                                        key={Math.random()}
                                        applyPositionStyle
                                        top={tooltipTop}
                                        offsetTop={-80}
                                        left={tooltipLeft}
                                        className={'py-4 px-8 rounded-lg bg-white dark:bg-cool-gray-800'}
                                        style={{
                                            ...defaultStyles,
                                        }}
                                    >
                                        <p className="text-sm text-cool-gray-400">
                                            {new Date(tooltipData?.time ?? Date.now()).toLocaleDateString()}
                                        </p>
                                        <p className={'text-lg font-semibold text-cool-gray-900 dark:text-white'}>
                                            {toApproxCurrency(parseInt(tooltipData?.price ?? '0'))}
                                        </p>
                                        <p
                                            className={classNames(
                                                'text-sm',
                                                difference >= 0 ? 'text-green-500' : 'text-red-500',
                                            )}
                                        >
                                            {difference.toFixed(2)}%
                                        </p>
                                        <div className="arrow-down border-t-white dark:border-t-cool-gray-800" />
                                    </TooltipInPortal>
                                );
                            })()}
                        <style>
                            {`
                            .axis-ticks text {
                                fill: var(--text);
                            }
                            .grid-line line {
                                stroke: #9CA3AF;
                            }
                            html.dark .grid-line line {
                                stroke: #1F2A37;
                            }
                            .arrow-down {
                                position: absolute;
                                width: 0; 
                                height: 0; 
                                top: 100%;
                                left: calc(50% - 10px);
                                border-left: 10px solid transparent;
                                border-right: 10px solid transparent;
                                border-top: 10px solid;
                            }
                        `}
                        </style>
                    </>
                );
            }}
        </ParentSize>
    );
}) as React.FC<{
    margin?: {
        top: number;
        bottom: number;
        left: number;
        right: number;
    };
}>;
