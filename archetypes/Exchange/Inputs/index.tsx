import React, { useEffect, useMemo } from 'react';
import { BigNumber } from 'bignumber.js';
import { InnerInputText, InputContainer } from '@components/General/Input';
import { Input } from '@components/General/Input/Numeric';
import { SwapState, useBigNumber, SwapAction } from '@context/SwapContext';
import { CommitActionEnum, SideEnum } from '@libs/constants';
import usePoolTokens from '@libs/hooks/usePoolTokens';
import { toApproxCurrency } from '@libs/utils/converters';
import styled from 'styled-components';
import { PoolInfo } from '@context/PoolContext/poolDispatch';
import usePoolsNextBalances from '@libs/hooks/usePoolsNextBalances';
import TokenSelect from '../TokenSelect';
import Max from '@components/General/Max';

type InvalidAmount = {
    isInvalid: boolean;
    message?: string;
};
/* HELPER FUNCTIONS */
const isInvalidAmount: (amount: BigNumber, balance: BigNumber) => InvalidAmount = (amount, balance) => {
    if (amount.eq(0)) {
        return {
            message: undefined,
            isInvalid: false,
        };
    }

    if (amount.gt(balance)) {
        return {
            message: undefined,
            isInvalid: true,
        };
    }

    return {
        message: undefined,
        isInvalid: false,
    };
};

export default (({ pool, userBalances, swapState, swapDispatch }) => {
    const { tokens } = usePoolTokens();

    const { amount, side, selectedPool, invalidAmount, commitAction } = swapState;

    const amountBN = useBigNumber(amount);

    const isLong = side === SideEnum.long;
    const token = useMemo(() => (isLong ? pool.longToken : pool.shortToken), [isLong, pool.longToken, pool.shortToken]);
    const tokenBalance = useMemo(
        () => (isLong ? userBalances.longToken : userBalances.shortToken),
        [isLong, userBalances.longToken, userBalances.shortToken],
    );

    const nextBalances = usePoolsNextBalances(pool);
    const notional = useMemo(() => (isLong ? nextBalances.nextLongBalance : nextBalances.nextShortBalance), [isLong]);

    const pendingBurns = useMemo(
        () => (isLong ? pool.committer.pendingLong.burn : pool.committer.pendingShort.burn),
        [isLong, pool.committer.pendingLong.burn, pool.committer.pendingShort.burn],
    );

    const tokenPrice = useMemo(() => (isLong ? pool.getNextLongTokenPrice() : pool.getNextShortTokenPrice()), [isLong]);

    useEffect(() => {
        if (pool) {
            let currentBalance: BigNumber;
            if (commitAction === CommitActionEnum.mint) {
                currentBalance = userBalances.quoteToken.balance;
            } else {
                currentBalance =
                    side === SideEnum.long ? userBalances.longToken.balance : userBalances.shortToken.balance;
            }

            const invalidAmount = isInvalidAmount(amountBN, currentBalance);

            swapDispatch({
                type: 'setInvalidAmount',
                value: invalidAmount,
            });
        }
    }, [side, commitAction, amount, notional, token, pendingBurns]);

    return (
        <Container>
            <Wrapper hasMargin>
                <Label>Token</Label>
                <TokenSelect
                    tokens={tokens}
                    selectedToken={token}
                    setToken={(pool, side) => {
                        swapDispatch({ type: 'setSelectedPool', value: pool as string });
                        swapDispatch({ type: 'setSide', value: side as SideEnum });
                    }}
                />
                <Subtext showContent={!!pool.address}>Expected Price: {toApproxCurrency(tokenPrice)}</Subtext>
            </Wrapper>
            <Wrapper>
                <Label>Amount</Label>

                {commitAction === CommitActionEnum.mint ? (
                    <AmountInput
                        invalidAmount={invalidAmount}
                        amount={amount}
                        amountBN={amountBN}
                        balance={userBalances.quoteToken.balance}
                        tokenSymbol={pool.quoteToken.symbol}
                        swapDispatch={swapDispatch}
                        selectedPool={selectedPool}
                        isPoolToken={false}
                    />
                ) : (
                    <AmountInput
                        invalidAmount={invalidAmount}
                        amount={amount}
                        amountBN={amountBN}
                        balance={tokenBalance.balance}
                        tokenSymbol={token.symbol}
                        swapDispatch={swapDispatch}
                        selectedPool={selectedPool}
                        isPoolToken={true}
                    />
                )}
            </Wrapper>
        </Container>
    );
}) as React.FC<{
    pool: PoolInfo['poolInstance'];
    userBalances: PoolInfo['userBalances'];
    swapState: SwapState;
    swapDispatch: React.Dispatch<SwapAction>;
}>;

