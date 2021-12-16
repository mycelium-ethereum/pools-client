import React, { useEffect, useState } from 'react';

import Exclamation from '@public/img/general/exclamation-circle.svg';
import Close from '@public/img/general/close.svg';
import { classNames } from '@libs/utils/functions';

type Warning = 'auditWarning' | 'decayWarning';

const warningInfo: Record<
    Warning,
    {
        exclamationClassName: string;
        content: React.ReactNode;
    }
> = {
    auditWarning: {
        exclamationClassName: 'text-orange-400',
        content: (
            <>
                <span className="font-semibold">NOTICE:</span>&nbsp;Perpetual Pools has been{' '}
                <a
                    href="https://tracer.finance/radar/sigma-prime-audit-response/"
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-tracer-400"
                >
                    audited
                </a>
                , however the protocol is still in beta phase. Please use at your own risk.
            </>
        ),
    },
    decayWarning: {
        exclamationClassName: 'text-red-500',
        content: (
            <>
                <span className="font-semibold">WARNING:</span>&nbsp;Tracer Pool Tokens v1 experience{' '}
                <a
                    href="https://tracer.finance/radar/volatility-decay/"
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-tracer-400"
                >
                    volatility decay
                </a>
                , and are therefore not suitable for long-term holding. The tokens are designed for short-term
                directional bets.
            </>
        ),
    },
};

const WarningBanner: React.FC<{
    warning: Warning;
}> = ({ warning }) => {
    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
        if (sessionStorage.getItem(`onboard.${warning}`) !== 'true') {
            setShowWarning(true);
        }
    }, []);

    return (
        <div className={`${showWarning ? 'relative' : 'hidden'}`}>
            <div
                className={classNames(
                    'flex items-center rounded-lg text-sm lg:text-base px-5 py-3 dark:bg-cool-gray-700 text-theme-text bg-cool-gray-200',
                    'mt-3 sm:mx-4 md:mx-0',
                )}
            >
                <div className="mr-2">
                    <Exclamation className={warningInfo[warning].exclamationClassName} />
                </div>
                <div>{warningInfo[warning].content ?? <></>}</div>
                <div
                    className="ml-auto cursor-pointer"
                    onClick={() => {
                        setShowWarning(false);
                        sessionStorage.setItem(`onboard.${warning}`, 'true');
                    }}
                >
                    <Close className="text-theme-text w-3" />
                </div>
            </div>
        </div>
    );
};

/**
 * Convenient component to wrap multiple banners.
 * Allows for easily stacking the banners
 *
 */
export const WarningBanners: React.FC<{
    banners: Warning[];
}> = ({ banners }) => {
    return (
        <div className="container relative">
            <div className="absolute top-0 left-5 right-5 sm:left-0 sm:right-0 3xl:left-20 3xl:right-20 z-10">
                {banners.map((banner) => (
                    <WarningBanner key={banner} warning={banner} />
                ))}
            </div>
        </div>
    );
};

export default WarningBanner;
