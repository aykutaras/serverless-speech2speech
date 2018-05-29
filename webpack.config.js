const path = require('path');
const slsw = require('serverless-webpack');
const nodeExternals = require("webpack-node-externals");

module.exports = {
    entry: slsw.lib.entries,
    devtool: 'source-map',
    resolve: {
        extensions: [
            '.js',
            '.jsx',
            '.json',
            '.ts',
            '.tsx'
        ],
        modules: [
            ".",
            "src/extension/",
            "src/utility/"
        ]
    },
    output: {
        libraryTarget: 'commonjs',
        path: path.join(__dirname, '.webpack'),
        filename: '[name].js',
    },
    target: 'node',
    externals: [nodeExternals()],
    module: {
        loaders: [
            { test: /\.ts(x?)$/, loader: 'ts-loader' },
        ],
    },
};
