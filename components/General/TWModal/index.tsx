import React from 'react';
import { Fragment } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import styled from 'styled-components';
import { classNames } from '~/utils/helpers';

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
                                'inline-block w-full transform overflow-hidden rounded-lg bg-theme-background p-10 text-left align-bottom shadow-xl transition-all sm:my-8 sm:align-middle',
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
    text-align: center;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    min-width: 100vw;
`;

const DialogStyled = styled(Dialog)<{ onClose: () => void }>`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    max-height: 100vh;
    overflow-y: auto;
`;
