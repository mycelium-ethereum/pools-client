import React, { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid'

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
                        <ChevronDownIcon className="z-20 transition-all w-5 h-5 self-center ml-1" style={{ transform: open ? 'rotate(180deg)' : '' }} />
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