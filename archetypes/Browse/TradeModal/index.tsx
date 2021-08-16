import React, { useContext } from 'react';
import SlideSelect, { Option } from '@components/General/SlideSelect';
import TracerModal from '@components/General/TracerModal';
import { SwapContext, defaultState, noDispatch } from '@context/SwapContext';
import { TokenType } from '@libs/types/General';
import { Button, Input } from '@components/General';
import styled from 'styled-components';
import { SectionContainer, Label } from '@components/Pool';
import { Pool } from '@hooks/usePool';
import { etherToApproxCurrency, toApproxCurrency } from '@libs/utils';
import { BigNumber } from 'bignumber.js';
import PoolSummary from './PoolSummary';
import { PoolToken } from '@hooks/usePool/tokenDispatch';
import { MINT, SHORT } from '@libs/constants';
import { DEFAULT_POOLSTATE } from '@libs/constants/pool';

export default (({ show, onClose, pool, token }) => {
    const { swapState = defaultState, swapDispatch = noDispatch } = useContext(SwapContext);
    const balance = tokenBalance(pool, token, swapState.tokenType);

    const handleClick = () => {
        if (pool) {
            if (!swapState.amount) {
                console.error('Commit amount cannot be 0');
                return;
            }
            if (swapState?.tokenType === MINT) {
                pool.mint(swapState.amount, token.side === SHORT);
            } else {
                pool.burn(swapState.amount, token.side === SHORT);
            }
        }
    };

    return (
        <TracerModal loading={false} show={show} onClose={onClose}>
            <Title>{token.tokenName}</Title>
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
                <Balance>Available: {toApproxCurrency(balance)}</Balance>
            </SectionContainer>
            <PoolSummary 
                tokenName={token.tokenName}
                rebalanceMultiplier={pool?.poolState.rebalanceMultiplier ?? DEFAULT_POOLSTATE.rebalanceMultiplier}
                expectedPrice={pool?.poolState?.lastPrice ?? DEFAULT_POOLSTATE.lastPrice}
                nextRebalance={pool?.poolState?.nextRebalance ?? DEFAULT_POOLSTATE.nextRebalance}
            />
            <Button onClick={handleClick}>{swapState?.tokenType === MINT ? 'Mint' : 'Burn'}</Button>
        </TracerModal>
    );
}) as React.FC<{
    show: boolean;
    onClose: () => void;
    pool: Pool | undefined;
    token: PoolToken;
}>;

const tokenBalance: (pool: Pool | undefined, token: PoolToken, tokenType: TokenType) => BigNumber = (
    pool,
    token,
    tokenType,
) => {
    if (pool) {
        if (tokenType === MINT) {
            return pool.tokenState.quoteToken.balance;
        } else {
            // is burn
            return token.balance
        }
    }
    return new BigNumber(0);
};


const Balance = styled.div``;

const Title = styled.h2``;

const StyledSlideSelect = styled(SlideSelect)`
    margin-top: 2rem;
`;
