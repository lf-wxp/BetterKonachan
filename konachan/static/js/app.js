define(['angular', 'angular-resource', 'angular-animate', 'ngDialog', 'angular-ui-router', 'services'], function() {
    var myAdmin = angular.module('view', ['ui.router', 'ngResource', 'ngAnimate', 'myService', 'ngDialog']);
    myAdmin.run(["$window", '$rootScope', '$state', "PageStorage", "LocalSetting",
        function($window, $rootScope, $state, PageStorage, LocalSetting) {
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
        }
    ]);
    return myAdmin;
});