import React, { useEffect, useState } from 'react';

import Exclamation from '@public/img/general/exclamation-circle.svg';
import Close from '@public/img/general/close.svg';

const WarningBanner: React.FC = () => {
    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
        if (sessionStorage.getItem('onboard.warningShown') !== 'true') {
            setShowWarning(true);
        }
    }, []);

    return (
        <div className={`${showWarning ? 'container relative' : 'hidden'}`}>
            <div
                className={
                    'dark:bg-cool-gray-700 text-theme-text bg-cool-gray-200 px-5 py-3 absolute top-3 left-5 right-5 sm:left-0 sm:right-0 3xl:left-20 3xl:right-20 z-10 flex items-center rounded-lg text-sm lg:text-base'
                }
            >
                <div className="mr-2">
                    <Exclamation />
                </div>
                <div>
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
                </div>
                <div
                    className="ml-auto cursor-pointer"
                    onClick={() => {
                        setShowWarning(false);
                        sessionStorage.setItem('onboard.warningShown', 'true');
                    }}
                >
                    <Close className="text-theme-text w-3" />
                </div>
            </div>
        </div>
    );
};
export default WarningBanner;
