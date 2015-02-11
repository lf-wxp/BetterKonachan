'use strict';
define(['angular'], function(angular) {
    var dropdown = angular.module('dropdown', []);
    dropdown.directive('dropdown', function() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                title: '@',
                model: '=ngModel'
            },
            controller: function($scope) {
                this.update_title = function(title, value) {
                    $scope.model = value;
                    $scope.intitle = title;
                };
            },
            template: '<div class="{{dropdown_class}}">' + '<div class="default text">{{intitle}}</div>' + '<i class="dropdown icon"></i>' + '<div class="menu" ng-transclude>' + '</div>' + '</div>',
            link: function(scope, element, attrs, controller) {
                scope.dropdown_class = 'ui selection dropdown';
                scope.open = false;
                if (scope.model) {
                    scope.intitle = scope.model;
                } else {
                    scope.intitle = scope.title;
                }
                element.bind('click', function() {
                    if (scope.open === false) {
                        scope.open = true;
                        scope.$apply(function() {
                            scope.dropdown_class = 'ui selection dropdown active visible';
                        });
                    } else {
                        scope.open = false;
                        scope.$apply(function() {
                            scope.dropdown_class = 'ui selection dropdown';
                        });
                    }
                });
            }
        };
    })
        .directive('dropdownItem', function() {
            return {
                restrict: 'AE',
                replace: true,
                transclude: true,
                require: '^dropdown',
                scope: {
                    value: "@"
                },
                template: '<div class="item" ng-transclude ></div>',
                link: function(scope, element, attrs, DropDownController) {
                    element.bind('click', function() {
                        var text = element.find("span")[0].innerHTML;
                        var value = scope.value || text;
                        DropDownController.update_title(text, value);
                    });
                }
            };
        });
    return dropdown;
});