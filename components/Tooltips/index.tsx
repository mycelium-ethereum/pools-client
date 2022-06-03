import React from 'react';
import Tooltip from 'antd/lib/tooltip';
import styled from 'styled-components';

export const StyledTooltip = styled(Tooltip).attrs((props: { forwardRef: any }) => ({
    forwardRef: props.forwardRef,
}))`
    color: inherit;

    &:hover {
        cursor: pointer;
    }
`;

export const ComingSoonTip: React.FC = ({ children }) => {
    const Content = <>Coming soon</>;
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
                        'https://pools.docs.tracer.finance/faq#what-is-the-front-running-interval',
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
                    window.open('https://pools.docs.tracer.finance/advanced-topics/mechanism#v2', '_blank', 'noopener')
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

export const DeprecatedPoolMintCommitTooltip: React.FC = ({ children }) => {
    const Content = <>Minting is disabled since this pool is deprecated.</>;
    return <StyledTooltip title={Content}>{children}</StyledTooltip>;
};

export const DeprecatedPoolFlipCommitTooltip: React.FC = ({ children }) => {
    const Content = <>Flipping is disabled since this pool is deprecated.</>;

    return <StyledTooltip title={Content}>{children}</StyledTooltip>;
};
