import { classNames } from '@libs/utils/functions';
import { Children } from 'libs/types/General';
import React from 'react';

type SProps = {
    className?: string;
    label: string;
} & Children;
export const Section: React.FC<SProps> = ({ className, children, label }: SProps) => {
    return (
        <div
            className={classNames(`flex w-full pb-2 last:pb-0 text-sm border-box text-cool-gray-700`, className ?? '')}
        >
            <div className={'text-left whitespace-nowrap text-cool-gray-700 capitalize'}>{label}</div>
            <span className={'w-full text-right pl-1'}>{children}</span>
        </div>
    );
};

export * from './Dropdown';
export * from './Logo';
export * from './Button';
// export * from './Input';
// export * from './Notification';
// export * from './';
