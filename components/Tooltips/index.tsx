import React from 'react';
import styled from 'styled-components';
import Tooltip from 'antd/lib/tooltip';

export const StyledTooltip = styled(Tooltip)`
    color: inherit;

    &:hover {
        cursor: pointer;
    }
`;

export const ComingSoonTip: React.FC = ({ children }) => {
    const Content = <>Coming soon</>;
    return <StyledTooltip title={Content}>{children}</StyledTooltip>;
};

export const APYTip: React.FC = ({ children }) => {
    const Content = 'APY calculated with a weekly compound frequency';
    return <StyledTooltip title={Content}>{children}</StyledTooltip>;
};

export const RewardsEndedTip: React.FC = ({ children }) => {
    const Content = 'Staking rewards have ended for this pool.';
    return <StyledTooltip title={Content}>{children}</StyledTooltip>;
};

export const LockTip: React.FC = ({ children }) => {
    const Content = (
        <>
            Front-running interval reached. You can no longer mint or burn this round.{' '}
            <a
                onClick={() =>
                    window.open(
                        'https://docs.tracer.finance/tracer-faqs/perpetual-pools-faqs#what-is-the-front-running-interval',
                        '_blank',
                        'noopener',
                    )
                }
            >
                Learn more.
            </a>
        </>
    );
    return <StyledTooltip title={Content}>{children}</StyledTooltip>;
};

export const PowerLeverageTip: React.FC = ({ children }) => {
    const Content = (
        <>
            A new type of leverage used by Perpetual Pools to amplify returns.{' '}
            <a
                onClick={() =>
                    window.open(
                        'https://docs.tracer.finance/market-types/perpetual-pools/mechanism-design#power-leverage',
                        '_blank',
                        'noopener',
                    )
                }
            >
                Learn more.
            </a>
        </>
    );
    return <StyledTooltip title={Content}>{children}</StyledTooltip>;
};

export const GasPriceTooltip: React.FC<{
    network: string;
    wallet: string;
}> = ({ children, network, wallet }) => {
    const Content = (
        <>
            The current gas fee on {network} measured in GWEI, recommended by {wallet}.
        </>
    );
    return <StyledTooltip title={Content}>{children}</StyledTooltip>;
};
