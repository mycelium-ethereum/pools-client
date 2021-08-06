import React, { useEffect, useState } from 'react';
import { Children } from 'libs/types';
import styled from 'styled-components';

const BGSlider = styled.div<{ position: number; width: number }>`
    transition: 0.5s;
    background-color: var(--color-primary);
    height: 100%;
    width: ${(props) => props.width}%;
    border-radius: 18px;
    position: absolute;
    top: 0;
    left: 0;
    margin-left: ${(props) => props.position}%;
`;

type TSSProps = {
    onClick: (index: number, e: any) => any;
    value: number;
    className?: string;
} & Children;

const SlideSelect: React.FC<TSSProps> = styled(({ onClick, value, children, className }: TSSProps) => {
    const [numChildren, setNumChildren] = useState(0);
    const calcPosition = (numChildren: number) => value * (1 / numChildren) * 100;
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
                        onClick={(e) => onClick(index, e)}
                        key={`slide-option-${index}`}
                        className={`${index === value ? 'selected' : ''}`}
                    >
                        {child}
                    </SlideOption>
                );
            })}
            <BGSlider className="bg-slider" position={calcPosition(numChildren)} width={(1 / numChildren) * 100} />
        </div>
    );
})`
    display: flex;
    margin: auto;
    border: 1px solid var(--color-primary);
    border-radius: 20px;
    height: 32px;
    position: relative;
`;

export const SlideOption = styled.div`
    display: flex;
    border-radius: 18px;
    font-size: var(--font-size-small);
    text-align: center;
    width: 100%;
    z-index: 1;

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
