const path = require('path');
// const CopyPlugin = require('copy-webpack-plugin');
module.exports = {
    mode: 'production',
    entry: {
        service_worker: path.resolve(__dirname, 'src', 'service_worker.ts'),
        popup: path.resolve(__dirname, 'src', 'popup.ts'),
        main: path.resolve(__dirname, 'src', 'main.ts'),
        detector: path.resolve(__dirname, 'src', 'detector.ts'),
        options: path.resolve(__dirname, 'src', 'options.ts'),
    },
    output: {
        path: path.join(__dirname, 'src/dist'),
        filename: '[name].js',
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        // new CopyPlugin({
        //     patterns: [{ from: '.', to: '.', context: 'public' }],
        // }),
    ],
    devtool: 'source-map',
};
