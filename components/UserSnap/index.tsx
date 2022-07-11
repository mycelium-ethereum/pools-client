import React, { useEffect } from 'react';

const USERSNAP_API_KEY = process.env.NEXT_PUBLIC_USERSNAP_API_KEY;

export const UserSnap: React.FC = () => {
    useEffect(() => {
        // Load usersnap
        (window as any).onUsersnapCXLoad = function (api: any) {
            (window as any).Usersnap = api;
            api.init();
            api.show(USERSNAP_API_KEY);
        };
    }, []);
    return null;
};
