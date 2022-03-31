import styled from 'styled-components';
import Button from '@components/General/Button';
import { TableRowCell } from '@components/General/TWTable';
import { TokenType as TokenTypeEnum } from '../state';

export const Pool = styled.tr`
    color: ${({ theme }) => theme.text};
    background: ${({ theme }) => theme['background-secondary']};
    display: flex;
    border-radius: 10px;
    overflow-x: auto;
    margin-top: 1rem;
`;

export const PoolName = styled.span`
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 150%;
    margin-left: 1rem;
    white-space: nowrap;
`;

export const InfoLabel = styled.div`
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 150%;
    white-space: nowrap;

    color: #6b7280;
`;

export const Value = styled.div`
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 150%;
`;

const titleStyles = `
    display: flex;
    align-items: center;
    width: 100%;
`;

const buttonStyles = `
    display: flex;
`;

export const Section = styled.td<{
    variant?: 'title' | 'buttons';
}>`
    margin: 1rem 2rem;

    ${({ variant }) => {
        switch (variant) {
            case 'title':
                return titleStyles;
            case 'buttons':
                return buttonStyles;
            default:
                return '';
        }
    }};
`;

export const ClaimButton = styled(Button)`
    height: 44px;
    width: 112px !important;
    margin-right: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const DropdownButton = styled(Button)`
    width: 44px !important;
    height: 44px;
    text-align: center;
`;

export const DropdownArrow = styled.img`
    width: 10px;

    transform: rotate(0deg);
    transition: transform 0.1s linear;

    &.open {
        transform: rotate(180deg);
        transition: transform 0.1s linear;
    }
`;

// ROWS
export const InnerText = styled.div`
    /* text-base/font-normal */
    font-family: Source Sans Pro, sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 150%;

    &.sub-text {
        opacity: 0.8;
    }
`;

export const EscrowButton = styled(Button)`
    border: 0;
    width: 70px !important;
    padding: 8px 0 !important;
    text-transform: uppercase;
    &:first-child {
        margin-right: 0.5rem;
    }
`;

export const Buttons = styled(TableRowCell)`
    text-align: right;
`;

export const TokenType = styled.div.attrs<{ type: TokenTypeEnum }>((props) => ({
    type: props.type,
}))<{ type: TokenTypeEnum }>`
    color: ${({ type }) => {
        switch (type) {
            case TokenTypeEnum.Long:
                return '#0E9F6E';
            case TokenTypeEnum.Short:
                return '#F05252';
            default:
                return 'inherit';
        }
    }};
`;
