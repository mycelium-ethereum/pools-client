import React, { useMemo } from 'react';
import styled from 'styled-components';
import { DeltaEnum } from '~/archetypes/Pools/state';
import { LogoTicker } from '~/components/General';
import { calcPercentageDifference, toApproxCurrency } from '~/utils/converters';
import ArrowDown from '/public/img/general/arrow-circle-down.svg';
import Equal from '/public/img/general/circle-equal.svg';

const IconBox = styled.div`
    margin-right: 0.25rem;
    display: flex;
    align-items: center;

    & .icon {
        height: 1.25rem;
    }
`;

const dollarTickers = ['USD', 'USDC'];
const isDollar: (currency: LogoTicker) => boolean = (currency) => dollarTickers.includes(currency);

export const UpOrDown = styled(
    ({ deltaDenotation: deltaDenotation, oldValue, newValue, currency, showCurrencyTicker, className }) => {
        const value = useMemo(
            () =>
                deltaDenotation === DeltaEnum.Numeric
                    ? newValue - oldValue
                    : calcPercentageDifference(newValue, oldValue),
            [deltaDenotation, oldValue, newValue],
        );
        const approxValue = Math.abs(parseFloat(value.toFixed(3)));
        return (
            <div className={`${className} ${approxValue === 0 ? '' : value > 0 ? 'text-up-green' : 'text-down-red'}`}>
                <IconBox>
                    {approxValue === 0 ? (
                        <Equal className="icon" />
                    ) : (
                        <ArrowDown className={`icon ${value > 0 ? 'rotate' : ''}`} />
                    )}
                </IconBox>
                <div>
                    {deltaDenotation === DeltaEnum.Numeric
                        ? `${isDollar(currency) ? toApproxCurrency(value).replace('-', '') : approxValue}${' '}
                            ${showCurrencyTicker ? currency : ''}`
                        : `${approxValue}%`}
                </div>
            </div>
        );
    },
).attrs((props) => ({
    ...props,
    textColor: props.textColor,
}))<{
    oldValue: number;
    newValue: number;
    currency?: LogoTicker;
    showCurrencyTicker?: boolean;
    deltaDenotation: DeltaEnum;
}>`
    display: flex;

    .rotate {
        transform: rotate(180deg);
    }

    .icon {
        height: 1.25rem;
        margin: auto 0;
    }

    color: #6b7280;

    &.green {
        color: ${({ theme }) => theme.colors['up-green']};
    }

    &.red {
        color: ${({ theme }) => theme.colors['down-red']};
    }
`;

export default UpOrDown;
