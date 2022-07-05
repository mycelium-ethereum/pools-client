import React from 'react';
import BigNumber from 'bignumber.js';
import { Currency } from '~/components/General/Currency';
import { InnerInputText } from '~/components/General/Input';
import { LogoTicker, tokenSymbolToLogoTicker } from '~/components/General/Logo';
import Max from '~/components/General/Max';

import { toApproxCurrency } from '~/utils/converters';
import * as Styles from './styles';
import { AmountProps } from './types';

const Available: React.FC<{
    amountBN: BigNumber;
    balance: BigNumber;
    escrowBalance?: BigNumber;
    isPoolToken: boolean;
}> = ({ amountBN, balance, escrowBalance, isPoolToken }) => {
    const balanceAfter = BigNumber.max(amountBN.eq(0) ? balance : balance.minus(amountBN), 0);

    return (
        <>
            {isPoolToken ? (
                <>
                    {`${balance.toFixed(3)} `}
                    {amountBN.gt(0) ? <span className="opacity-80">{`>>> ${balanceAfter.toFixed(3)}`}</span> : null}
                    {` tokens available`}
                    {escrowBalance && escrowBalance.gt(0) ? (
                        <>
                            <br />
                            <span className="opacity-80">{`${escrowBalance.toFixed(3)} in escrow`}</span>
                        </>
                    ) : null}
                </>
            ) : (
                <>
                    {`${toApproxCurrency(balance)} available `}
                    {amountBN.gt(0) ? (
                        <span className="opacity-80">{`>>> ${toApproxCurrency(balanceAfter)}`}</span>
                    ) : null}
                    {/* {escrowBalance && escrowBalance.gt(0) ? (
                        <>
                            <br />
                            <span className="opacity-80">{` ${toApproxCurrency(balanceAfter)} in escrow`}</span>
                        </>
                    ) : null} */}
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
    escrowBalance,
    tokenSymbol,
    isPoolToken,
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
                        escrowBalance={escrowBalance}
                        amountBN={amountBN}
                        isPoolToken={isPoolToken}
                    />
                )}
            </Styles.Subtext>
        </>
    );
};
export default AmountInput;
