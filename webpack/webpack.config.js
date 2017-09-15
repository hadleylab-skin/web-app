const webpack = require('webpack');
const webpackConfig = require('./webpack.production.config');
const _ = require('lodash');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
    FRONTEND_DEV_URL: 'localhost',
    FRONTEND_DEV_PORT: '3000',
};

const publicPath = `http://${config.FRONTEND_DEV_URL}:${config.FRONTEND_DEV_PORT}/_dist`;

module.exports = _.merge(webpackConfig, {
    entry: {
        app: [
            `webpack-dev-server/client?http://${config.FRONTEND_DEV_URL}:${config.FRONTEND_DEV_PORT}`,
            'webpack/hot/only-dev-server',
            './src/index.js',
        ],
    },
    output: {
        publicPath,
    },
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        publicPath,
        hot: true,
        inline: false,
        lazy: false,
        quiet: false,
        noInfo: true,
        headers: { 'Access-Control-Allow-Origin': '*' },
        stats: { colors: true },
        host: '0.0.0.0',
        port: config.FRONTEND_DEV_PORT,
        contentBase: false,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'template.html',
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.LoaderOptionsPlugin({
            options: {
                context: __dirname,
            },
        }),
        new webpack.DefinePlugin({
            API_SERVER: `"${process.env.API_SERVER}"`,
        }),
    ],
});
