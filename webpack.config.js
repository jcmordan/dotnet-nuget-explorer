var HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const tsImportPlugin = require('ts-import-plugin');

module.exports = {
    entry: {
        view: './src/view/index.tsx'
    },
    output: {
        path: path.resolve(__dirname, 'out'),
        filename: "[name].js"
    },
    plugins: [new HtmlWebpackPlugin({
        template: __dirname + '/src/view/index.html',
        filename: 'index.html'
    })],
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /node_modules/,
                    chunks: "initial",
                    name: "vendor",
                    priority: 10,
                    enforce: true
                }
            }
        }
    },
    devtool: 'eval-source-map',
    resolve: {
        extensions: ['.js', '.ts', '.tsx', '.json']
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: 'ts-loader',
                options: {
                    getCustomTransformers: () => ({
                        before: [tsImportPlugin({
                            libraryName: 'antd',
                            libraryDirectory: 'es',
                            style: true,
                        })]
                    })
                }
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            javascriptEnabled: true,
                            sourceMap: true,
                            modifyVars: {
                                '@body-background': 'var(--background-color)',
                            }
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader", // creates style nodes from JS strings
                    "css-loader", // translates CSS into CommonJS
                    "sass-loader" // compiles Sass to CSS, using Node Sass by default
                ]
            }
        ]
    },
    performance: {
        hints: false
    }
};