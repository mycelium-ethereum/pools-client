import React from 'react';
import BigNumber from 'bignumber.js';
import { toApproxCurrency } from '@libs/utils/converters';
import { Transparent } from './styles';

export const ApproxCommitGasFee: React.FC<{
    amount: BigNumber;
    gasFee?: string;
}> = ({ amount, gasFee }) => {
    const fee = Number(gasFee);
    const getFee = () => {
        if (amount.toNumber() === 0) {
            return 0;
        } else if (fee < 0.001) {
            return '< $0.001';
        } else {
            return toApproxCurrency(fee);
        }
    };
    return <Transparent>{getFee()}</Transparent>;
};

export default ApproxCommitGasFee;
