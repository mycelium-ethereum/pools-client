module.exports = {
    important: true,
    mode: 'jit',
    purge: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './archetypes/**/*.{js,ts,jsx,tsx}',
        // Add more here
    ],

    theme: {
        themeVariants: ['dark', 'matrix'],
        // backgroundImage: {
        //     'dropdown-gradient':
        //         'linear-gradient(44.71deg, rgba(28, 100, 242, 0.5) -529.33%, rgba(28, 100, 242, 0) 115.83%)',
        // },
        container: {
            center: true,
            padding: {
                '3xl': '5rem',
            },
        },
        extend: {
            colors: {
                orange: {
                    400: '#FF8A4C',
                },
                tracer: {
                    50: '#A9D3A6',
                    100: '#A9D3A6',
                    200: '#6BB466',
                    400: '#3A9B33',
                    500: '#098200',
                    600: '#097C00',
                    650: '#076800',
                    700: '#054E00',
                    800: '#043400',
                    900: '#011400',
                    midblue: '#3DA8F5',
                    darkblue: '#03065E',
                    green: '#61DA56',
                    red: '#FF5621',
                },
                'cool-gray': {
                    50: '#F9FAFB',
                    100: '#F3F4F6',
                    200: '#E5E7EB',
                    300: '#D1D5DB',
                    400: '#9CA3AF',
                    500: '#6B7280',
                    600: '#6B7280',
                    700: '#374151',
                    800: '#8CC63F33',
                    900: '#111928',
                },
                'up-green': '#4FE021',
                'down-red': '#FF5621',
                'long-gradient-start': '#8CC63F33',
                'short-gradient-start': '#ED454A33',
                'dark-green': '#032018',
                'dark-red': '#230F0F',
                red: {
                    600: '#FF5621',
                },
                purple: {
                    50: '#E9C5F9',
                    100: '#D96EF2',
                    200: '#871FBB',
                    300: '#7223FF',
                },
                theme: {
                    background: 'var(--background)',
                    ['background-secondary']: 'var(--background-secondary)',
                    ['background-nav-secondary']: 'var(--background-nav-secondary)',
                    primary: 'var(--primary)',
                    text: 'var(--text)',
                    ['text-secondary']: 'var(--text-secondary)',
                    border: 'var(--border)',
                    ['button-bg']: 'var(--button-bg)',
                    ['button-bg-hover']: 'var(--button-bg-hover)',
                    ['button-bg-gradient']: 'var(--button-gradient-bg)',
                    ['button-bg-gradient-hover']: 'var(--button-gradient-bg-hover)',
                },
            },
            screens: {
                xs: '375px',
                '3xl': '1800px',
            },
            backgroundImage: {
                'mobile-nav-bg': "url('/img/mobile-nav-bg.svg')",
                'nav-bg': "url('/img/nav-bg.svg')",
                'matrix-bg': "url('/img/matrix.gif')",
            },
            fontFamily: {
                aileron: ["'aileron'", 'sans-serif'],
                inter: ["'Inter'", 'sans-serif'],
            },
        },
    },
    variants: {
        opacity: ['disabled'],
        cursor: ['disabled'],
        extend: {
            borderRadius: ['first', 'last'],
            backgroundColor: ['active', 'disabled', 'dark', 'dark:focus', 'dark:hover'],
            cursor: ['disabled'],
            opacity: ['disabled'],
            outline: ['active'],
            textColor: ['disabled', 'dark', 'dark:focus', 'dark:hover'],
        },
    },
    plugins: [require('tailwindcss-multi-theme')],
};
