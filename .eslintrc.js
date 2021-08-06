module.exports = {
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    parserOptions: {
        ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports
        ecmaFeatures: {
            jsx: true, // Allows for the parsing of JSX
        },
    },
    ignorePatterns: ['**/*.stories.tsx', 'public/static/*'],
    settings: {
        react: {
            version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
        },
    },
    extends: [
        'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
        'plugin:@typescript-eslint/recommended', // Uses the recommended rules from @typescript-eslint/eslint-plugin
        'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    ],
    rules: {
        curly: 2, // enforce brace style for control statements
        'default-case': 2, // require default in switch
        'default-case-last': 2,
        quotes: [2, 'single', { allowTemplateLiterals: true, avoidEscape: true }],
        eqeqeq: 2,
        'react/prop-types': 0,
        '@typescript-eslint/no-unused-vars': [1, { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-explicit-any': [0],
        '@typescript-eslint/ban-ts-comment': [0],
        'no-unreachable-loop': 1,
        'no-unreachable': 1,
        // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
        // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    },
};
