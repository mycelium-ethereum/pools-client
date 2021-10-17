import React, { useEffect, useState } from 'react';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { toNetworkName } from '@libs/utils/converters';

import Exclamation from '@public/img/warning/exclamation-circle.svg';
import Close from '@public/img/warning/cross.svg';

const WarningBanner: React.FC = () => {
    const [showWarning, setShowWarning] = useState(false);
    const { network = '0' } = useWeb3();

    useEffect(() => {
        if (localStorage.getItem('onboard.warningShown') !== 'true') {
            setShowWarning(true);
        }
    }, []);

    return (
        <div
            className={`${
                showWarning ? '' : 'hidden'
            } container px-2 3xl:px-20 py-3 absolute top-16 lg:top-20 left-0 right-0 mx-auto flex items-center rounded-lg bg-red-50 border border-red-500 text-yellow-900`}
        >
            <div className="mr-2">
                <Exclamation />
            </div>
            <div>
                <span className="font-semibold">NOTICE:</span>&nbsp;You’re connected to{' '}
                {toNetworkName(network.toString())}, and the protocol is still in beta phase.&nbsp;
                <span className="font-semibold">Use at your own risk!</span>
            </div>
            <div
                className="ml-auto cursor-pointer"
                onClick={() => {
                    setShowWarning(false);
                    localStorage.setItem('onboard.warningShown', 'true');
                }}
            >
                <Close />
            </div>
        </div>
    );
};
export default WarningBanner;
