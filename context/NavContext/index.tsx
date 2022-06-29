import React, { createContext, FC, ReactNode, useState } from 'react';

export interface INavContextProvider {
    children: ReactNode;
}

const useValues = () => {
    const [launcherMenuOpen, setLauncherMenuOpen] = useState<boolean>(false);
    const [navMenuOpen, setNavMenuOpen] = useState<boolean>(false);

    return {
        navMenuOpen,
        setNavMenuOpen,
        launcherMenuOpen,
        setLauncherMenuOpen,
    };
};

export const NavContext = createContext({} as ReturnType<typeof useValues>);

export const NavContextProvider: FC<INavContextProvider> = ({ children }) => {
    return <NavContext.Provider value={useValues()}>{children}</NavContext.Provider>;
};
