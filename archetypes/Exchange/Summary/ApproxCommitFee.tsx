import React from 'react';
import BigNumber from 'bignumber.js';
import { toApproxCurrency } from '~/utils/converters';
import { Transparent } from './styles';

export const ApproxCommitFee = ({ amount, fee }: { amount: BigNumber; fee: BigNumber }): JSX.Element => {
    const getFee = () => {
        if (amount.toNumber() === 0) {
            return 0;
        } else if (fee.lt(0.001)) {
            return '< $0.001';
        } else {
            return toApproxCurrency(fee);
        }
    };
    return <Transparent inline>{getFee()}</Transparent>;
};

export default ApproxCommitFee;
