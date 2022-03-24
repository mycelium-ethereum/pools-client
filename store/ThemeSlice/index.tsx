import { StoreSlice } from '../types';
import { Theme } from './themes';
import { IThemeSlice } from './types';

export const createThemeSlice: StoreSlice<IThemeSlice> = (set, get) => ({
    theme: Theme.Dark,
    toggleTheme: () => {
        const head = document.getElementsByTagName('html')[0];
        if (get().theme === Theme.Dark) {
            // is dark going to light
            localStorage.setItem('theme', 'light');
            head.classList.remove('theme-dark');
            set({ theme: Theme.Light });
        } else {
            head.classList.add('theme-dark');
            localStorage.removeItem('theme');
            set({ theme: Theme.Dark });
        }
    },
    setTheme: (theme: Theme) => {
        set({ theme });
    },
});

export const selectThemeSlice: (state: IThemeSlice) => {
    isDark: boolean;
    toggleTheme: IThemeSlice['toggleTheme'];
    setTheme: IThemeSlice['setTheme'];
} = (state) => ({
    isDark: selectIsDark(state),
    toggleTheme: selectToggleTheme(state),
    setTheme: selectSetTheme(state),
});

export const selectIsDark: (state: IThemeSlice) => boolean = (state) => state.theme === Theme.Dark;
export const selectToggleTheme: (state: IThemeSlice) => IThemeSlice['toggleTheme'] = (state) => state.toggleTheme;
export const selectSetTheme: (state: IThemeSlice) => IThemeSlice['setTheme'] = (state) => state.setTheme;
export const selectTheme: (state: IThemeSlice) => IThemeSlice['theme'] = (state) => state.theme;
