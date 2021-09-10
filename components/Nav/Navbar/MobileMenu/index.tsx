import React, { useState } from 'react';
import Hamburger from './Hamburger';
import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { classNames } from '@libs/utils/functions';

export default (({ className }) => {
    const [open, setOpen] = useState(false);
    
    return (
        <div className={classNames(
            `relative m-auto mr-0 overflow-hidden`,
            className ?? ''
        )}>
            <Hamburger open={open} setOpen={setOpen} />
            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="fixed inset-0 overflow-hidden top-full" onClose={() => {
                    // do nothing here since its fired before the hamburger
                    console.debug("Closing mobile nav")
                }}>
                    <div className="absolute inset-0 overflow-hidden">
                    <Dialog.Overlay className="absolute inset-0" />

                    <div className="fixed bottom-0 top-[60px] right-0 max-w-full flex">
                        <Transition.Child
                        as={Fragment}
                        enter="transform transition ease-in-out duration-500 sm:duration-700"
                        enterFrom="translate-x-full"
                        enterTo="translate-x-0"
                        leave="transform transition ease-in-out duration-500 sm:duration-700"
                        leaveFrom="translate-x-0"
                        leaveTo="translate-x-full"
                        >
                        <div className="w-screen md">
                            <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll">
                                <div className="mt-6 relative flex-1 px-4 sm:px-6">
                                    // content goes here
                                    {/* Replace with your content */}
                                    Hello worled
                                </div>
                            </div>
                        </div>
                        </Transition.Child>
                    </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </div>
    );
}) as React.FC<{
    className?: string
}>