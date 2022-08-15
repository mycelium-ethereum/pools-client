import React, { Fragment } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Popover, Transition } from '@headlessui/react';
import styled from 'styled-components';

// const DropdownPopup
export default (({ preview, className, buttonClasses, navMenuOpen, children }) => {
    const DEFAULT = `bg-dropdown-gradient gradient-button flex items-center h-[36px] md:justify-center mb-4 md:mb-0 w-full rounded-[4px] border shadow-sm px-3 md:px-4 dark:hover:bg-theme-background text-sm font-medium dark:text-white whitespace-nowrap hover:bg-tracer-650 hover:text-white transition-colors duration-300 focus:outline-none focus:border-solid ${
        navMenuOpen
            ? 'text-white border-theme-primary'
            : 'text-tracer-650 border-theme-primary delay-300 lg:delay-[unset]'
    }`;

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
                        <Popover.Panel className="focus:outline-none absolute left-0 z-20 mt-2 w-full origin-top-right rounded bg-theme-background shadow-lg ring-1 ring-black ring-opacity-5">
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
    navMenuOpen?: boolean;
    className?: string;
}>;

const Arrow = styled(DownOutlined)`
    z-index: 11;
    vertical-align: 0;
    transition: transform 0.2s ease;
`;
