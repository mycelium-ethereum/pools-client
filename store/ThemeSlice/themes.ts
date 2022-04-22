export enum Theme {
    Dark = 'dark',
    Light = 'light',
    Matrix = 'matrix',
}

export type BaseTheme = {
    background: {
        primary: string;
        secondary: string;
        tertiary: string;
    };

    fontColor: {
        primary: string;
        secondary: string;
    };
    fontFamily: {
        body: string;
        heading: string;
    };

    border: {
        primary: string;
        secondary: string;
    };

    colors: {
        primary: string;
    };

    button: {
        bg: string;
        hover: string;
    };
};

export const baseTheme: BaseTheme = {
    background: {
        primary: 'var(--background)',
        secondary: 'var(--background-secondary)',
        tertiary: 'var(--background-nav-secondary)', // not used in styled-components
    },

    fontColor: {
        primary: 'var(--text)',
        secondary: 'var(--text-secondary)',
    },

    colors: {
        primary: 'var(--primary)',
    },

    border: {
        primary: 'var(--border)',
        secondary: 'var(--border-secondary)',
    },

    button: {
        bg: 'var(--button-bg)',
        hover: 'var(--button-bg-hover)',
    },

    fontFamily: {
        body: "'Inter', sans-serif",
        heading: "'Source Sans Pro', sans-serif",
    },
};

const size = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
};

export const device = {
    sm: `(min-width: ${size.sm})`,
    md: `(min-width: ${size.md})`,
    lg: `(min-width: ${size.lg})`,
    xl: `(min-width: ${size.xl})`,
    '2xl': `(min-width: ${size['2xl']})`,
};
