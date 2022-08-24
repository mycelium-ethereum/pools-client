// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

const BASE_PATH = 'https://pools.mycelium.xyz';

module.exports = {
    cssModules: true,
    // // optional
    modifyVars: { '@primary-color': '#0000bd' },

    trailingSlash: true,

    watchOptions: {
        ignored: ['node_modules', 'public/static'],
    },

    env: {
        siteTitle: 'Mycelium Perpetual Pools',
        siteDescription: '',
        siteUrl: BASE_PATH,
        siteImagePreviewUrl: 'img/opengraph/main.png',
    },

    async redirects() {
        return [
            // Redirect all pages to new pools.mycelium.xyz URL
            { source: '/', destination: BASE_PATH, permanent: true },
            { source: '/trade', destination: `${BASE_PATH}/trade`, permanent: true },
            { source: '/portfolio', destination: `${BASE_PATH}/portfolio`, permanent: true },
            { source: '/stake', destination: `${BASE_PATH}/stake`, permanent: true },
            { source: '/pools', destination: `${BASE_PATH}/trade`, permanent: true },
            { source: '/bridge', destination: 'https://bridge.arbitrum.io/', permanent: true },
            { source: '/stakebpt', destination: `${BASE_PATH}/stake`, permanent: true },
            { source: '/privacy-policy', destination: 'https://mycelium.xyz/privacy-policy', permanent: true },
            {
                source: '/terms-of-use',
                destination: 'https://mycelium.xyz/terms-of-use',
                permanent: true,
            },
            {
                source: '/disclaimer',
                destination: 'https://mycelium.xyz/privacy-policy',
                permanent: true,
            },
            { source: '/portfolio/history', destination: `${BASE_PATH}/portfolio`, permanent: true },
            { source: '/portfolio/commits', destination: `${BASE_PATH}/portfolio`, permanent: true },
        ];
    },

    webpack(config) {
        // Fixes npm packages that depend on `fs` module
        config.resolve.fallback = {
            fs: false,
            crypto: false,
            stream: false,
            os: false,
            http: false,
            https: false,
            path: false,
            process: false,
            ws: false,
        };

        config.module.rules.push(
            {
                test: /\.(png|jpg|gif|eot|ttf|woff|woff2)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 100000,
                    },
                },
            },
            {
                test: /\.svg$/,
                use: ['@svgr/webpack'],
            },
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            {
                test: /\.ts?$/,
                options: {
                    allowTsInNodeModules: true,
                    compilerOptions: {
                        noEmit: false,
                    },
                },
                include: [path.resolve(__dirname, 'node_modules/@tracer-protocol/perpetual-pools-contracts')],
                loader: 'ts-loader',
            },
        );

        return config;
    },
    compiler: {
        // ssr and displayName are configured by default
        styledComponents: true,
    },
};
