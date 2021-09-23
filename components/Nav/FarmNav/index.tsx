import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import TooltipSelector, { TooltipKeys } from '@components/Tooltips/TooltipSelector';

const POOLTOKEN = 0;
const BPT = 1;

// const InvestNav
export default (({ left, right }) => {
    const router = useRouter();

    useEffect(() => {
        router.prefetch('/stakepooltoken');
        router.prefetch('/stakebpt');
    }, []);

    const handleRoute = (route: number) => {
        switch (route) {
            case POOLTOKEN:
                router.push({
                    pathname: '/stakepooltoken',
                });
                break;
            case BPT:
                router.push({
                    pathname: '/stakebpt',
                });
                break;
            default:
                // nada
                break;
        }
    };

    return (
        <StakeNav>
            <div className="absolute left-0 top-0 bottom-0 flex items-center">{left}</div>
            <div className="flex flex-grow justify-center">
                <Item onClick={(_e) => handleRoute(POOLTOKEN)} selected={router.pathname === '/stakepooltoken'}>
                    Stake Pool Token
                </Item>
                <Item onClick={(_e) => console.log(`${BPT} coming soon`)} selected={router.pathname === '/stakebpt'}>
                    <TooltipSelector tooltip={{ key: TooltipKeys.ComingSoon }}>Stake BPT</TooltipSelector>
                </Item>
            </div>
            <div className="absolute right-0 top-0 bottom-0 flex items-center">{right}</div>
        </StakeNav>
    );
}) as React.FC<{
    left?: JSX.Element;
    right?: JSX.Element;
}>;

const StakeNav = styled.div`
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
    width: 130px;
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
