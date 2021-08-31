import React, { useState } from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';

const Dark = styled.img`
	position: absolute;
	right: 2px;
	width: 12px;
	height: 12px;
	opacity: 1;
	top: 0;
	bottom: 0;
	margin: auto;
	transition .4s;
`;
const Light = styled.img`
	position: absolute;
	left: 2px;
	width: 12px;
	height: 12px;
	opacity: 0;
	margin: auto;
	top: 0;
	bottom: 0;
	transition .4s;
`;

const Slider = styled.span`
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    border-radius: 34px;
    -webkit-transition: 0.4s;
    transition: 0.4s;

    &:before {
        position: absolute;
        content: '';
        height: 16px;
        width: 16px;
        left: 4px;
        bottom: 3px;
        background-color: white;
        -webkit-transition: 0.4s;
        transition: 0.4s;
        border-radius: 50%;
    }
`;

export default styled(({ className }) => {
    const [toggle, setToggle] = useState(true);

    const handleClick = (_e: any) => {
        document.getElementsByTagName('html')[0].classList.toggle('light');
        setToggle(!toggle);
    };

    useEffect(() => {
        document.getElementsByTagName('html')[0].classList.add('light');
    }, []);

    return (
        <div onClick={handleClick} className={`${className} ${toggle ? 'checked' : ''}`}>
            <Slider />
            <Dark src="/img/general/dark_theme.png" />
            <Light src="/img/general/light_theme.png" />
        </div>
    );
})`
    position: relative;
    display: inline-block;
    width: 40px;
    height: 22px;
    margin: auto 0;

    &.checked {
        ${Slider} {
            background-color: var(--color-primary);
            box-shadow: 0 0 1px var(--color-primary);
        }
        ${Slider}:before {
            -webkit-transform: translateX(16px);
            -ms-transform: translateX(16px);
            transform: translateX(16px);
        }

        ${Dark} {
            opacity: 0;
        }

        ${Light} {
            opacity: 1;
        }
    }
`;
