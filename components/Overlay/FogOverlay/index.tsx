import React, { FC, useContext } from 'react';
import Overlay from '@components/Overlay';
import styled from 'styled-components';
import { Button } from '@components/General';
import { OrderContext } from '@context/OrderContext';

interface FOProps {
    buttonName: string;
    onClick: () => void;
}
const FogOverlay: FC<FOProps> = ({ buttonName, onClick }: FOProps) => {
    const { order } = useContext(OrderContext);
    return (
        <StyledOverlay show={!!order?.exposureBN.toNumber()}>
            <ShowButton onClick={onClick}>{buttonName}</ShowButton>
        </StyledOverlay>
    );
};

export default FogOverlay;

const StyledOverlay = styled(Overlay)<{ show: boolean }>`
    display: ${(props) => (props.show ? 'flex' : 'none')};
`;

const ShowButton = styled(Button)`
    height: var(--height-small-button);
    padding: 0 15px;
    width: auto;
    min-width: 160px;
`;
