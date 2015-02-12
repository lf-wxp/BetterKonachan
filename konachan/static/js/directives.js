define(['app', 'ngDialog'], function(app) {
    app.directive('toggle', ['LocalSetting',
        function(LocalSetting) {
            return {
                restrict: 'E',
                scope: {
                    model: '=ngModel'
                },
                transclude: true,
                replace: true,
                template: "<div class='ui toggle checkbox'><input type='radio'><label ng-transclude></label></div>",
                link: function(scope, element, attrs) {
                    var label = element.find('label')[0];
                    var radio = element.find('input')[0];
                    if (LocalSetting.getSetting('isSafe')=='true') {
                        radio.checked = true;
                    }
                    label.addEventListener("click", function(event) {
                        if (radio.checked) {
                            element.removeClass('checked');
                            radio.checked = false;
                            scope.$apply(function() {
                                scope.model = false;
                            });
                        } else {
                            element.addClass('checked');
                            radio.checked = true;
                            scope.$apply(function() {
                                scope.model = true;
                            });
                        }
                    }, false);
                }
            };
        }
    ]);
});