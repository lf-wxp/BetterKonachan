define(['angular', 'angular-resource'], function(angular) {
    var myService = angular.module('myService', ['ngResource']);
    myService.
    factory('Post', ['$resource',
        function($resource) {
            return $resource("/post/:page", {
                page: '@page'
            }, {
                'query': {
                    method: 'GET',
                    isArray: false
                }
            });
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
    ]);
});