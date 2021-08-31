import Icon from '@ant-design/icons';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import React from 'react';
import styled from 'styled-components';

// @ts-ignore
import GasIcon from '@public/img/general/gas_icon.svg';

export default (() => {
    const { gasPrice } = useWeb3();
    return (
        <Gas>
            <Icon component={GasIcon} className="icon" />
            <span className="text">{gasPrice}</span>
        </Gas>
    );
}) as React.FC;

const Gas = styled.div`
    // background: var(--color-accent);
    // border-radius: 10px;
    padding: 0.5rem 1rem;
    display: flex;
    align-items: center;
    .text {
        margin-left: 0.5rem;
    }
    .icon {
        height: 22px;
        width: 20px;
        vertical-align: 0;
        svg {
            width: 100%;
            height: 100%;
        }
    }
`;
