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
                    50: '#F0F0FF',
                    100: '#DEDEFF',
                    200: '#A6A6F2',
                    400: '#3DA8F5',
                    500: '#3535DC',
                    600: '#2A2AC7',
                    650: '#1C64F2',
                    700: '#0d29ff',
                    800: '#0000B0',
                    900: '#00007A',
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
                    800: '#1F2A37',
                    900: '#111928',
                },
                'dark-green': '#032018',
                'dark-red': '#230F0F',
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
                },
            },
            screens: {
                '3xl': '1800px',
            },
            backgroundImage: {
                'mobile-nav-bg': "url('/img/mobile-nav-bg.svg')",
                'nav-bg': "url('/img/nav-bg.svg')",
                'matrix-bg': "url('/img/matrix.gif')",
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
