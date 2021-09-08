import { Children } from 'libs/types/General';
import React from 'react';
import styled from 'styled-components';

export const DateAndTime = styled(({ className, date, time }) => {
    return (
        <div className={className}>
            {date}
            <div className="secondary">{time}</div>
        </div>
    );
})`
    font-size: var(--font-size-small);

    .secondary {
        color: var(--color-secondary);
    }
`;

export const Container = styled(({ className, children }) => {
    return <div className={`${className} container`}>{children}</div>;
})``;

export const Card = styled.div`
    background: #011772;
    box-shadow: 0 5px 10px #00000029;
    border-radius: 5px;
    transition: 0.3s;

    h1 {
        font-size: var(--font-size-medium);
        letter-spacing: var(--letter-spacing-extra-small);
        color: #ffffff;
    }
`;

type SProps = {
    className?: string;
    label: string;
} & Children;
export const Section = styled(({ className, children, label }: SProps) => {
    return (
        <div className={`${className}`}>
            <div className={'label'}>{label}</div>
            <span className={'content'}>{children}</span>
        </div>
    );
})<SProps>`
    width: 100%;
    display: flex;
    padding-bottom: 0.3rem;
    &:last-child {
        padding-bottom: 0;
    }
    font-size: var(--font-size-small);
    box-sizing: border-box;

    > .label {
        text-align: left;
        white-space: nowrap;
        color: var(--color-primary);
        text-transform: capitalize;
    }

    > .content {
        text-align: right;
        width: 100%;
        padding-left: 0.25rem;
    }
`;

export const Previous = styled.span`
    color: var(--color-secondary);
    margin-right: 5px;
    &:after {
        padding-left: 2px;
        content: '>>>';
    }
`;
export const Approx = styled.span`
    color: var(--color-secondary);
    margin-right: 5px;
    &:before {
        padding-left: 2px;
        content: '~';
    }
`;

export const After = styled.span`
    color: var(--color-secondary);
    &:before {
        padding-right: 0.5rem;
        content: '>>>';
    }
`;

export const Close = styled.button`
    position: absolute;
    top: 16px;
    right: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 56px;
    height: 28px;
    border: 1px solid var(--color-primary);
    border-radius: 50px;
    background-image: url('/img/general/close.svg');
    background-position: center center;
    background-size: 17px 17px;
    background-repeat: no-repeat;
    transition: background-color 0.5s ease;
    backface-visibility: hidden;

    &:hover {
        cursor: pointer;
        background-color: var(--color-primary);
        background-image: url('/img/general/close-white.svg');
    }
`;

type IProps = {
    percent: number;
    className?: string;
};

export const ProgressBar = styled(({ percent, className }: IProps) => {
    return (
        <div className={className}>
            <div className="progress" />
            <p className="label">{percent}%</p>
        </div>
    );
})<IProps>`
    background: var(--color-accent);
    position: relative;
    height: 32px;
    border-radius: 20px;

    > .progress {
        transition: 0.3s;
        background: var(--color-primary);
        height: 100%;
        width: ${(props) => `${props.percent}%`};
        border-radius: 20px;
        max-width: 100%;
    }

    > .label {
        letter-spacing: var(--letter-spacing-small);
        font-size: var(--font-size-small);
        position: absolute;
        height: fit-content;
        width: fit-content;
        top: 0;
        bottom: 0;
        left: ${(props) => (props.percent !== 0 && props.percent < 100 ? 'auto' : '0')};
        right: ${(props) => (props.percent !== 0 && props.percent < 100 ? 'auto' : '0')};
        left: ${(props) =>
            `${props.percent !== 0 && props.percent < 100 ? `calc(${props.percent / 2}% - 16px)` : '0'}`};
        margin: auto;
    }
`;

export * from './Dropdown';
export * from './Logo';
export * from './Button';
// export * from './Input';
// export * from './Notification';
// export * from './';
