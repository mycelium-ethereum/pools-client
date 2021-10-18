import React, { useEffect, useState } from 'react';
import { useTheme } from '@context/ThemeContext';

import Exclamation from '@public/img/warning/exclamation-circle.svg';
import Close from '@public/img/warning/cross.svg';

const WarningBanner: React.FC = () => {
    const [showWarning, setShowWarning] = useState(false);
    const { isDark } = useTheme();

    useEffect(() => {
        if (localStorage.getItem('onboard.warningShown') !== 'true') {
            setShowWarning(true);
        }
    }, []);

    return (
        <div className={`${showWarning ? '' : 'hidden'}`}>
            <div
                className={`${
                    isDark ? 'text-red-700' : 'bg-red-50 text-yellow-900'
                } container px-2 3xl:px-20 py-3 absolute top-16 lg:top-20 left-0 right-0 mx-auto z-50 flex items-center rounded-lg border border-red-500`}
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
                        className="underline"
                    >
                        audited
                    </a>
                    , however it is still in beta phase.&nbsp;
                    <span className="font-semibold">Please use at your own risk.</span>
                </div>
                <div
                    className="ml-auto cursor-pointer"
                    onClick={() => {
                        setShowWarning(false);
                        localStorage.setItem('onboard.warningShown', 'true');
                    }}
                >
                    <Close fill={`${isDark ? '#771D1D' : '#F8B4B4'}`} />
                </div>
            </div>
        </div>
    );
};
export default WarningBanner;
