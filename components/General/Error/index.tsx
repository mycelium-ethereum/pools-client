import { InfoCircleOutlined } from '@ant-design/icons';
// import { StyledTooltip } from '@components/Tooltips';
import React from 'react';
import styled from 'styled-components';

type ErrorBox = {
    name: string;
    message: string;
    moreInfo?: string;
    severity?: 'warning';
};

export const OrderErrors: Record<string, ErrorBox> = {
    NO_POSITION: {
        name: 'User has position',
        message: 'You have an open trade. Switch to',
    },
    NO_WALLET_BALANCE: {
        name: 'No Wallet Balance',
        message: 'No balance found in web3 wallet',
    },
    NO_MARGIN_BALANCE: {
        name: 'No Margin Balance',
        message: 'You must deposit funds before placing an order.',
    },
    NO_ORDERS: {
        name: 'No Orders',
        message: 'No open orders for this market',
    },
    ACCOUNT_DISCONNECTED: {
        name: 'Account Disconnected',
        message: 'Please connect your wallet',
    },
    INVALID_FUNDS: {
        name: 'Invalid Funds',
        message: 'You do not have enough funds in your wallet',
    },
    INVALID_MIN_MARGIN: {
        name: 'Invalid Minimum Margin',
        message:
            'Our liquidators are required to pay 6 times the liquidation gas costs to liquidate your account. As a result we encourage you to deposit atleast $160 as this will ensure you will be able to place a trade without instantly being liquidated',
    },
    INVALID_INPUTS: {
        name: 'Invalid Inputs',
        message: 'Order is invalid more input required',
    },
    INVALID_ORDER: {
        name: 'Invalid Order',
        message: 'Order will put you into a liquidateable state',
    },
};

export const MarginErrors: Record<string, ErrorBox> = {
    INSUFFICIENT_FUNDS: {
        name: 'Insufficient Funds',
        message: 'Insufficient funds in connected wallet',
    },
    WITHDRAW_INVALID: {
        name: 'Withdraw Invalid',
        message: 'Position will be liquidated',
        moreInfo:
            'You are attempting to withdraw funds that will cause your position to be liquidated. Decrease the amount you are trying to withdraw or close your position and then withdraw funds.',
    },
    DEPOSIT_MORE: {
        name: 'Deposit Less than 150',
        message: 'You must deposit a minimum of $150 USD',
        moreInfo:
            'The liquidation mechanism requires you to deposit a minimum of $150 USDC to ensure that you will be able to open a position without instantly being liquidated.',
    },
};

export const CalculatorErrors: Record<string, ErrorBox> = {
    INVALID_POSITION: {
        name: 'Invalid Position',
        message: 'Invalid Position',
        moreInfo:
            'This position is liquidateable. Either the position is above max leverage or the liquidation price has already been met.',
    },
    INSUFFICIENT_FUNDS: {
        name: 'Insufficient Funds',
        message: 'Insufficient funds in connected wallet',
    },
    OVER_COLLATERALISED: {
        name: 'Over Collateralised Position',
        message: 'This position is over collateralised',
        moreInfo: 'This is not a leveraged position',
        severity: 'warning',
    },
    INVALID_INPUTS: {
        name: 'Invalid Inputs',
        message: 'You must provide two inputs',
    },
    DANGEROUS_POSITION: {
        name: 'Dangerous Position',
        message: 'Liquidation price is within 1.5% of current fair price',
        severity: 'warning',
    },
    ZEROED_INPUTS: {
        name: 'Zeroed Inputs',
        message: 'One of the locked values is zero',
    },
};

export type ErrorKey =
    | 'NO_ERROR'
    | keyof typeof MarginErrors
    | keyof typeof OrderErrors
    | keyof typeof CalculatorErrors;
const Errors: {
    orders: Record<string, ErrorBox>;
    margin: Record<string, ErrorBox>;
    calculator: Record<string, ErrorBox>;
} = {
    orders: OrderErrors,
    margin: MarginErrors,
    calculator: CalculatorErrors,
};

const SInfoCircleOutlined = styled(InfoCircleOutlined)`
    vertical-align: 0.125rem;
    margin-left: 0.25rem;
`;

type EProps = {
    className?: string;
    error: ErrorKey;
    context: 'orders' | 'margin' | 'calculator';
    message?: string; // this will override the rror message
};

const Error: React.FC<EProps> = styled(({ className, error, message, context }: EProps) => {
    const error_ =
        error !== 'NO_ERROR'
            ? Errors[context][error]
            : {
                  message: '',
                  moreInfo: '',
                  severity: '',
              };
    return (
        <div
            className={`${className} ${error !== 'NO_ERROR' || !!message ? 'show' : ''} ${
                error_.severity ? 'warning' : ''
            }`}
        >
            <div className="message">
                {error_?.message ?? message ?? ''}
                {error_?.moreInfo ? (
                    <>
                        {/* <StyledTooltip title={error_?.moreInfo}> */}
                            <SInfoCircleOutlined />
                        {/* </StyledTooltip> */}
                    </>
                ) : null}
            </div>
        </div>
    );
})`
    background: #f15025;
    border-radius: 0 0 5px 5px;
    font-size: var(--font-size-small);
    letter-spacing: var(--letter-spacing-small);
    color: #ffffff;
    text-align: center;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    transform: translateY(0);
    transition: all 0.4s;
    opacity: 0;
    z-index: -1;
    &.show {
        opacity: 1;
        z-index: 1;
        transform: translateY(100%);
    }

    &.warning {
        background: #f4ab57;
    }

    .message {
        transition: all 0.4s;
        margin: 0px;
    }

    &.show .message {
        margin: 10px;
    }
`;

Error.defaultProps = {
    context: 'orders',
};

export default Error;
