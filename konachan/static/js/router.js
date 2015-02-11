define(['app', 'angular-ui-router'], function(app) {
    app.config(['$stateProvider', '$urlRouterProvider','$locationProvider',
        function($stateProvider, $urlRouterProvider,$locationProvider) {
            $stateProvider.
            state('view', {
                url: '/',
                templateUrl: 'static/partials/view.html',
                controller: 'indexCtr'
            });
            $locationProvider.html5Mode(true);
            $urlRouterProvider.otherwise('/');
        }
    ]);
});