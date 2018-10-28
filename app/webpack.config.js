const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const {getIfUtils, removeEmpty, propIf} = require('webpack-config-utils');

const PORT = 3000;
const HOST = 'localhost';

const sourcePath = path.join(__dirname);
const appPath = path.join(__dirname, './');
const buildPath = path.join(__dirname, './build');

module.exports = (env) => {
    const {ifDevelopment, ifProduction} = getIfUtils(env);

    return removeEmpty({
        entry: removeEmpty({
            app: removeEmpty([
                ifDevelopment(`webpack-dev-server/client?http://${HOST}:${PORT}`),
                ifDevelopment('webpack/hot/only-dev-server'),
                './index',
            ]),
        }),

        output: removeEmpty({
            filename: 'static/js/bundle-[hash:8].js',
            publicPath: '/',
            path: buildPath,
        }),

        devtool: propIf(env === 'development', 'eval', 'source-map'),

        devServer: ifDevelopment({
            inline: true,
            host: HOST,
            port: PORT,
            historyApiFallback: true,
            hot: true,
            disableHostCheck: true,
            clientLogLevel: "error",
            open: true,
            overlay: {
                warnings: true,
                errors: true
            }
        }),

        mode: env,

        resolve: {
            extensions: ['.js', '.jsx'],
            modules: [
                path.resolve(sourcePath, 'node_modules'),
                appPath
            ],
        },

        node: {
            fs: 'empty'
        },

        module: {
            rules: removeEmpty([
                {
                    test: /\.(js|jsx)$/,
                    include: appPath,
                    use: {
                        loader: 'babel-loader',
                        options: removeEmpty({
                            babelrc: false,
                            presets: ['@babel/preset-env', '@babel/preset-react'],
                            plugins: ifDevelopment(["react-hot-loader/babel"]),
                            cacheDirectory: ifDevelopment(true),
                            compact: ifProduction(true),
                        }),
                    }
                },
                ifDevelopment({
                    test: /\.scss$/,
                    use: [MiniCssExtractPlugin.loader, 'css-loader?sourceMap', 'sass-loader?sourceMap', {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [require('autoprefixer')({
                                'browsers': ['> 1%', 'last 2 versions']
                            })],
                        }
                    }]
                }),
                ifProduction({
                    test: /\.scss$/,
                    use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader', {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [require('autoprefixer')({
                                'browsers': ['> 1%', 'last 2 versions']
                            })],
                        }
                    }]
                }),
                {
                    test: /\.(jpg|jpeg|gif|png|svg)$/,
                    loader: 'url-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'static/media/img/',
                        limit: 10000
                    }
                },
                {
                    test: /\.(ttf|eot|woff|woff2)$/,
                    loader: 'file-loader',
                    options: {
                        name: 'static/media/fonts/[name].[ext]'
                    }
                }
            ])
        },

        plugins: removeEmpty([
            ifProduction(new UglifyJsPlugin({
                parallel: true,
                sourceMap: true,
                uglifyOptions: {
                    output: {comments: false}
                }
            })),
            ifProduction(new MiniCssExtractPlugin({
                filename: 'static/css/bundle.css'
            })),
            ifDevelopment(new MiniCssExtractPlugin({
                filename: 'bundle.css'
            })),
            new HtmlWebpackPlugin({
                template: "./index.html",
                filename: "./index.html",
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    keepClosingSlash: true,
                    minifyJS: true,
                    minifyCSS: true,
                    minifyURLs: true,
                },
            }),
            new webpack.HotModuleReplacementPlugin(),
        ])
    })
};
