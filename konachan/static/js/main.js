require.config({
    baseUrl: "/static/js",
    paths: {
        'angular': [
            // '//cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.13/angular.min',
            '/static/lib/angular/angular.min'
        ],
        'angular-resource': [
            // '//cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.13/angular-resource.min',
            '/static/lib/angular/angular-resource.min'
        ],
        'angular-animate': [
            // '//cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.13/angular-animate.min',
            '/static/lib/angular/angular-animate.min'
        ],
        'angular-ui-router': [
            // '//cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.13/angular-ui-router.min',
            '/static/lib/other/angular-ui-router.min'
        ],
        'ngDialog': [
            // '//cdnjs.cloudflare.com/ajax/libs/ng-dialog/0.3.10/js/ngDialog.min',
            '/static/lib/other/ngDialog.min'
        ],
        'mobileDetect': [
            '/static/lib/other/mobileDetect'
        ],
        'angular-translate': [
            '/static/lib/other/angular-translate.min'
        ],
        'canvasBg': [
            '/static/lib/other/canvasBg'
        ]
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
        'angular-ui-router': {
            deps: ['angular'],
            exports: 'angular-ui-router'
        },
        'angular-translate': {
            deps: ['angular'],
            exports: 'angular-translate'
        }
    }
});
require(['angular', 'app', 'router', 'controllers', 'directives', 'translate'], function(angular) {
    // 启动ng
    // angular.bootstrap(document, ['view']);
    angular.element(document).ready(function() {
        angular.bootstrap(document, ['view']);
    });
});