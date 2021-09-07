import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const EXCHANGE = 0;
const BROWSE = 1;

// const InvestNav
export default (({ left, right }) => {
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
            <div className="absolute left-0 top-0 bottom-0 flex items-center">{left}</div>
            <div className="flex flex-grow justify-center">
                <Item onClick={(_e) => handleRoute(EXCHANGE)} selected={router.pathname === '/'}>
                    Exchange
                </Item>
                <Item onClick={(_e) => handleRoute(BROWSE)} selected={router.pathname === '/browse'}>
                    Browse
                </Item>
            </div>
            <div className="absolute right-0 top-0 bottom-0 flex items-center">{right}</div>
        </InvestNav>
    );
}) as React.FC<{
    left?: JSX.Element;
    right?: JSX.Element;
}>;

const InvestNav = styled.div`
    position: relative;
    background: #eeeef6;
    width: 100%;
    min-height: 60px;
    height: 60px;
    text-align: center;
    display: flex;
    // justify-content: space-between;
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
