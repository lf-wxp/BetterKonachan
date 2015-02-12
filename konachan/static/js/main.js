require.config({
    baseUrl: "/static/js",
    paths: {
        'angular': [
            // '//cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.9/angular.min',
            '/static/lib/angular/angular'
        ],
        'angular-resource': [
            '/static/lib/angular/angular-resource.min'
        ],
        'angular-animate': [
            '/static/lib/angular/angular-animate.min'
        ],
        'angular-ui-router': [
            // '//cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.13/angular-ui-router.min',
            '/static/lib/other/angular-ui-router.min'
        ],
        'ngDialog': [
            '/static/lib/other/ngDialog.min'
        ],
        "services": 'services'
    },
    shim: {
        'angular': {
            exports: 'angular'
        },
        'angular-resource': {
            deps: ['angular'],
            exports: 'angular-resource'
        },
        'angular-animate': {
            deps: ['angular'],
            exports: 'angular-animate'
        },
        'angular-sanitize': {
            deps: ['angular'],
            exports: 'angular-sanitize'
        },
        'angular-ui-router': {
            deps: ['angular'],
            exports: 'angular-ui-router'
        }
    }
});
require(['angular', 'app', 'router', 'controllers', 'directives'], function(angular) {
    // 启动ng
    // angular.bootstrap(document, ['view']);
    angular.element(document).ready(function() {
        angular.bootstrap(document, ['view']);
    });
});