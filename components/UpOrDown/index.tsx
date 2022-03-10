import React, { useMemo } from 'react';
import { DeltaEnum } from '@archetypes/Pools/state';
import { calcPercentageDifference, toApproxCurrency } from '@libs/utils/converters';
import styled from 'styled-components';
import ArrowDown from '/public/img/general/arrow-circle-down.svg';
import Equal from '/public/img/general/circle-equal.svg';
import { LogoTicker } from '@components/General';

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

export default styled(
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
            <div className={`${className} ${approxValue === 0 ? '' : value > 0 ? 'green' : 'red'}`}>
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
        color: rgb(22 163 74);
    }

    &.red {
        color: rgb(220, 38, 38);
    }
`;
