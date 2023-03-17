var path = require('path');

module.exports = (env, argv) => {
    let devtool = false;
    if (argv.mode === 'development') {
        devtool = 'inline-source-map';
    }
    console.log(`${argv.mode} build`);
    const module = {
        rules: [{
            test: /\.tsx?$/,
            exclude: /node_modules/,
            use: [{
                loader: 'ts-loader',
            }]

        }
        ]
    };

    return [

        {
            name: 'tracking.ts',
            devtool,
            entry: './src/index.ts',
            output: {
                path: path.resolve(__dirname, './dist'),
                filename: 'tracking.js',
                library: 'Tracking',
                libraryTarget: 'umd',
                libraryExport: 'default',
                globalObject: 'this'
            },
            resolve: {
                extensions: [".tsx", ".ts", ".js"],
            },
            module,
        },
    ];
};