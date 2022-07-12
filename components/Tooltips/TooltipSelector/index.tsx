import React from 'react';
import {
    StyledTooltip,
    LockTip,
    ComingSoonTip,
    UnavailableTip,
    SelectMarketTip,
    PowerLeverageTip,
    DeprecatedPoolMintCommitTooltip,
    DeprecatedPoolFlipCommitTooltip,
    PortfolioFlipTooltip,
    TradeMintTooltip,
    TradeBurnTooltip,
    TradeFlipTooltip,
    EscrowButtonTooltip,
} from '../';

export enum TooltipKeys {
    ComingSoon = 'coming-soon',
    SelectMarket = 'select-market',
    Unavailable = 'unavailable',
    Lock = 'Lock',
    PowerLeverage = 'power-leverage',
    DeprecatedPoolMintCommit = 'deprecated-pool-mint-commit',
    DeprecatedPoolFlipCommit = 'deprecated-pool-flip-commit',
    PortfolioFlip = 'portfolio-flip',
    TradeMint = 'trade-mint',
    TradeBurn = 'trade-burn',
    TradeFlip = 'trade-flip',
    EscrowButton = 'escrow-btn',
}

export type TooltipSelectorProps = {
    key?: TooltipKeys;
    content?: React.ReactNode;
};

const TooltipSelector: React.FC<{ tooltip: TooltipSelectorProps }> = ({ tooltip, children }) => {
    switch (tooltip.key) {
        case TooltipKeys.ComingSoon:
            return <ComingSoonTip>{children}</ComingSoonTip>;

        case TooltipKeys.SelectMarket:
            return <SelectMarketTip>{children}</SelectMarketTip>;

        case TooltipKeys.Unavailable:
            return <UnavailableTip>{children}</UnavailableTip>;

        case TooltipKeys.Lock:
            return <LockTip>{children}</LockTip>;

        case TooltipKeys.PowerLeverage:
            return <PowerLeverageTip>{children}</PowerLeverageTip>;

        case TooltipKeys.DeprecatedPoolMintCommit:
            return <DeprecatedPoolMintCommitTooltip>{children}</DeprecatedPoolMintCommitTooltip>;

        case TooltipKeys.DeprecatedPoolFlipCommit:
            return <DeprecatedPoolFlipCommitTooltip>{children}</DeprecatedPoolFlipCommitTooltip>;

        case TooltipKeys.PortfolioFlip:
            return <PortfolioFlipTooltip>{children}</PortfolioFlipTooltip>;

        case TooltipKeys.TradeMint:
            return <TradeMintTooltip>{children}</TradeMintTooltip>;

        case TooltipKeys.TradeBurn:
            return <TradeBurnTooltip>{children}</TradeBurnTooltip>;

        case TooltipKeys.TradeFlip:
            return <TradeFlipTooltip>{children}</TradeFlipTooltip>;

        case TooltipKeys.EscrowButton:
            return <EscrowButtonTooltip>{children}</EscrowButtonTooltip>;

        default:
            return <StyledTooltip title={tooltip.content}>{children}</StyledTooltip>;
    }
};

export default TooltipSelector;
