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
    factory('GetPic', ['$resource',
        function($resource) {
            return $resource("/pic",{},{'post':{
                method:"POST"
            }});
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