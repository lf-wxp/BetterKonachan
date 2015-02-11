define(['angular'], function(angular) {
    var checklist = angular.module('checklist', []);
    checklist.directive('checkbox', ['$parse', '$compile',
        function($parse, $compile) {
            return {
                restrict: 'E',
                scope: {
                    model: '=ngModel'
                },
                transclude: true,
                replace: true,
                require: 'ngModel',
                template: "<ul ng-transclude></ul>",
                controller: function($scope) {
                    this.add_value = function(value) {
                        $scope.model.push(value);
                    };
                    this.remove_value = function(value) {
                        $scope.model = $scope.model.filter(function(elem) {
                            return elem != value;
                        });
                    };
                    this.check_value = function(value) {
                        return $scope.model.some(function(elem) {
                            return elem == value;
                        });
                    };
                },
                link: function(scope, element, attrs) {
                    if (!scope.model) {
                        scope.model = [];
                    }
                }
            };
        }
    ]).
    directive("checkboxItem", function() {
        return {
            restrict: 'E',
            scope: {
                value: '@'
            },
            require: "^checkbox",
            replace: true,
            transclude: true,
            template: "<li><label><input type='checkbox' value='{{value}}' /></label><span ng-transclude>{{text}}</span></li>",
            link: function(scope, element, attrs, checkboxCtr) {
                var input = element.find('input')[0];
                var value = scope.value;
                if (checkboxCtr.check_value(value)) {
                    input.checked = true;
                    input.parentNode.classList.add("selected");
                }
                input.addEventListener("change", function(event) {
                    if (this.checked) {
                        this.parentNode.classList.add("selected");
                        scope.$apply(function() {
                            checkboxCtr.add_value(value);
                        });
                    } else {
                        this.parentNode.classList.remove("selected");
                        scope.$apply(function() {
                            checkboxCtr.remove_value(value);
                        });
                    }
                });
            }
        };
    });
    return checklist;
});