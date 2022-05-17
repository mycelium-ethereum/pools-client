import styled from 'styled-components';
import ArrowDownIcon from '~/public/img/general/arrow-circle-down.svg';

export const DenotationOptions = styled.div`
    margin-right: 0.5rem;
`;

export const ArrowIcon = styled(ArrowDownIcon)<{ isGreen?: boolean }>`
    color: ${({ isGreen }) => (isGreen ? '#059669' : '#dc2626')};
    width: 1rem;
    transform: ${({ isGreen }) => (isGreen ? 'rotateX(180deg)' : '0')};
`;
