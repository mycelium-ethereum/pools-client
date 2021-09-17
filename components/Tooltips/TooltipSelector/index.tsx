import React from 'react';
import { StyledTooltip, LockTip } from '../';

export type TooltipSelectorProps = {
    key: string | React.ReactNode;
};

const TooltipSelector: React.FC<{ tooltip: TooltipSelectorProps }> = ({ tooltip, children }) => {
    switch (tooltip.key) {
        case 'lock':
            return <LockTip>{children}</LockTip>;

        default:
            return <StyledTooltip title={tooltip.key}>{children}</StyledTooltip>;
    }
};

export default TooltipSelector;
