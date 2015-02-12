define(['angular', 'angular-resource', 'angular-animate', 'ngDialog', 'angular-ui-router', 'services'], function() {
    var myAdmin = angular.module('view', ['ui.router', 'ngResource', 'ngAnimate', 'myService', 'ngDialog']);
    myAdmin.run(["$window", '$rootScope', '$state', "PageStorage", "LocalSetting",
        function($window, $rootScope, $state, PageStorage, LocalSetting) {
            var a = document.createElement('a'); //detect browser whether supoort download attribute
            if ((typeof a.download) != "undefined") {
                LocalSetting.setSetting('support', 'true');
            }
            if ($window.sessionStorage["current"]) {
                PageStorage.setCurrentPage(Number($window.sessionStorage["current"]));
            } else {
                PageStorage.setCurrentPage(null);
            }
            for (key in $window.localStorage) {
                LocalSetting.setSetting(key, $window.localStorage[key]);
            }
        }
    ]);
    return myAdmin;
});