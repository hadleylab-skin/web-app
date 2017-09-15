const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        app: './src/index.js',
    },
    output: {
        path: __dirname + '/../_dist',
        filename: '[name].bundle.js',
    },
    resolve: {
        modules: ['node_modules', '../src/'],
        extensions: ['.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'react-hot-loader',
                    },
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['react', ['es2015', { loose: true }]],
                            plugins: ['transform-object-rest-spread'],
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            importLoaders: 1,
                            localIdentName: '[name]__[local]--[hash:base64:3]',
                        },
                    },
                ],
            },
            {
                test: /\.(eot|woff|woff2|ttf|otf)$/,
                loader: 'url-loader',
                options: {
                    limit: true,
                    name: '[name].[ext]',
                },
            },
            {
                test: /\.(jpe?g|png|gif|mp3)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1,
                        },
                    },
                ],
            },
            {
                test: /\.svg$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240,
                        },
                    },
                    {
                        loader: 'svgo-loader',
                    },
                ],
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            template: 'template.html',
        }),
        new webpack.SourceMapDevToolPlugin({
            filename: '[name].map.js',
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                minimize: true,
                context: __dirname,
            },
        }),
        new webpack.DefinePlugin({
            API_SERVER: `"${process.env.API_SERVE}"`,
        }),
    ],
};
