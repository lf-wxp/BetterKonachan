define(['angular', 'angular-resource'], function(angular) {
    var myService = angular.module('myService', ['ngResource']);
    myService.
    factory('Post', ['$resource', '$window',
        function($resource, $window) {
            return $resource("/post?page=:page&isSafe=:isSafe", {
                page: '@page'
            }, {
                'query': {
                    method: 'GET',
                    isArray: false
                }
            });
        }
    ]).
    factory('GetPic', ["$q", "$http", //图片预览服务。
        function($q, $http) {
            var timeoutPromise = null;
            return {
                get: function(data) {
                    if (timeoutPromise) {
                        timeoutPromise.resolve();
                    }
                    timeoutPromise = $q.defer();
                    return $http.post("/pic", data, {
                        timeout: timeoutPromise.promise
                    });
                },
                abort: function() {
                    timeoutPromise.resolve();
                    timeoutPromise = $q.defer(); //这里需要新建一个$q对象才能再次请求
                }
            };
        }
    ]).
    factory('GetOneBg', ['$q', '$http',
        function($q, $http) {
            return {
                get: function() {
                    var deferred = $q.defer();
                    $http.get("/pic", {
                        'data': 'string',
                        'async': true,
                        'cache': true
                    }).success(function(data) {
                        deferred.resolve(data);
                    })
                    return deferred.promise;
                }
            };
        }
    ]).
    service('PageStorage', ['$window',
        function($window) {
            this.pages = {};
            this.getCurrentPage = function() {
                return this.pages["current"];
            };
            this.setCurrentPage = function(value) {
                this.pages["current"] = value;
                $window.sessionStorage['current'] = value;
            };
            this.getAllPages = function() {
                return this.pages["allpages"];
            };
            this.setAllPages = function(value) {
                this.pages["allpages"] = value;
            };
        }
    ]).
    service('LocalSetting', ['$window',
        function($window) {
            this.setting = {};
            this.getSetting = function(name) {
                return this.setting[name];
            };
            this.setSetting = function(name, value) {
                this.setting[name] = value;
                $window.localStorage[name] = value;
            };
        }
    ]);
});