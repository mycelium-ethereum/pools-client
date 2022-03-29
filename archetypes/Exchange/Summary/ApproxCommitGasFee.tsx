import React from 'react';
import BigNumber from 'bignumber.js';
import { toApproxCurrency } from '~/utils/converters';
import { Transparent } from './styles';

export const ApproxCommitGasFee: React.FC<{
    amount: BigNumber;
    gasFee: BigNumber;
}> = ({ amount, gasFee }) => {
    const getFee = () => {
        if (amount.toNumber() === 0) {
            return 0;
        } else if (gasFee.lt(0.001)) {
            return '< $0.001';
        } else {
            return toApproxCurrency(gasFee);
        }
    };
    return <Transparent>{getFee()}</Transparent>;
};

export default ApproxCommitGasFee;
