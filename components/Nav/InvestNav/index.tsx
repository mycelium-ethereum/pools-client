import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const EXCHANGE = 0;
const BROWSE = 1;

// const InvestNav
export default (() => {
    const router = useRouter();

    useEffect(() => {
        router.prefetch('/browse');
        router.prefetch('/');
    }, []);

    const handleRoute = (route: number) => {
        switch (route) {
            case BROWSE:
                router.push({
                    pathname: '/browse',
                });
                break;
            case EXCHANGE:
                router.push({
                    pathname: '/',
                });
                break;
            default:
                // nada
                break;
        }
    };

    return (
        <InvestNav>
            <Item onClick={(_e) => handleRoute(EXCHANGE)} selected={router.pathname === '/'}>
                Exchange
            </Item>
            <Item onClick={(_e) => handleRoute(BROWSE)} selected={router.pathname === '/browse'}>
                Browse
            </Item>
        </InvestNav>
    );
}) as React.FC;

const InvestNav = styled.div`
    background: #eeeef6;
    width: 100%;
    min-height: 60px;
    height: 60px;
    text-align: center;
    display: flex;
    justify-content: center;
`;

const Item = styled.div<{ selected: boolean }>`
    width: 120px;
    height: 44px;
    line-height: 44px;
    display: inline;
    border-radius: 10px;
    margin: auto 0;
    cursor: pointer;
    background: ${(props) => (props.selected ? '#fff' : 'none')};
    transition: 0.3s;

    color: #374151;
    &:hover {
        opacity: 0.8;
    }
`;
