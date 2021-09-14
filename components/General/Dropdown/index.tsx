import React, { Fragment, useEffect, useRef } from 'react';
import { Children } from 'libs/types/General';
import { useResizeDetector } from 'react-resize-detector';
import { Menu, Transition } from '@headlessui/react';
import { DownOutlined } from '@ant-design/icons';
import { classNames } from '@libs/utils/functions';
import { Logo } from 'components/General/Logo';

/**
 * Similar component to dropdown only there is no content to begin with
 */
type HEProps = {
    defaultHeight: number; // defaults to 0
    open: boolean;
    className?: string;
} & Children;
export const HiddenExpand: React.FC<HEProps> = ({ className, children, defaultHeight, open }: HEProps) => {
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
        <div
            className={classNames(
                'overflow-visible transition-all duration-300 ease-in-out mb-4 mt-8 rounded-md text-base bg-white',
                className ?? '',
            )}
            ref={main}
        >
            <div className="body" ref={ref}>
                <Transition
                    show={open}
                    enter="transition-opacity duration-300 delay-100"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    {children}
                </Transition>
            </div>
        </div>
    );
};

const SIZE = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-4 py-2 text-sm',
    default: 'pl-3 pr-2 py-2 text-sm ',
    lg: 'p-3 text-base',
    none: 'p-0 text-base',
};

export type ButtonSize = 'xs' | 'sm' | 'lg' | 'default' | 'none';

interface DropdownProps {
    value: string;
    placeHolder?: string;
    options: {
        key: string;
        text?: string;
        ticker?: string;
    }[];
    onSelect: (option: string) => void;
    size?: ButtonSize;
    className?: string;
}
export const Dropdown: React.FC<DropdownProps> = ({
    value,
    placeHolder = 'Select',
    options,
    onSelect,
    size = 'default',
    className,
}) => {
    return (
        <Menu as="div" className={`${className || ''} relative inline-block text-left`}>
            <Menu.Button
                className={classNames(
                    `inline-flex justify-between w-full rounded-md border `,
                    SIZE[size],
                    'font-normal border-gray-300 bg-gray-50 text-gray-500 hover:bg-white focus:outline-none focus:border-solid hover:ring-1 hover:ring-tracer-50',
                )}
            >
                <span className="mr-2">{value === '' ? placeHolder : value}</span>
                <DownOutlined className="flex items-center h-4 w-4 ml-auto mr-0 my-auto " aria-hidden="true" />
            </Menu.Button>

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
                            <Menu.Item key={option.key}>
                                {({ active }) => (
                                    <button
                                        onClick={() => onSelect(option.key)}
                                        className={classNames(
                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                            'block px-4 py-2 text-sm w-full text-left',
                                        )}
                                    >
                                        {option?.ticker ? (
                                            <Logo ticker={option.ticker} className="inline w-[20px] mr-2" />
                                        ) : (
                                            ''
                                        )}
                                        {option?.text ?? option.key}
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
