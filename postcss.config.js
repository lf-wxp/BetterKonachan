module.exports = {
    plugins: [
        require('postcss-normalize')({
            'browserslist': 'last 2 versions',
        }),
        require('postcss-import')({
            path: ['assets/src/css'],
        }),
        require('postcss-assets')({
            loadPaths: ['assets/src/fonts','assets/src/images'],
        }),
        require('postcss-color-function'),
        require('postcss-preset-env')({
            stage: 0,
            browsers: ' > 3%'
        }),
    ]
}
