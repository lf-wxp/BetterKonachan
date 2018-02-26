module.exports = {
    plugins: [
        require('postcss-normalize')({
            'browserslist': 'last 2 versions',
        }),
        require('postcss-import')({
            path: ['resource/src/css', 'resource/src/fonts', 'resource/src/images'],
        }),
        require('postcss-cssnext'),
    ]
}
