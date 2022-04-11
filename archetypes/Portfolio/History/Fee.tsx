import React from 'react';
import BigNumber from 'bignumber.js';

export const Fee = ({ fee }: { fee: BigNumber }): JSX.Element => <>{`${fee.times(100).toNumber()}%`}</>;
