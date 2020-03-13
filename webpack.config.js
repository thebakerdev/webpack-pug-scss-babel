const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {

    entry: {
        app: [
            './src/js/app.js',
            './src/scss/style.scss'
        ]    
    },
    
    output: {

        path: path.resolve(__dirname,'dist'),
        filename: 'js/[name].js'
    },

    devServer: {
        
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 9000,
        hot: true
    },
    optimization: {
        minimizer: [new TerserJSPlugin({}),new OptimizeCSSAssetsPlugin({})],
    },
    performance: {
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    module: {

        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/, 
                loader: 'babel-loader'
            },

            {
                test: /\.pug$/,
                loader: ['raw-loader','pug-html-loader?pretty']
            },

            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },

            {
                test: /\.svg|eot|ttf|woff|woff2$/,
                loader: 'file-loader',
                options: {
                    name: 'fonts/[name].[ext]'
                }
            },
            
            {
                test: /\.(png|jpg|gif)$/,
                loaders: [
                    {
                        loader: 'file-loader',
                        options: {
                        name: '[name].[ext]',
                        outputPath: 'images/',
                        useRelativePath: true
                        }
                    },
                    'img-loader'
                ]
                
              }
        ]
    },

    plugins: [

        new HtmlWebpackPlugin({
            title: 'Webpack Starter',
            template: './src/index.pug'
        }),
        new webpack.ProvidePlugin({ // inject ES5 modules as global vars
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            Tether: 'tether'
        }),
        new MiniCssExtractPlugin({
			filename: "./css/style.css",
			chunkFilename: "[id].css"
		})
    ]
};

if(process.env.NODE_ENV !== 'production' || process.env.NODE_ENV !== 'development') {

    module.exports.plugins.push(
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new BrowserSyncPlugin({
            host: 'localhost',
            port: 3000,
            proxy: 'http://localhost:9000/',
            files: [
                {
                    match: [
                        '**/*.pug'
                    ],
                    fn: function(event, file) {

                        if (event === 'change') {
                            const bs = require('browser-sync').get('bs-webpack-plugin');

                            bs.reload();
                        }
                    }
                }
            ]
        },{
            reload:false
        })
    );
} 