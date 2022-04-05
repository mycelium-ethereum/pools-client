import React from 'react';
import { classNames } from '~/utils/helpers';
import { Logo, LogoTicker } from '../Logo';

export const Currency: React.FC<{
    className?: string;
    ticker: LogoTicker;
    label?: string;
}> = ({ ticker, label, className }) => (
    <div
        className={classNames(
            className ?? '',
            'mr-2 flex h-auto items-center rounded-xl bg-white p-2 text-gray-500 shadow dark:bg-theme-button-bg-hover dark:text-theme-text',
        )}
    >
        <Logo className="m-0 mr-2 inline" ticker={ticker} />
        {label ?? ticker}
    </div>
);
