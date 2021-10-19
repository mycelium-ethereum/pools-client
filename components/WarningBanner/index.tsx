import React, { useEffect, useState } from 'react';
import { useTheme } from '@context/ThemeContext';

import Exclamation from '@public/img/warning/exclamation-circle.svg';
import Close from '@public/img/warning/cross.svg';

const WarningBanner: React.FC = () => {
    const [showWarning, setShowWarning] = useState(false);
    const { isDark } = useTheme();

    useEffect(() => {
        if (sessionStorage.getItem('onboard.warningShown') !== 'true') {
            setShowWarning(true);
        }
    }, []);

    return (
        <div className={`${showWarning ? '' : 'hidden'}`}>
            <div
                className={`${
                    isDark ? 'bg-cool-gray-700 text-white' : 'bg-cool-gray-200 text-black'
                } container px-5 py-3 absolute top-16 md:top-20 left-0 w-11/12 3xl:w-10/12 right-0 mx-auto mt-2 z-50 flex items-center rounded-lg text-sm lg:text-base`}
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
                    <Close fill={`${isDark ? 'white' : 'black'}`} />
                </div>
            </div>
        </div>
    );
};
export default WarningBanner;
