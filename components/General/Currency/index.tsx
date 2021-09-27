import React from 'react';
import { Logo } from '../Logo';
import { classNames } from '@libs/utils/functions';

export const Currency: React.FC<{
    className?: string;
    ticker: string;
    label?: string;
}> = ({ ticker, label, className }) => (
    <div
        className={classNames(
            className ?? '',
            'flex items-center h-auto p-2 mr-2 rounded-xl bg-white text-gray-500 shadow',
        )}
    >
        <Logo className="inline mr-2 m-0 w-5 h-5" ticker={ticker} />
        {label ?? ticker}
    </div>
);
