import React, { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { DownOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const DEFAULT =
    'inline-flex justify-center w-full rounded-md border-white border shadow-sm px-4 py-2 bg-white bg-opacity-20 text-sm font-medium text-white whitespace-nowrap hover:bg-blue-900 focus:outline-none focus:border-solid';

// const DropdownPopup
export default (({ preview, className, buttonClasses, children }) => {
    return (
        <Popover as="div" className={className ?? ''}>
            {({ open }) => (
                <>
                    {/* Button */}
                    <Popover.Button className={buttonClasses ?? DEFAULT}>
                        {preview}
                        <Arrow className="self-center ml-1" style={{ transform: open ? 'rotate(180deg)' : '' }} />
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
                        <Popover.Panel className="origin-top-right absolute z-20 right-0 mt-2 rounded-lg shadow-lg bg-theme-background ring-1 ring-black ring-opacity-5 focus:outline-none">
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
