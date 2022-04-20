import styled from 'styled-components';
import { Logo } from '~/components/General';
import Button from '~/components/General/Button';
import { FullSpanCell } from '~/components/General/TWTable';
import { TokenType as TokenTypeEnum } from '../state';

export const Pool = styled.div`
    color: ${({ theme }) => theme.text};
    background: ${({ theme }) => theme['background-secondary']};
    display: flex;
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

const MARKET_COLORS: Record<
    string,
    {
        backgroundColor: string;
        buttonBorderColor: string;
    }
> = {
    ETH: {
        backgroundColor: 'rgba(95, 102, 139, 0.3)',
        buttonBorderColor: 'rgb(95, 102, 139)',
    },
    BTC: {
        backgroundColor: 'rgba(247, 147, 26, 0.3)',
        buttonBorderColor: 'rgb(95, 102, 139)',
    },
    LINK: {
        backgroundColor: 'rgba(55, 91, 210, 0.3)',
        buttonBorderColor: 'rgb(55, 91, 210)',
    },
};

export const PoolTableRow = styled.tr<{
    marketTicker: string;
}>`
    background: ${({ marketTicker }) => MARKET_COLORS[marketTicker]?.backgroundColor ?? 'auto'};
`;

export const PoolTableRowCell = styled.td<{
    variant?: 'title' | 'buttons';
}>`
    padding: 1rem;
    ${({ variant }) => {
        switch (variant) {
            case 'title':
                return titleStyles;
            default:
                return '';
        }
    }};
`;

export const ButtonCell = styled(FullSpanCell)`
    padding: 1rem;
`;

export const Buttons = styled.div`
    display: flex;
    justify-content: end;
`;

export const ClaimButton = styled(Button)<{
    marketTicker: string;
}>`
    height: 35px;
    font-size: 12px
    margin-right: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-width: 1px;
    border-style: solid;
    border-color: ${({ marketTicker }) => MARKET_COLORS[marketTicker]?.buttonBorderColor ?? 'auto'};
    background: rgba(255, 255, 255, 0.5);
`;

export const ClaimButtonLogo = styled(Logo)`
    margin-left: 0.5rem;
    margin-right: 0.25rem;
`;

export const DropdownButton = styled(Button)`
    width: 44px !important;
    height: 35px;
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
