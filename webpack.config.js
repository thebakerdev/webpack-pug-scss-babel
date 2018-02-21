let webpack = require('webpack');
let path = require('path');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let CleanWebpackPlugin = require('clean-webpack-plugin');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let BrowserSyncPlugin = require('browser-sync-webpack-plugin');
let inProduction = (process.env.NODE_ENV === 'production');
let cssDev = ['style-loader','css-loader','sass-loader'];
let cssProd = ExtractTextPlugin.extract({ use:['css-loader','sass-loader'], fallback: 'style-loader'});
let cssConfig = (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') ? cssProd : cssDev;

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
                use: cssConfig
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

        // new CleanWebpackPlugin(['dist'],{
        //     root: __dirname,
        //     verbose: true,
        //     dry: false
        // }),
        new HtmlWebpackPlugin({
            title: 'Webpack Starter',
            template: './src/index.pug'
        }),
        new webpack.LoaderOptionsPlugin({

            minimize: inProduction
        }),
        new webpack.ProvidePlugin({ // inject ES5 modules as global vars
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            Tether: 'tether'
        })
    ]
};

if(process.env.NODE_ENV === 'production') {

    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin(),
        new ExtractTextPlugin('./css/style.css')
    );
} else if(process.env.NODE_ENV === 'development') {

    module.exports.plugins.push(
        new ExtractTextPlugin('./css/style.css')
    );
} else {

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