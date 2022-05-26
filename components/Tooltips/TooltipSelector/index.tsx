import React from 'react';
import {
    StyledTooltip,
    LockTip,
    ComingSoonTip,
    PowerLeverageTip,
    DeprecatedPoolMintCommitTooltip,
    DeprecatedPoolFlipCommitTooltip,
} from '../';

export enum TooltipKeys {
    ComingSoon = 'coming-soon',
    Lock = 'Lock',
    PowerLeverage = 'power-leverage',
    DeprecatedPoolMintCommit = 'deprecated-pool-mint-commit',
    DeprecatedPoolFlipCommit = 'deprecated-pool-flip-commit',
}

export type TooltipSelectorProps = {
    key?: TooltipKeys;
    content?: React.ReactNode;
};

const TooltipSelector: React.FC<{ tooltip: TooltipSelectorProps }> = ({ tooltip, children }) => {
    switch (tooltip.key) {
        case TooltipKeys.ComingSoon:
            return <ComingSoonTip>{children}</ComingSoonTip>;

        case TooltipKeys.Lock:
            return <LockTip>{children}</LockTip>;

        case TooltipKeys.PowerLeverage:
            return <PowerLeverageTip>{children}</PowerLeverageTip>;

        case TooltipKeys.DeprecatedPoolMintCommit:
            return <DeprecatedPoolMintCommitTooltip>{children}</DeprecatedPoolMintCommitTooltip>;

        case TooltipKeys.DeprecatedPoolFlipCommit:
            return <DeprecatedPoolFlipCommitTooltip>{children}</DeprecatedPoolFlipCommitTooltip>;

        default:
            return <StyledTooltip title={tooltip.content}>{children}</StyledTooltip>;
    }
};

export default TooltipSelector;
