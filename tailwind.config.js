module.exports = {
    important: true,
    purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
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
            screens: {
                '3xl': '1800px',
            },
        },
    },
    plugins: [],
};
