const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const devtool = 'source-map';

// Режим сборки
let mode = 'development';
let target = 'web';
if(process.env.NODE_ENV === 'production') {
    mode = 'production';
    target = 'browserslist';
}

// Плагины
const plugins = [
    new HtmlWebpackPlugin({
        template: './src/index.html'
    }),
    new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
    }),
];

if(process.env.SERVE){
    plugins.push(new ReactRefreshPlugin());
}

module.exports = {
    mode,
    target,
    plugins,
    entry: './src/index.ts',
    devtool,
    output: {
        path: path.resolve(__dirname, 'dist'),
        assetModuleFilename: 'assets/[hash][ext][query]',
        clean: true
    },

    devServer: {
        hot: true,
    },

    module: {
        rules: [
            // html загрузчик
            {
                test: /\.(html)$/, 
                use: ['html-loader'] 
            },
            // css загрузчик
            {
                test: /\.(s[ac]|c)ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ],
            },
            // изображения
            {
                test: /\.(png|jpe?g|gif|svg|webp|ico)$/i,
                type: mode === 'production' ? 'asset' : 'asset/resource',
            },
            // шрифты
            {
                test: /\.(woff2?|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
            // js загрузчик
            {
                test: /\.jsx?$/,
                exclude: /node_modules/, // не обрабатываем файлы из node_modules
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true, // Использование кэша для избежания рекомпиляции
                    },
                },
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/, // не обрабатываем файлы из node_modules
                use: 'ts-loader',
            },
        ]
    }
}