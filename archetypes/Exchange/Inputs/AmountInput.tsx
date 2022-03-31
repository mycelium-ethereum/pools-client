import React from 'react';
import BigNumber from 'bignumber.js';
import { InnerInputText } from '~/components/General/Input';
import Max from '~/components/General/Max';

import { toApproxCurrency } from '~/utils/converters';
import * as Styles from './styles';
import { AmountProps } from './types';

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
            <Styles.InputContainerStyled variation={invalidAmount.isInvalid ? 'error' : undefined}>
                <Styles.InputStyled
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
            </Styles.InputContainerStyled>
            <Styles.Subtext isAmountValid={invalidAmount.isInvalid} showContent>
                {invalidAmount.isInvalid && invalidAmount.message ? (
                    invalidAmount.message
                ) : (
                    <Available balance={balance} amountBN={amountBN} isPoolToken={isPoolToken} />
                )}
            </Styles.Subtext>
        </>
    );
};
export default AmountInput;
