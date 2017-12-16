require('babel-core/register')({
    presets: [
        ['env'],
    ],
    plugins: [
        'transform-class-properties',
        'syntax-dynamic-import',
        'transform-object-rest-spread',
    ],
});
require('babel-polyfill');
require('./app.js');
