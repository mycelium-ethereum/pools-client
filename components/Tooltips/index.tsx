import React from 'react';
import styled from 'styled-components';
import Tooltip from 'antd/lib/tooltip';

export const StyledTooltip = styled(Tooltip)`
    color: inherit;

    &:hover {
        cursor: pointer;
    }
`;

export const LockTip: React.FC = ({ children }) => {
    const Content = (
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
    return <StyledTooltip title={Content}>{children}</StyledTooltip>;
};
