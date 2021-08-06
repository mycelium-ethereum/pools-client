import React, { useEffect, useRef, useState } from 'react';
import { Children } from 'libs/types';
import styled from 'styled-components';
import { useResizeDetector } from 'react-resize-detector';

/**
 * Similar component to dropdown only there is no content to begin with
 */
type HEProps = {
    defaultHeight: number; // defaults to 0
    open: boolean;
    className?: string;
} & Children;
export const HiddenExpand: React.FC<HEProps> = styled(({ className, children, defaultHeight, open }: HEProps) => {
    const main = useRef<HTMLDivElement>(null);
    const { height, ref } = useResizeDetector();

    useEffect(() => {
        const m = main.current as unknown as HTMLDivElement;
        if (open) {
            // all heights plus 10px for padding
            m.style.height = `${height ?? 0}px`;
        } else {
            m.style.height = `${defaultHeight}px`;
        }
    }, [open, height]);

    return (
        <div className={`${className} ${open ? 'open' : ''}`} ref={main}>
            <div className="body" ref={ref}>
                {children}
            </div>
        </div>
    );
})`
    overflow: hidden;
    transition: 0.3s ease-in-out;
    height: ${(props) => props.defaultHeight}px;
    margin-bottom: 1rem;
    border-radius: 7px;
    text-align: left;
    font-size: var(--font-size-small);
    letter-spacing: var(--letter-spacing-small);
    background: var(--color-background);

    & > .body {
        transition: 0.3s ease-in;
        opacity: 0;
    }

    &.open .body {
        opacity: 1;
    }
    div[class*='General__Section'] {
        padding: 6px 16px;
        border-bottom: 1px solid var(--table-darkborder);
    }
    div[class*='General__Section']:last-of-type {
        border-bottom: 0;
    }
`;

/**
 * Takes two children items, will place the first as the header component and the second as the body
 * @param defaultHeight prevents jumpiness when initialising the dropdown
 */
type DProps = {
    defaultOpen?: boolean;
    defaultHeight: number;
    className?: string;
    header: React.ReactNode;
    body: React.ReactNode;
};
export const Dropdown: React.FC<DProps> = styled(({ className, defaultOpen, header, body, defaultHeight }: DProps) => {
    const [open, setOpen] = useState(!!defaultOpen);
    const main = useRef(null);
    const { height: bodyHeight, ref: _body } = useResizeDetector();
    const _header = useRef(null);
    useEffect(() => {
        const h = _header.current as unknown as HTMLDivElement;
        if (open) {
            // all heights plus 10px for padding
            (main.current as unknown as HTMLDivElement).style.height = `${
                h.clientHeight ? h.clientHeight + (bodyHeight ?? 0) + 10 : defaultHeight
            }px`;
        } else {
            (main.current as unknown as HTMLDivElement).style.height = `${
                h.clientHeight ? h.clientHeight : defaultHeight
            }px`;
        }
    }, [open, bodyHeight]);
    return (
        <div className={className} onClick={(_e) => setOpen(!open)} ref={main}>
            <div ref={_header} className={open ? 'open' : ''}>
                {header}
            </div>
            <div ref={_body}>{body}</div>
        </div>
    );
})`
    background: var(--color-background);
    overflow: hidden;
    transition: 0.3s ease-in-out;
    margin-bottom: 2rem;
    border-radius: 5px;
    text-align: left;
    font-size: var(--font-size-small);
    letter-spacing: var(--letter-spacing-small);
    cursor: pointer;
`;
