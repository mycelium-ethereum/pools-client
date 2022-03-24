import { StateSlice, StoreState } from '@store/types';
import { Theme } from './themes';
import { IThemeSlice } from './types';

export const createThemeSlice: StateSlice<IThemeSlice, IThemeSlice> = (set, get) => ({
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

export const selectThemeSlice: (state: StoreState) => {
    isDark: boolean;
    toggleTheme: IThemeSlice['toggleTheme'];
    setTheme: IThemeSlice['setTheme'];
} = (state) => ({
    isDark: selectIsDark(state),
    toggleTheme: selectToggleTheme(state),
    setTheme: selectSetTheme(state),
});

export const selectIsDark: (state: StoreState) => boolean = (state) => state.themeSlice.theme === Theme.Dark;
export const selectToggleTheme: (state: StoreState) => IThemeSlice['toggleTheme'] = (state) =>
    state.themeSlice.toggleTheme;
export const selectSetTheme: (state: StoreState) => IThemeSlice['setTheme'] = (state) => state.themeSlice.setTheme;
export const selectTheme: (state: StoreState) => IThemeSlice['theme'] = (state) => state.themeSlice.theme;
