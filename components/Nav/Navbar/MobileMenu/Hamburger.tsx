import React from 'react';
import styled from 'styled-components';

// const Hamburger
export default styled(({ className, setOpen, open }) => {
    const handleClick = () => {
        setOpen(!open);
    };
    return (
        <div onClick={handleClick} className={`${className} ${open ? 'open' : ''}`}>
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
        </div>
    );
})`
    width: 25px;
    height: 20px;
    position: relative;

    & span {
        display: block;
        position: absolute;
        height: 3px;
        width: 50%;
        background: #fff;
        opacity: 1;
        -webkit-transform: rotate(0deg);
        -moz-transform: rotate(0deg);
        -o-transform: rotate(0deg);
        transform: rotate(0deg);
        -webkit-transition: 0.25s ease-in-out;
        -moz-transition: 0.25s ease-in-out;
        -o-transition: 0.25s ease-in-out;
        transition: 0.25s ease-in-out;
    }

    span:nth-child(even) {
        left: 50%;
    }

    span:nth-child(odd) {
        left: 0;
    }

    span:nth-child(1),
    & span:nth-child(2) {
        top: 0;
    }

    span:nth-child(3),
    & span:nth-child(4) {
        top: 9px;
    }

    span:nth-child(5),
    & span:nth-child(6) {
        top: 18px;
    }

    &.open span:nth-child(1),
    &.open span:nth-child(6) {
        -webkit-transform: rotate(45deg);
        -moz-transform: rotate(45deg);
        -o-transform: rotate(45deg);
        transform: rotate(45deg);
    }

    &.open span:nth-child(2),
    &.open span:nth-child(5) {
        -webkit-transform: rotate(-45deg);
        -moz-transform: rotate(-45deg);
        -o-transform: rotate(-45deg);
        transform: rotate(-45deg);
    }

    &.open span:nth-child(1) {
        left: 5px;
        top: 5px;
    }

    &.open span:nth-child(2) {
        left: calc(50% - 1px);
        top: 5px;
    }

    &.open span:nth-child(3) {
        left: -50%;
        opacity: 0;
    }

    &.open span:nth-child(4) {
        left: 100%;
        opacity: 0;
    }

    &.open span:nth-child(5) {
        left: 5px;
        top: 12px;
    }

    &.open span:nth-child(6) {
        left: calc(50% - 1px);
        top: 12px;
    }
` as React.FC<{
    setOpen: (bool: boolean) => any;
    open: boolean;
}>;
