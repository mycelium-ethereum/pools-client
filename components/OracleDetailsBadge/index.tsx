import React from 'react';
import styled from 'styled-components';
import { OracleDetails } from '~/types/pools';
import { formatSeconds } from '~/utils/converters';

export const OracleDetailsBadgeContainer = styled.div`
    position: relative;
    width: fit-content;
    display: flex;
`;

const StyledBadge = styled.div`
    background: #3535dc;
    color: #fff;
    font-size: 13px;
    padding: 0.25rem 0.5rem;
    top: 0;
    line-height: 150%;
    border-radius: 3px;
    font-weight: 700;
    background: #1c64f2;
    color: #fff;
    border-color: #1c64f2;
`;

export const OracleDetailsBadge = ({ oracleDetails }: { oracleDetails: OracleDetails }): JSX.Element => {
    switch (oracleDetails.type) {
        case 'SMA':
            return (
                <StyledBadge>
                    {oracleDetails.updateInterval * oracleDetails.numPeriods
                        ? formatSeconds(oracleDetails.updateInterval * oracleDetails.numPeriods)
                        : ''}{' '}
                    SMA
                </StyledBadge>
            );
        case 'Spot':
        default:
            return <StyledBadge>Spot Price</StyledBadge>;
    }
};
