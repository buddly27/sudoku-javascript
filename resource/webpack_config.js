/**
 * Production Webpack configuration.
 */

const path = require("path");


module.exports = {
    entry: [
        path.join(process.cwd(), "source/sudoku/index.js"),
    ],

    output: {
        library: "sudoku",
        filename: "sudoku.min.js",
        path: path.resolve(process.cwd(), "dist"),
        libraryTarget: "umd",
        umdNamedDefine: true,
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /node_modules\/(?!iter-tools)/,
            },
        ],
    },

    resolve: {
        modules: ["source", "node_modules"],
        extensions: [".js"],
        mainFields: [
            "jsnext:main",
            "main",
        ],
    },

    devtool: "source-map",
    performance: {
        assetFilter: (assetFilename) => !(/(\.map$)/.test(assetFilename)),
    },
};
