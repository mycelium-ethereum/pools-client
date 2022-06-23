import React, { Fragment } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Popover, Transition } from '@headlessui/react';
import styled from 'styled-components';

const DEFAULT =
    'inline-flex justify-center w-full rounded-xl border-tracer-650 border shadow-sm px-4 py-2 dark:bg-white/20 [background:linear-gradient(44.71deg,rgba(28,100,242,0.5)_-529.33%,rgba(28,100,242,0)_115.83%)] text-sm font-medium text-white whitespace-nowrap hover:bg-blue-900 transition-color duration-300 focus:outline-none focus:border-solid';

// const DropdownPopup
export default (({ preview, className, buttonClasses, children }) => {
    return (
        <Popover as="div" className={className ?? ''}>
            {({ open }) => (
                <>
                    {/* Button */}
                    <Popover.Button className={buttonClasses ?? DEFAULT}>
                        {preview}
                        <Arrow className="ml-1 self-center" style={{ transform: open ? 'rotate(180deg)' : '' }} />
                    </Popover.Button>

                    {/* Menu */}
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Popover.Panel className="focus:outline-none absolute left-0 z-20 mt-2 w-full origin-top-right rounded-lg bg-theme-background shadow-lg ring-1 ring-black ring-opacity-5">
                            {children}
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
}) as React.FC<{
    preview: React.ReactNode;
    buttonClasses?: string;
    className?: string;
}>;

const Arrow = styled(DownOutlined)`
    transition: all 200ms ease-in-out;
    z-index: 11;
    vertical-align: 0;
`;
