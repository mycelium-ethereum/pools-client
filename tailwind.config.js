module.exports = {
    important: true,
    // lfg
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
                    // 200: '#A6A6F2',
                    500: '#3535DC',
                    600: '#2A2AC7',
                    800: '#0000B0',
                    900: '#00007A'
                },
                'cool-gray': {
                    50: '#F9FAFB',
                    100: '#F3F4F6',
                    200: '#E5E7EB',
                    300: '#D1D5DB',
                    700: '#374151',
                    900: '#111928'
                }
            },
            screens: {
                '3xl': '1800px',
            },
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
