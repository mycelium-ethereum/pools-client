import React, { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { DownOutlined } from "@ant-design/icons";
import styled from "styled-components";

const button_className = "inline-flex justify-center w-full rounded-md border-white border-2 shadow-sm px-4 py-2 bg-transparent text-sm font-medium text-white hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500";

// const DropdownPopup
export default (({ preview, children }) => {
    return (
        <Popover as="div">
            {({open})=> (
                <>
                    {/* Button */}
                    <Popover.Button className={button_className}>
                        {preview}
						<Arrow className="self-center" style={{transform: open?'rotate(180deg)':''}}/>
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
                        <Popover.Panel className="origin-top-right absolute z-10 right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-200">
                            {children}
                        </Popover.Panel >
                    </Transition>
                </>
            )}
        </Popover>
    );
}) as React.FC<{
    preview: React.ReactNode;
}>

const Arrow = styled(DownOutlined)`
    transition: all 200ms ease-in-out;
    z-index: 11;
    vertical-align: 0;
`;
