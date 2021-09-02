import React, { Fragment, useEffect, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import styled from 'styled-components';

/**
 * Tailwind modal component wrapped in a styled component for customization.
 * To customize just create a styled component and bind to
 * 	${ModalInner}
 */
export default styled(({ show, onClose, children, className }) => {
    const ref = useRef(null);

    // close if clicked outside
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (ref.current && !(ref.current as any).contains(event.target)) {
                onClose();
            }
        };

        // Bind the event listener
        document?.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document?.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref]);

    return (
        <Transition.Root show={show} as={Fragment}>
            <Dialog as="div" className={`${className} fixed z-10 inset-0 overflow-y-auto`} onClose={onClose}>
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <ModalInner ref={ref} className="transform">
                            {children}
                        </ModalInner>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
})<{
    show: boolean;
    onClose: (...args: any) => any;
}>``;

export const ModalInner = styled.div`
    display: inline-block;
    background: #fff;
    text-align: left;
    overflow: hidden;
    box-shadow: 4px 4px 50px rgba(0, 0, 0, 0.06);
    border-radius: 20px;
    padding: 3rem 2.5rem;
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
    vertical-align: bottom;
    margin: 2rem 0;
    width: 100%;

    @media (min-width: 640px) {
        vertical-align: middle;
    }
    @media (min-width: 640px) {
        max-width: 600px;
    }
`;
