import React from 'react';
import BigNumber from 'bignumber.js';
import { Currency } from '~/components/General/Currency';
import { InnerInputText } from '~/components/General/Input';
import { LogoTicker, tokenSymbolToLogoTicker } from '~/components/General/Logo';
import Max from '~/components/General/Max';

import { toApproxCurrency } from '~/utils/converters';
import * as Styles from './styles';
import { AmountProps } from './types';
import { BalanceTypeEnum } from '@tracer-protocol/pools-js';

const Available: React.FC<{
    amountBN: BigNumber;
    balance: BigNumber;
    otherBalance?: BigNumber;
    balanceType: BalanceTypeEnum | undefined;
    isPoolToken: boolean;
}> = ({ amountBN, balance, otherBalance, balanceType, isPoolToken }) => {
    const balanceAfter = BigNumber.max(amountBN.eq(0) ? balance : balance.minus(amountBN), 0);

    const tokenSource = () => {
        console.log(balanceType);
        switch (balanceType) {
            case BalanceTypeEnum.escrow:
                return 'wallet';
            default:
                return 'escrow';
        }
    };

    return (
        <>
            {isPoolToken ? (
                <>
                    {`${balance.toFixed(3)} `}
                    {amountBN.gt(0) ? <span className="opacity-80">{`>>> ${balanceAfter.toFixed(3)}`}</span> : null}
                    {` tokens available`}
                    {otherBalance && otherBalance.gt(0) ? (
                        <>
                            <br />
                            <span className="opacity-80">{`${otherBalance.toFixed(3)} in ${tokenSource()}`}</span>
                        </>
                    ) : null}
                </>
            ) : (
                <>
                    {`${toApproxCurrency(balance)} available `}
                    {amountBN.gt(0) ? (
                        <span className="opacity-80">{`>>> ${toApproxCurrency(balanceAfter)}`}</span>
                    ) : null}
                </>
            )}
        </>
    );
};

const AmountInput: React.FC<AmountProps> = ({
    invalidAmount,
    selectedPool,
    amount,
    amountBN,
    swapDispatch,
    balance,
    otherBalance,
    tokenSymbol,
    isPoolToken,
    balanceType,
    decimalPlaces = 8,
}) => {
    return (
        <>
            <Styles.InputContainerStyled variation={invalidAmount.isInvalid ? 'error' : undefined}>
                <Styles.InputStyled
                    value={amount}
                    step="0.01"
                    maxDecimals={decimalPlaces}
                    pattern="[1-9]\d*"
                    onUserInput={(val) => {
                        swapDispatch({ type: 'setAmount', value: val || '' });
                    }}
                />
                <InnerInputText>
                    {tokenSymbol ? (
                        <Currency
                            ticker={isPoolToken ? tokenSymbolToLogoTicker(tokenSymbol) : (tokenSymbol as LogoTicker)}
                            label={tokenSymbol}
                        />
                    ) : null}
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
            </Styles.InputContainerStyled>
            <Styles.Subtext isAmountValid={invalidAmount.isInvalid} showContent>
                {invalidAmount.isInvalid && invalidAmount.message ? (
                    invalidAmount.message
                ) : (
                    <Available
                        balance={balance}
                        otherBalance={otherBalance}
                        amountBN={amountBN}
                        balanceType={balanceType}
                        isPoolToken={isPoolToken}
                    />
                )}
            </Styles.Subtext>
        </>
    );
};
export default AmountInput;
