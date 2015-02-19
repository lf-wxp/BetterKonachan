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
                    if (LocalSetting.getSetting('isSafe') == 'true') {
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
    ]).
    directive('noredirect', ['GetPic',
        function(GetPic) {
            return {
                restrict: 'A',
                scope: {
                    'url': '@'
                },
                link: function(scope, element, attrs) {
                    var pic = new GetPic();
                    pic.url = scope.url;
                    var i = document.createElement("i");
                    i.className = 'loading spinner icon';
                    var preview = element.parent('.preview');
                    var sample_width = parseFloat(attrs['width']);
                    var sample_height = parseFloat(attrs['height']);
                    element.css({
                        'height': '0px',
                        'opacity': '0'
                    });
                    preview.css('height', '0px');
                    preview.append(i);
                    pic.$post({}, function(success) {
                        url = success['data_url'];
                        i.remove();
                        comWidth = parseFloat(window.getComputedStyle(element[0]).width);
                        comHeight = sample_height * comWidth / sample_width;
                        element.css({
                            'height': comHeight + "px",
                            'opacity': '1'
                        });
                        preview.css('height', comHeight + "px");
                        element.attr('src', url);
                    });
                }
            }
        }
    ])
});