import React from 'react';
import { StyledTooltip, LockTip, ComingSoonTip } from '../';

export enum TooltipKeys {
    ComingSoon = 'coming-soon',
    Lock = 'Lock',
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

        default:
            return <StyledTooltip title={tooltip.content}>{children}</StyledTooltip>;
    }
};

export default TooltipSelector;
