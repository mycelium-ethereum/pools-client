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
        screeens: {
            sm: { min: '640px', max: '767px' },
            md: { min: '768px', max: '1023px' },
            lg: { min: '1024px', max: '1279px' },
            xl: { min: '1280px', max: '1600px' },
            '2xl': { min: '1601px' },
        },
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
                    // 100: '#DEDEFF',
                    // 200: '#A6A6F2',
                    800: '#0000B0',
                    900: '#00007A'
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
        }
    },
    plugins: [],
};
