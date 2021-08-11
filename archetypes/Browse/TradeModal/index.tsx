import React, { useContext } from 'react';
import SlideSelect, { Option } from '@components/General/SlideSelect';
import TracerModal from '@components/General/TracerModal';
import { SwapContext, defaultState, noDispatch } from '@context/SwapContext';
import { MINT, SHORT, SideType, TokenType } from '@libs/types/General';
import { Button, Input } from '@components/General';
import styled from 'styled-components';
import { SectionContainer, Label } from '@components/Pool';
import { Pool } from '@hooks/usePool';
import { etherToApproxCurrency } from '@libs/utils';
import { BigNumber } from 'bignumber.js';

export default (({ show, onClose, pool }) => {
    const { swapState = defaultState, swapDispatch = noDispatch } = useContext(SwapContext);
    const balance = tokenBalance(pool.pool, pool.token, swapState.tokenType);

    const handleClick = () => {
        if (pool.pool) {
            if (!swapState.amount) {
                console.error('Commit amount cannot be 0');
                return;
            }
            const { pool: pool_, token } = pool;
            if (swapState?.tokenType === MINT) {
                pool_.mint(swapState.amount, token === SHORT);
            } else {
                pool_.burn(swapState.amount, token === SHORT);
            }
        }
    };

    return (
        <TracerModal loading={false} show={show} onClose={onClose}>
            <TokenName {...pool} />
            <StyledSlideSelect
                onClick={(index) => swapDispatch({ type: 'setTokenType', value: index as TokenType })}
                value={swapState?.tokenType}
            >
                <Option>Mint</Option>
                <Option>Burn</Option>
            </StyledSlideSelect>
            <SectionContainer>
                <Label>Amount</Label>
                <Input
                    value={Number.isNaN(swapState?.amount) ? '' : swapState.amount}
                    placeholder={'0.0'}
                    onChange={(e: any) => swapDispatch({ type: 'setAmount', value: parseInt(e.currentTarget.value) })}
                />
                <Balance>Available: {etherToApproxCurrency(balance)}</Balance>
            </SectionContainer>
            <Button onClick={handleClick}>{swapState?.tokenType === MINT ? 'Mint' : 'Burn'}</Button>
        </TracerModal>
    );
}) as React.FC<{
    show: boolean;
    onClose: () => void;
    pool: {
        pool: Pool | undefined;
        token: SideType;
    };
}>;

const tokenBalance: (pool: Pool | undefined, token: SideType, tokenType: TokenType) => BigNumber = (
    pool,
    token,
    tokenType,
) => {
    if (pool) {
        if (tokenType === MINT) {
            return pool.tokenState.tokenBalances.quoteToken;
        } else {
            // is burn
            return token === SHORT ? pool.tokenState.tokenBalances.shortToken : pool.tokenState.tokenBalances.longToken;
        }
    }
    return new BigNumber(0);
};

const Balance = styled.div``;

const TokenName: React.FC<{
    pool: Pool | undefined;
    token: SideType;
}> = ({ pool, token }) => {
    const tokenState = pool?.tokenState;
    return <Title>{token === SHORT ? tokenState?.shortTokenName : tokenState?.longTokenName}</Title>;
};

const Title = styled.h2``;

const StyledSlideSelect = styled(SlideSelect)`
    margin-top: 2rem;
`;
