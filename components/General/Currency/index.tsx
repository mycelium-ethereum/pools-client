import React from 'react';
import { Logo, LogoTicker } from '../Logo';
import { classNames } from '@libs/utils/functions';

export const Currency: React.FC<{
    className?: string;
    ticker: LogoTicker;
    label?: string;
}> = ({ ticker, label, className }) => (
    <div
        className={classNames(
            className ?? '',
            'flex items-center h-auto p-2 mr-2 rounded-xl bg-white text-gray-500 dark:bg-theme-button-bg-hover dark:text-theme-text shadow',
        )}
    >
        <Logo className="inline mr-2 m-0" ticker={ticker} />
        {label ?? ticker}
    </div>
);
