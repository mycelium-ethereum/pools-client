import React from 'react';
import styled from 'styled-components';
import Tooltip from 'antd/lib/tooltip';
import { Children } from 'libs/types/General';

export const StyledTooltip = styled(Tooltip)`
    color: inherit;

    &:hover {
        cursor: pointer;
    }
`;

type TooltipProps = {
    className?: string;
} & Children;

export const LockTip: React.FC<TooltipProps> = ({ className, children }: TooltipProps) => {
    const tooltip = (
        <p>
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
        </p>
    );
    return (
        <StyledTooltip className={className} title={tooltip}>
            {children}
        </StyledTooltip>
    );
};
