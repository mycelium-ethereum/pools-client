import { Children } from '@libs/types/General';
import React from 'react';
// @ts-ignore
import ReactSimpleTooltip from 'react-simple-tooltip';

export const Tooltip: React.FC<
    {
        text: React.ReactNode;
        placement?: string;
        show?: boolean;
    } & Children
> = ({ text, placement, children, show }) => {
    return (
        <>
            {show ? (
                <ReactSimpleTooltip
                    content={`${text}`}
                    arrow={6}
                    background="#f9fafb"
                    border="rgba(209, 213, 219)"
                    color="#000"
                    customCss={{
                        whiteSpace: 'nowrap',
                    }}
                    fadeDuration={300}
                    fadeEasing="linear"
                    fixed={false}
                    fontSize="12px"
                    padding={8}
                    radius={6}
                    placement={placement || 'top'}
                    zIndex={1}
                >
                    {children}
                </ReactSimpleTooltip>
            ) : (
                children
            )}
        </>
    );
};
