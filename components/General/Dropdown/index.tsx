import React, { Fragment, useEffect, useRef } from 'react';
import { Children } from 'libs/types/General';
import styled from 'styled-components';
import { useResizeDetector } from 'react-resize-detector';
import { Menu, Transition } from '@headlessui/react';
import { DownOutlined } from '@ant-design/icons';

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
`;

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

interface DropDownProps {
    value: string;
    options: string[];
    onSelect: (option: string) => void;
}

export const DropDown: React.FC<DropDownProps> = ({ value, options, onSelect }) => {
    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
                    {value}
                    <DownOutlined className="h-5 w-5 ml-2 flex items-center" aria-hidden="true" />
                </Menu.Button>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="origin-top-right z-10 absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        {options.map((option) => (
                            <Menu.Item key={option}>
                                {({ active }) => (
                                    <button
                                        onClick={() => onSelect(option)}
                                        className={classNames(
                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                            'block px-4 py-2 text-sm w-full text-left',
                                        )}
                                    >
                                        {option}
                                    </button>
                                )}
                            </Menu.Item>
                        ))}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
};
