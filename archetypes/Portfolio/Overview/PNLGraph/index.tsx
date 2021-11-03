import React from 'react';
import { Group } from '@visx/group';
import { curveBasis } from '@visx/curve';
import { LinePath } from '@visx/shape';
import { ParentSize } from '@visx/responsive';
import { scaleTime, scaleLinear } from '@visx/scale';
import { GridRows } from '@visx/grid';
import { AxisLeft, AxisBottom } from '@visx/axis';
import bitcoinPrice, { BitcoinPrice } from '@visx/mock-data/lib/mocks/bitcoinPrice';
import { toApproxCurrency } from '@libs/utils/converters';
// import { useTheme } from '@context/ThemeContext';

export const background = '#f3f3f3';

// accessors
const date = (d: BitcoinPrice) => new Date(d.time).valueOf();
const price = (d: BitcoinPrice) => parseInt(d.price);

// scales
const timeScale = scaleTime<number>({
    domain: [Math.min(...bitcoinPrice.prices.map(date)), Math.max(...bitcoinPrice.prices.map(date))],
});

const priceScale = scaleLinear<number>({
    domain: [
        Math.min(...bitcoinPrice.prices.map((d) => parseInt(d.price))),
        Math.max(...bitcoinPrice.prices.map((d) => parseInt(d.price))),
    ],
    nice: true,
});

const defaultMargin = { top: 20, right: 20, bottom: 30, left: 60 };

const TRACER_BLUE = '#3DA8F5';
// const COLORS = {
// 	darkText: '#374151',
// 	lightText: '#FAFAFA'
// }

export type ThresholdProps = {
    width: number;
    height: number;
    margin?: { top: number; right: number; bottom: number; left: number };
};

export default (({ margin = defaultMargin }) => {
    // const { isDark } = useTheme();
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
                    <svg width={width} height={height}>
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
                                numTicks={4}
                                strokeWidth={1}
                            />
                            <LinePath
                                data={bitcoinPrice.prices}
                                curve={curveBasis}
                                x={(d) => timeScale(date(d)) ?? 0}
                                y={(d) => priceScale(price(d)) ?? 0}
                                stroke={TRACER_BLUE}
                                strokeWidth={1.5}
                            />
                        </Group>
                        <style>{`
			.axis-ticks text {
				fill: var(--text);
			}
			.grid-line line {
				stroke: #9CA3AF;
			}
			html.dark .grid-line line {
				stroke: #1F2A37;
			}
		`}</style>
                    </svg>
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
