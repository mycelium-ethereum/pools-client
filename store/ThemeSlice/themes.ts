export enum Theme {
    Dark = 'dark',
    Light = 'light',
    Matrix = 'matrix',
}

export const themes: Record<
    Theme,
    {
        theme: Theme;
        background: string;
        'background-secondary': string;
        'background-nav-secondary': string;
        text: string;
        'text-secondary': string;
        border: string;
        'border-secondary': string;
        primary: string;
        'button-bg': string;
        'button-bg-hover': string;
        'is-dark': boolean;
    }
> = {
    light: {
        theme: Theme.Light,
        background: '#fff',
        /* gray-50 */
        'background-secondary': '#f9fafb',
        'background-nav-secondary': '#EEEEF6',

        /* cool-gray-900 */
        text: '#111928',

        /* cool-gray-700 */
        'text-secondary': '#374151',

        /* cool-gray-300*/
        border: '#D1D5DB',

        /* cool-gray-200 */
        'border-secondary': '#E5E7EB',

        /* tracer-800*/
        primary: '#0000B0',

        /* cool-gray-50 */
        'button-bg': '#F9FAFB',

        /* cool-gray-100 */
        'button-bg-hover': '#F3F4F6',

        'is-dark': false,
    },
    dark: {
        theme: Theme.Dark,
        /* cool-gray-900 */
        background: '#111928',

        'background-secondary': '#1B2436',

        /* cool-gray-900 */
        'background-nav-secondary': '#111928',

        /* gray-50 */
        text: '#FAFAFA',

        /* cool-gray-200 */
        'text-secondary': '#E5E7EB',

        /* cool-gray-500*/
        border: '#6B7280',

        /* cool-gray-700 */
        'border-secondary': '#374151',

        /* tracer-100*/
        primary: '#DEDEFF',

        /* cool-gray-800 */
        'button-bg': '#1F2A37',

        /* cool-gray-700 */
        'button-bg-hover': '#374151',

        'is-dark': true,
    },
    matrix: {
        theme: Theme.Matrix,
        /* cool-gray-900 */
        background: '#020204',

        'background-secondary': '#003b00',

        'background-nav-secondary': '#020204',

        text: '#22b455',

        'text-secondary': '#80ce87',

        border: '#008f11',

        //TODO get correct color for matrix
        'border-secondary': '#E5E7EB',

        primary: '#00ff41',

        'button-bg': '#003b00',

        'button-bg-hover': '#020204',

        'is-dark': false,
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
