import { useWeb3 } from '@context/Web3Context/Web3Context';
import React from 'react';
import styled from 'styled-components';

export default (() => {
    const { gasPrice } = useWeb3();
    return <Gas>{gasPrice}</Gas>;
}) as React.FC;

const Gas = styled.div`
    background: var(--color-accent);
    border-radius: 10px;
    padding: 0.5rem 1rem;
    margin-left: 0.5rem;
`;
