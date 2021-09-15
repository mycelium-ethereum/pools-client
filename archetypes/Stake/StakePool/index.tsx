import React, { useEffect, useReducer } from 'react';
// import BigNumber from 'bignumber.js';
import { useFarms } from '@context/FarmContext';
// import styled from 'styled-components';
// import FilterBar from '../FilterSelects/Bar';
// import FilterModal from '../FilterSelects/Modal';
// import FarmsTable from '../FarmsTable';
// import { Container } from '@components/General';
// import { stakeReducer, StakeState, FarmTableRowData, LeverageFilterEnum, SideFilterEnum, SortByEnum } from '../state';
// import { FilterFilled, SearchOutlined } from '@ant-design/icons';
// import { useWeb3 } from '@context/Web3Context/Web3Context';
// import { useTransactionContext } from '@context/TransactionContext';
// import FarmNav from '@components/Nav/FarmNav';
// import StakeModal from '../StakeModal';
import StakeGeneric from '../StakeGeneric';

export default (() => {
    const { poolFarms: farms } = useFarms();
    return (
        <>
            <StakeGeneric
                title="Stake Pool Tokens"
                subTitle="Stake Pool Tokens and earn TCR."
                farms={farms}
            ></StakeGeneric>
        </>
    );
}) as React.FC;
