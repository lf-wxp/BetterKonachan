define(['mobileDetect', 'canvasBg', 'angular', 'angular-resource', 'angular-animate', 'ngDialog', 'angular-ui-router', 'services'], function(mobileDetect, canvasBg) {
    var myAdmin = angular.module('view', ['ui.router', 'ngResource', 'ngAnimate', 'myService', 'ngDialog']);
    myAdmin.run(["$window", '$rootScope', '$state', "PageStorage", "LocalSetting", "GetOneBg",
        function($window, $rootScope, $state, PageStorage, LocalSetting, GetOneBg) {
            if (mobileDetect()) { // detect the platform whether is mobile
                $window.sessionStorage['isMobile'] = 'true';
            } else {
                $window.sessionStorage['isMobile'] = 'false';
            }
            var a = document.createElement('a'); //detect browser whether supoort download attribute
            if ((typeof a.download) != "undefined") {
                LocalSetting.setSetting('support', 'true');
            }
            for (key in $window.localStorage) {
                LocalSetting.setSetting(key, $window.localStorage[key]);
            }
            if (!$window.localStorage.hasOwnProperty('isSafe')) { //默认开启安全模式
                LocalSetting.setSetting('isSafe', 'true');
            }
            if (!$window.localStorage.hasOwnProperty('isRememberPage')) { //默认关闭记录页数
                LocalSetting.setSetting('isRememberPage', 'false');
            }
            if ($window.sessionStorage["current"]) {
                PageStorage.setCurrentPage(Number($window.sessionStorage["current"]));
            } else if ($window.localStorage['isRememberPage'] == "true") {
                PageStorage.setCurrentPage(Number($window.localStorage["localCurrent"]));
            } else {
                PageStorage.setCurrentPage(null);
            }
            if (LocalSetting.getSetting('cover')) { //header 和footer 的backgroundImg 设置
                setBgImg(LocalSetting.getSetting('cover'))
            } else {
                setBgImg('../images/bg.jpg');
            }

            function canvasParentSizeChange(selector,place) { //判断canvas的父元素窗口大小是否发生改变
                var canvasParent = document.querySelector(selector);
                var nowWith = canvasParent.clientWidth;
                var nowHeight = canvasParent.clientHeight;
                if (place=="header") {
                    var width = "headerWidth";
                    var height = "headerHeight";
                } 
                if (place=="content") {
                    var width = "contentWidth";
                    var height = "contentHeight";
                }
                if ($rootScope[width] == undefined && $rootScope[height] == undefined) {
                    $rootScope[width] = nowWith;
                    $rootScope[height] = nowHeight;
                    return true;
                } else if ($rootScope[width] == nowWith && $rootScope[height] == nowHeight) {
                    return false;
                } else {
                    $rootScope[width] = nowWith;
                    $rootScope[height] = nowHeight;
                    return true;
                }
            }

            function renderHeaderCanvasBg() {
                var can1 = new canvasBg('body header canvas');
                can1.renderAnimateRandomFillStroke('rect', "transparent", can1.getShape('doubleRect', {
                    w: 20,
                    h: 20,
                    sw: 10,
                    sh: 10
                }), 5);

            }

            function setBgImg(url) {
                var covers = document.querySelectorAll('.cover');
                [].forEach.call(covers, function(elem) {
                    elem.style.backgroundImage = "url(" + url + ")";
                })
            }

            function renderCover() { //远程获取一张图片当作header和footer的背景，并存入localstorage中
                GetOneBg.get().then(function(data) {
                    setBgImg(data);
                    LocalSetting.setSetting('cover', data);
                })
            }
            if ($window.sessionStorage['isMobile'] !== "true") {
                var w = angular.element($window);
                var handler;
                w.bind('resize', function() { //当窗口resize时，重新绘制背景
                    if (handler) {
                        clearTimeout(handler);
                    }
                    handler = setTimeout(function() {
                        var isHeaderChange = canvasParentSizeChange('body>header','header');
                        var isContentChange = canvasParentSizeChange('.inner','content')
                        if (isHeaderChange) {
                            renderHeaderCanvasBg();
                        }
                        if (isContentChange) {
                            $rootScope.$broadcast('contentRender');
                        }
                    }, 1000);
                });
                renderHeaderCanvasBg();
            }
            setTimeout(renderCover, 5000); //放入记时器中，异步执行。
        }
    ]);
    return myAdmin;
});