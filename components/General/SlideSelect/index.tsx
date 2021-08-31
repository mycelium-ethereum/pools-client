import React, { useEffect, useState } from 'react';
import { Children } from 'libs/types/General';
import styled from 'styled-components';

const BGSlider = styled.div<{ selected: number; width: number; numChildren: number }>`
    transition: 0.5s;
    background-color: var(--color-primary);
    height: 100%;
    width: ${(props) => props.width}%;
    position: absolute;
    opacity: ${(props) => (Number.isNaN(props.selected) ? '0' : '1')};
    top: 0;
    left: 0;
    margin-left: ${(props) => calcPosition(props.numChildren, props.selected)}%;
    border-radius: ${(props) => getBorder(props.numChildren, props.selected)}}; 
`;

const getBorder: (numChildren: number, selected: number) => string = (numChildren, selected) => {
    if (selected === 0) {
        return '7px 0px 0px 7px';
    } else if (selected === numChildren - 1) {
        return '0px 7px 7px 0px';
    } else {
        return '0';
    }
};

const calcPosition: (numChildren: number, selected: number) => number = (numChildren, selected) =>
    selected * (1 / numChildren) * 100;

type TSSProps = {
    onClick: (index: number, e: any) => any;
    value: number;
    className?: string;
} & Children;

const SlideSelect = styled(({ onClick, value, children, className }: TSSProps) => {
    const [numChildren, setNumChildren] = useState(0);

    useEffect(() => {
        // on init
        const numChildren = React.Children.toArray(children).length;
        setNumChildren(numChildren);
    }, []);

    return (
        <div className={className}>
            {React.Children.toArray(children).map((child, index) => {
                return (
                    <SlideOption
                        onClick={(e: any) => onClick(index, e)}
                        key={`slide-option-${index}`}
                        className={`${index === value ? 'selected' : ''}`}
                    >
                        {child}
                    </SlideOption>
                );
            })}
            <BGSlider
                className="bg-slider"
                numChildren={numChildren}
                selected={value}
                width={Math.ceil((1 / numChildren) * 100)}
            />
        </div>
    );
})<TSSProps>`
    display: flex;
    margin: auto;
    border: 1px solid var(--color-primary);
    border-radius: 7px;
    height: 32px;
    position: relative;
`;

export const SlideOption = styled.div`
    display: flex;
    font-size: var(--font-size-small);
    text-align: center;
    width: 100%;
    z-index: 1;
    transition: 0.2s;

    border-right: 1px solid #d1d5db;

    &:first-child {
        border-radius: 7px 0px 0px 7px;
    }

    &:nth-last-child(2) {
        border-radius: 0px 7px 7px 0px;
        border: none;
    }

    &.selected {
        color: #fff;
        border: none;
    }

    &:hover {
        cursor: pointer;
    }
`;

SlideSelect.defaultProps = {
    onClick: () => undefined,
    value: 0,
};

export * from './Options';
export default SlideSelect;
