export enum Theme {
    Dark = 'dark',
    Light = 'light',
    Matrix = 'matrix',
}

const size = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
};

export type BaseTheme = {
    background: {
        primary: string;
        secondary: string;
        tertiary: string;
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

    fontColor: {
        primary: string;
        secondary: string;
    };
    fontFamily: {
        body: string;
        heading: string;
    };
    fontSize: {
        xxxs: string;
        xxs: string;
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        xxl: string;
        xxxl: string;
    };
    device: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
        '2xl': string;
    };
};

export const baseTheme: BaseTheme = {
    background: {
        primary: 'var(--background)',
        secondary: 'var(--background-secondary)',
        tertiary: 'var(--background-nav-secondary)', // not used in styled-components
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

    fontColor: {
        primary: 'var(--text)',
        secondary: 'var(--text-secondary)',
    },

    fontFamily: {
        body: "'Inter', sans-serif",
        heading: "'Source Sans Pro', sans-serif",
    },

    fontSize: {
        xxxs: '0.625rem', // 10px
        xxs: '0.75rem', // 12px
        xs: '0.875rem', // 14px
        sm: '0.938rem', // 15px
        md: '1rem', // 16px
        lg: '1.125rem', // 18px
        xl: '1.25rem', // 20px
        xxl: '1.5rem', // 24px
        xxxl: '2rem', // 32px
    },

    device: {
        sm: `(min-width: ${size.sm})`,
        md: `(min-width: ${size.md})`,
        lg: `(min-width: ${size.lg})`,
        xl: `(min-width: ${size.xl})`,
        '2xl': `(min-width: ${size['2xl']})`,
    },
};
