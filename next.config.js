const path = require('path');

module.exports = ({
    cssModules: true,
    // // optional
    modifyVars: { '@primary-color': '#0000bd' },
    // // optional
    // lessVarsFilePath: './styles/antd-variables.less',
    // // optional https://github.com/webpack-contrib/css-loader#object
    // cssLoaderOptions: {},
    
    trailingSlash: true,

    watchOptions: {
        ignored: ['node_modules', 'public/static' ],
    },

    // exportPathMap: () => {
    //     return {
    //         '/': { page: '/' },
    //         '/browse': { page: '/browse' },
    //     };
    // },

    resolve: {
        symlinks: true,
    },


    webpack(config, { isServer }, options) {
        // // Fixes npm packages that depend on `fs` module
        // if (!isServer) {
        //     config.node = {
        //         fs: 'empty',
        //         electron: 'empty',
        //     };
        // }

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
                include: [
                    path.resolve(__dirname, "node_modules/@tracer-protocol/perpetual-pools-contracts")
                ],
                loader: "ts-loader" 
            }
        );
        return config;
    },
});
