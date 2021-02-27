const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const ENV_PATH = '../.env'

var dotenv = require('dotenv').config({ path: __dirname + '/' + ENV_PATH });


module.exports = {
    entry: path.resolve(__dirname, './src/index.jsx'),
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
    },
    resolve: {
        modules: [path.join(__dirname, 'src'), 'node_modules'],
        alias: {
            react: path.join(__dirname, 'node_modules', 'react'),
        },
        extensions: ['*', '.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                    },
                ],
            },
            {
                test: /\.(png|jpe?g|gif|ico)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            favicon: "./src/favicon.ico",
        }),
        new webpack.HotModuleReplacementPlugin(),
        new Dotenv({
            path: ENV_PATH, // Path to .env file (this is the default)
            safe: false, // load .env.example (defaults to "false" which does not use dotenv-safe)
        }),
    ],
    devServer: {
        // contentBase: path.resolve(__dirname, './build'),
        hot: true,
        host: typeof dotenv === undefined ? dotenv.parsed.CLIENT_HOST : process.env.CLIENT_HOST || "0.0.0.0",
        port: typeof dotenv === undefined ? dotenv.parsed.CLIENT_PORT : process.env.CLIENT_PORT || 8080,
        open: true,
        headers: {
            "Access-Control-Allow-Origin": "*",
            // https: true
        },
        historyApiFallback: true,
    },
};