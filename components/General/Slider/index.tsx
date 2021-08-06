import React from 'react';
import styled from 'styled-components';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const DEFAULT_VALUE = 0;
const DEFAULT_MIN = 0;
const DEFAULT_MAX = 100;
const DEFAULT_STEP = 0.5;

const createMarks = (min: number, max: number) => ({
    [min]: {
        style: {
            marginTop: '1rem',
            color: '#005EA4',
            fontSize: '1rem',
        },
        label: `${min}x`,
    },
    [max / 2]: {
        style: {
            marginTop: '1rem',
            color: '#005EA4',
            fontSize: '1rem',
        },
        label: `${max / 2}x`,
    },
    [max]: {
        style: {
            marginTop: '1rem',
            color: '#005EA4',
            fontSize: '1rem',
        },
        label: `${max}x`,
    },
});

const defaultRailStyle = { backgroundColor: 'var(--color-accent)', height: 10 };
const defaultTrackStyle = { backgroundColor: 'var(--color-accent)', height: 10 };
const defaultHandleStyle = {
    width: '65px',
    height: '32px',
    background: 'var(--color-primary)',
    borderRadius: '20px',
    marginTop: '-9px',
};

const HandleValue = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: var(--font-size-medium);
`;

const { Handle } = Slider;
const DefaultHandle = (e: any) => {
    const { value } = e;
    return (
        <Handle {...e}>
            <HandleValue>{value}x</HandleValue>
        </Handle>
    );
};

type DSProps = {
    className?: string;
    defaultValue?: number;
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    marks?: any;
    railStyle?: React.CSSProperties;
    trackStyle?: React.CSSProperties;
    handleStyle?: React.CSSProperties;
    handleChange: (val: number) => any;
};
const DefaultSlider: React.FC<DSProps> = styled(
    ({
        className,
        defaultValue,
        value,
        min,
        max,
        step,
        marks,
        railStyle,
        trackStyle,
        handleStyle,
        handleChange,
    }: DSProps) => {
        const min_ = min ?? DEFAULT_MIN;
        const max_ = max ?? DEFAULT_MAX;
        return (
            <div className={className}>
                <Slider
                    defaultValue={defaultValue ? defaultValue : DEFAULT_VALUE}
                    value={value}
                    min={min_}
                    max={max_}
                    step={step ?? DEFAULT_STEP}
                    marks={marks ?? createMarks(min_, max_)}
                    railStyle={railStyle ? railStyle : defaultRailStyle}
                    trackStyle={trackStyle ? trackStyle : defaultTrackStyle}
                    handleStyle={handleStyle ? handleStyle : defaultHandleStyle}
                    handle={DefaultHandle}
                    onChange={handleChange}
                />
            </div>
        );
    },
)`
    .rc-slider-dot {
        display: none;
    }
`;

export default DefaultSlider;
