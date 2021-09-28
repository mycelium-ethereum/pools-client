module.exports = {
    important: true,
    darkMode: 'class',
    mode: 'jit',
    purge: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './archetypes/**/*.{js,ts,jsx,tsx}',
        // Add more here
    ],

    theme: {
        container: {
            center: true,
            padding: {
                '3xl': '5rem',
            },
        },
        extend: {
            colors: {
                tracer: {
                    50: '#F0F0FF',
                    100: '#DEDEFF',
                    200: '#A6A6F2',
                    400: '#3DA8F5',
                    500: '#3535DC',
                    600: '#2A2AC7',
                    800: '#0000B0',
                    900: '#00007A',
                },
                'cool-gray': {
                    50: '#F9FAFB',
                    100: '#F3F4F6',
                    200: '#E5E7EB',
                    300: '#D1D5DB',
                    600: '#6B7280',
                    700: '#374151',
                    900: '#111928',
                },
                theme: {
                    background: 'var(--background)',
                    ['background-secondary']: 'var(--background-secondary)',
                    ['background-nav-secondary']: 'var(--background-nav-secondary)',
                    primary: 'var(--primary)',
                    accent: 'var(--accent)',
                    text: 'var(--text)',
                    ['text-secondary']: 'var(--text-secondary)',
                    border: 'var(--border)',
                    ['button-bg']: 'var(--button-bg)',
                    ['button-bg-hover']: 'var(--button-bg-hover)'
                },
            },
            screens: {
                '3xl': '1800px',
            },
            backgroundImage: {
                'mobile-nav-bg': "url('/img/mobile-nav-bg.svg')",
                'nav-bg': "url('/img/nav-bg.svg')",
            }
        },
    },
    variants: {
        opacity: ['disabled'],
        cursor: ['disabled'],
        extend: {
            borderRadius: ['first', 'last'],
            backgroundColor: ['active', 'disabled'],
            cursor: ['disabled'],
            opacity: ['disabled'],
            textColor: ['disabled'],
        },
    },
    plugins: [],
};
