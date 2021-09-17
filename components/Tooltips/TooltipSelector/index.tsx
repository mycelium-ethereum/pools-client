import React from 'react';
import { StyledTooltip, LockTip } from '../';

export type TooltipSelectorProps = {
    key: 'lock';
};

const TooltipSelector: React.FC<{ tooltip: TooltipSelectorProps }> = ({ tooltip, children }) => {
    switch (tooltip.key) {
        case 'lock':
            return <LockTip>{children}</LockTip>;

        default:
            return <StyledTooltip>{children}</StyledTooltip>;
    }
};

export default TooltipSelector;
