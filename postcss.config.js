module.exports = {
    plugins: [
        require('postcss-import')({
            path: ['resource/assets/']
        }),
        // require('postcss-url'),
        // require('postcss-simple-vars'),
        // require('postcss-color-function'),
        require('postcss-extend'),
        require('postcss-nested'),
        require('postcss-mixins'),
        require('postcss-cssnext'),
        // require('postcss-iconfont')({
        //     outputPath: './public/dist/fonticon/',
        //     publishPath: '../fonticon/',
        // }),
    ]
}
