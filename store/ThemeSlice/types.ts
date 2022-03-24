import { Theme } from './themes';

export interface IThemeSlice {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}
