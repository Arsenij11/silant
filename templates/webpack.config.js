const path = require('path');

module.exports = {
    mode: "development",
    entry: {
        filename: path.resolve(__dirname, 'src/index.js')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(jpg|png|svg|jpeg|gif)$/i,
                type: "asset/resource"
            }
        ]
    },
    devServer: {
        static: path.resolve(__dirname, 'dist'),
        port: 5000,
        hot: true,
        historyApiFallback: true
    },
}