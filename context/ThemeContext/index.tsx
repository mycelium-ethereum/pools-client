import { Children } from '@libs/types/General';
import React, { useEffect, useState } from 'react';

interface ContextProps {
    isDark: boolean;
    toggleTheme: () => void;
}

export const ThemeContext = React.createContext<ContextProps>({
    isDark: false,
    toggleTheme: () => undefined,
});

/**
 * Wrapper store for the FactoryContext.
 */
export const ThemeStore: React.FC<Children> = ({ children }: Children) => {
    const [isDark, setIsDark] = useState(true);

    const toggleTheme = () => {
        const head = document.getElementsByTagName('html')[0];
        if (isDark) {
            // is dark going to light
            localStorage.setItem('theme', 'light');
            head.classList.remove('theme-dark');
            setIsDark(false);
        } else {
            head.classList.add('theme-dark');
            localStorage.removeItem('theme');
            setIsDark(true);
        }
    };

    useEffect(() => {
        if (localStorage.getItem('theme') === 'light') {
            setIsDark(false);
        } 
    }, []);

    return (
        <ThemeContext.Provider
            value={{
                isDark,
                toggleTheme,
            }}
        >
            {children}
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
