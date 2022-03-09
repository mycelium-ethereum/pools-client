import React from 'react';
import { Transition, Dialog } from '@headlessui/react';
import { Fragment } from 'react';
import { classNames } from '@libs/utils/functions';
import styled from 'styled-components';

interface TWModalProps {
    open: boolean;
    onClose: () => any;
    size?: Size;
    className?: string;
}

type Size = 'default' | 'wide';

const SIZES: Record<Size, string> = {
    default: 'sm:max-w-2xl',
    wide: 'max-w-[1010px] h-[700px]',
};

export const TWModal: React.FC<TWModalProps> = ({ open, onClose, size = 'default', className = '', children }) => {
    return (
        <Transition.Root show={open} as={Fragment}>
            <DialogStyled forwardedAs="div" onClose={() => onClose()}>
                <Wrapper>
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
                        <div
                            className={classNames(
                                'p-10 inline-block w-full align-bottom bg-theme-background rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle',
                                SIZES[size],
                                className,
                            )}
                        >
                            {children}
                        </div>
                    </Transition.Child>
                </Wrapper>
            </DialogStyled>
        </Transition.Root>
    );
};

const Wrapper = styled.div`
    display: flex;
    padding-top: 1rem;
    padding-bottom: 5rem;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    min-height: 100vh;

    @media (min-width: 640px) {
        display: block;
        padding: 0;
    }
`;

const DialogStyled = styled(Dialog)<{ onClose: () => void }>`
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow-y: auto;
    z-index: 10;
`;
