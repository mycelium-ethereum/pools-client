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

export const SelectMarketTip: React.FC = ({ children }) => {
    const Content = <>Please select a market</>;
    return <StyledTooltip title={Content}>{children}</StyledTooltip>;
};

export const UnavailableTip: React.FC = ({ children }) => {
    const Content = <>Unavailable</>;
    return <StyledTooltip title={Content}>{children}</StyledTooltip>;
};

export const RewardsEndedTip: React.FC = ({ children }) => {
    const Content = 'Staking rewards have ended for this pool.';
    return <StyledTooltip title={Content}>{children}</StyledTooltip>;
};

export const StakingTvlTip: React.FC = ({ children }) => {
    const Content = 'Total value locked in the staking contract';
    return <StyledTooltip title={Content}>{children}</StyledTooltip>;
};

export const MarketTypeTip: React.FC = ({ children }) => {
    const Content = (
        <>
            Multiple markets found. You can further refine the market you participate in by choosing between, e.g., SMA
            markets that smooth volatility and spot markets that track the underlying price at rebalance.
            <br />
            <a href="https://pools.docs.tracer.finance/" target="_blank" rel="noopener noreferrer">
                Learn more
            </a>
        </>
    );
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

export const PortfolioStakeTooltip: React.FC = ({ children }) => {
    const Content = 'Stake the Pool Token to earn liquidity mining rewards!';
    return <StyledTooltip title={Content}>{children}</StyledTooltip>;
};

export const PortfolioSellTooltip: React.FC = ({ children }) => {
    const Content = 'Sell the Pool Token instantly using Balancer.';
    return <StyledTooltip title={Content}>{children}</StyledTooltip>;
};

export const PortfolioFlipTooltip: React.FC = ({ children }) => {
    const Content = 'Flip the Pool Token to take an opposite view in the market.';
    return <StyledTooltip title={Content}>{children}</StyledTooltip>;
};
