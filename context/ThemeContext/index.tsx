import { Children } from '@libs/types/General';
import React, { useMemo, useEffect, useState } from 'react';
import { Theme, themes } from './themes';

interface ContextProps {
    isDark: boolean;
    toggleTheme: () => void;
}

export const ThemeContext = React.createContext<ContextProps>({
    isDark: false,
    toggleTheme: () => undefined,
});

import { ThemeProvider } from 'styled-components';

/**
 * Wrapper store for the FactoryContext.
 */
export const ThemeStore: React.FC<Children> = ({ children }: Children) => {
    const [theme, setTheme] = useState<Theme>('dark');
    const isDark = useMemo(() => theme === 'dark', [theme]);

    const toggleTheme = () => {
        const head = document.getElementsByTagName('html')[0];
        if (isDark) {
            // is dark going to light
            localStorage.setItem('theme', 'light');
            head.classList.remove('theme-dark');
            setTheme('light');
        } else {
            head.classList.add('theme-dark');
            localStorage.removeItem('theme');
            setTheme('dark');
        }
    };

    useEffect(() => {
        if (localStorage.getItem('theme') === 'light') {
            setTheme('light');
        }
    }, []);

    return (
        <ThemeContext.Provider
            value={{
                isDark,
                toggleTheme,
            }}
        >
            <ThemeProvider theme={themes[theme]}>{children}</ThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useTheme: () => ContextProps = () => {
    const context = React.useContext(ThemeContext);
    if (!context) {
        console.error('useWeb3 must be used within a OnboardProvider');
    }
    return context;
};
