define(['angular', 'angular-resource', 'angular-animate', 'ngDialog', 'angular-ui-router', 'services'], function() {
    var myAdmin = angular.module('view', ['ui.router', 'ngResource', 'ngAnimate', 'myService', 'ngDialog']);
    myAdmin.run(["$window", '$rootScope', '$state', "PageStorage",
        function($window, $rootScope, $state, PageStorage) {
            if ($window.sessionStorage["current"]) {
                PageStorage.setCurrentPage(Number($window.sessionStorage["current"]));
            } else {
                PageStorage.setCurrentPage(null);
            }
        }
    ]);
    return myAdmin;
});