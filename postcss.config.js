module.exports = {
    plugins: [
        require('postcss-normalize'),
        require('postcss-import')({
            path: ['assets/src/css']
        }),
        require('postcss-assets')({
            loadPaths: ['assets/src/fonts', 'assets/src/images']
        }),
        require('postcss-color-function'),
        require('postcss-preset-env')({
            stage: 0,
        })
    ]
};
