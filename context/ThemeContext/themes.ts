export type Theme = 'dark' | 'light' | 'matrix';

export const themes: Record<
    Theme,
    {
        background: string;
        'background-secondary': string;
        'background-nav-secondary': string;
        text: string;
        'text-secondary': string;
        border: string;
        primary: string;
        'button-bg': string;
        'button-bg-hover': string;
    }
> = {
    light: {
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

        /* tracer-800*/
        primary: '#0000B0',

        /* cool-gray-50 */
        'button-bg': '#F9FAFB',

        /* cool-gray-100 */
        'button-bg-hover': '#F3F4F6',
    },
    dark: {
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

        /* tracer-100*/
        primary: '#DEDEFF',

        /* cool-gray-800 */
        'button-bg': '#1F2A37',

        /* cool-gray-700 */
        'button-bg-hover': '#374151',
    },
    matrix: {
        /* cool-gray-900 */
        background: '#020204',

        'background-secondary': '#003b00',

        'background-nav-secondary': '#020204',

        text: '#22b455',

        'text-secondary': '#80ce87',

        border: '#008f11',

        primary: '#00ff41',

        'button-bg': '#003b00',

        'button-bg-hover': '#020204',
    },
};
