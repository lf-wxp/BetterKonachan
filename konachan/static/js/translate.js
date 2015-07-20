define(['app', 'angular-translate'], function(app) {
    app.config(['$translateProvider',
        function($translateProvider) {
            $translateProvider.translations('zh', {
                'Post': '列表',
                'Setting': '设置',
                'Any Question,Contact me': '任何问题请联系我',
                'browser not support': '该浏览器不支持直接点击下载，请换最新的chrome或firefox',
                'data timeout': '获取数据超时或错误，程序会自动刷新',
                'page number only': '请求页数必须为数字',
                'jump': '跳转',
                'Download': '下载',
                'smode': '安全模式',
                'prev':'上一页',
                'next':'下一页',
                'remember page': '是否记住浏览页数',
                'Download':'下载',
                'searchtext':'这里搜索',
                'search':'搜索',
                'no result':'搜索没有结果'
            });

            $translateProvider.translations('en', {
                'Post': 'POST',
                'Setting': 'SETTING',
                'Any Question,Contact me': 'Any Question,Contact me',
                'browser dnot support': 'The browser you use does not support direct click download, please change the newest chrome or firefox',
                'data timeout': 'Get data timeout or error, the program will automatically refresh',
                'page number only': 'Request must be a number of pages',
                'jump': 'Go',
                'Download': 'Download',
                'smode': 'Security mode',
                'prev':'prev',
                'next':'next',
                'remember page': 'Remember the last page you visited',
                'Download':'Download',
                'searchtext':'search here',
                'search':'search',
                'no result':'There is no results'
            });
            
            $translateProvider.useSanitizeValueStrategy('escaped');
            $translateProvider.preferredLanguage('zh');
        }
    ]);
})