type AmountProps = {
    invalidAmount: InvalidAmount;
    amountBN: BigNumber;
    amount: string;
    selectedPool: string | undefined;
    swapDispatch: React.Dispatch<SwapAction>;
    balance: BigNumber;
    tokenSymbol: string;
    isPoolToken: boolean;
};

const AmountInput: React.FC<AmountProps> = ({
    invalidAmount,
    selectedPool,
    amount,
    amountBN,
    swapDispatch,
    balance,
    // tokenSymbol,
    isPoolToken,
}) => {
    return (
        <>
            <InputContainerStyled variation={invalidAmount.isInvalid ? 'error' : undefined}>
                <InputStyled
                    value={amount}
                    onUserInput={(val) => {
                        swapDispatch({ type: 'setAmount', value: val || '' });
                    }}
                />
                <InnerInputText>
                    {/*{tokenSymbol ? (*/}
                    {/*    <Currency*/}
                    {/*        ticker={isPoolToken ? tokenSymbolToLogoTicker(tokenSymbol) : (tokenSymbol as LogoTicker)}*/}
                    {/*        label={tokenSymbol}*/}
                    {/*    />*/}
                    {/*) : null}*/}
                    <Max
                        className="m-auto"
                        onClick={(_e) =>
                            !!selectedPool &&
                            swapDispatch({
                                type: 'setAmount',
                                value: balance.toString(),
                            })
                        }
                    >
                        Max
                    </Max>
                </InnerInputText>
            </InputContainerStyled>
            <Subtext isAmountValid={invalidAmount.isInvalid} showContent>
                {invalidAmount.isInvalid && invalidAmount.message ? (
                    invalidAmount.message
                ) : (
                    <Available balance={balance} amountBN={amountBN} isPoolToken={isPoolToken} />
                )}
            </Subtext>
        </>
    );
};

const Available: React.FC<{
    amountBN: BigNumber;
    balance: BigNumber;
    isPoolToken: boolean;
}> = ({ amountBN, balance, isPoolToken }) => {
    const balanceAfter = BigNumber.max(amountBN.eq(0) ? balance : balance.minus(amountBN), 0);

    return (
        <>
            {`Available: `}
            {isPoolToken ? (
                <>
                    {`${balance.toFixed(2)} `}
                    {amountBN.gt(0) ? <span className="opacity-80">{`>>> ${balanceAfter.toFixed(2)}`}</span> : null}
                </>
            ) : (
                <>
                    {`${toApproxCurrency(balance)} `}
                    {amountBN.gt(0) ? (
                        <span className="opacity-80">{`>>> ${toApproxCurrency(balanceAfter)}`}</span>
                    ) : null}
                </>
            )}
        </>
    );
};

const Container = styled.div`
    @media (min-width: 640px) {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 15px;
    }
`;

const Wrapper = styled.div<{ hasMargin?: boolean }>`
    width: 100%;
    margin-bottom: ${({ hasMargin }) => (hasMargin ? '1rem' : '0')};
`;

const InputContainerStyled = styled(InputContainer)`
    width: 100%;
    border-color: ${({ theme }) => theme['border']};
    border-radius: 7px;
`;

const Label = styled.p`
    margin-bottom: 0.25rem;
    @media (min-width: 640px) {
        margin-bottom: 0.5rem;
    }
`;

const InputStyled = styled(Input)`
    width: 60%;
    height: 100%;
    font-weight: 600;
    font-size: 1rem;
    line-height: 1.5rem;
`;

const Subtext = styled.p<{ showContent: boolean; isAmountValid?: boolean }>`
    display: ${({ showContent }) => (showContent ? 'block' : 'none')};
    color: ${({ isAmountValid, theme }) => (isAmountValid ? '#ef4444' : theme.text)};
    font-size: 15px;
    opacity: 0.7;

    @media (min-width: 640px) {
        margin-top: 0.5rem;
    }
`;
