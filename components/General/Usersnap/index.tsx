import React, { useEffect } from 'react';

const USERSNAP_GLOBAL_API_KEY = process.env.NEXT_PUBLIC_USERSNAP_GLOBAL_API_KEY;

export const UserSnap: React.FC = () => {
    useEffect(() => {
        // Load usersnap
        (window as any).onUsersnapCXLoad = function (api: any) {
            api.init();
        };
        const script = document.createElement('script');
        script.defer = true;
        script.src = `https://widget.usersnap.com/global/load/${USERSNAP_GLOBAL_API_KEY}?onload=onUsersnapCXLoad`;
        document.getElementsByTagName('head')[0].appendChild(script);
    }, []);
    return null;
};
