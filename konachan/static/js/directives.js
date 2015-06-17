define(['app', 'ngDialog'], function(app) {
    function isEmpty(value) {
        return angular.isUndefined(value) || value === '' || value === null || value !== value;
    }
    app.directive('toggle', ['LocalSetting', //radio 表单指令
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
                    if (scope.model == 'true') {
                        radio.checked = true;
                    }
                    label.addEventListener("click", function(event) {
                        if (radio.checked) {
                            element.removeClass('checked');
                            radio.checked = false;
                            scope.$apply(function() {
                                scope.model = 'false';
                            });
                        } else {
                            element.addClass('checked');
                            radio.checked = true;
                            scope.$apply(function() {
                                scope.model = 'true';
                            });
                        }
                    }, false);
                }
            };
        }
    ]).
    directive('noredirect', ['GetPic', //通过a标签的src属性获取konachan sample图片会被重定向，所以只能从新通过服务器再获取一次。
        function(GetPic) {
            return {
                restrict: 'A',
                scope: true,
                link: function(scope, element, attrs) {
                    var preview = element.parent('.preview');
                    var sample_width = parseFloat(attrs['width']);
                    var sample_height = parseFloat(attrs['height']);
                    element.css({
                        'height': '0px',
                        'opacity': '0'
                    });
                    element[0].previousElementSibling.style.display = "none";
                    preview.css('height', '0px');
                    preview[0].insertAdjacentHTML('beforeEnd', '<div class="loader-inner line-scale"><div></div><div></div><div></div><div></div><div></div></div>');
                    GetPic.get({ //调用GetPic服务获取预览图片
                        url: attrs['url']
                    }).then(function(result) {
                        url = result['data']['data_url'];
                        preview[0].removeChild(preview[0].querySelector('.loader-inner'));
                        comWidth = parseFloat(window.getComputedStyle(element[0]).width);
                        comHeight = sample_height * comWidth / sample_width;
                        element.css({
                            'height': comHeight + "px",
                            'opacity': '1'
                        });
                        element[0].previousElementSibling.style.display = "block";
                        preview.css('height', comHeight + "px");
                        element.attr('src', url);
                    });
                }
            };
        }
    ]).
    directive('dashFor', ['$location', //一个简单左侧菜单栏高亮指令
        function($location) {
            return {
                restrict: 'AE',
                scope: '=',
                link: function(scope, elem, attrs) {
                    scope.$on('$viewContentLoaded', function() {
                        as = elem.find('a');
                        for (var i = 0; i < as.length; i++) {
                            index = as[i].href.indexOf('/', 10) ? as[i].href.indexOf('/', 10) : 0;
                            localurl = as[i].href.slice(index);
                            if (localurl == $location.path()) {
                                as[i].classList.add('active');
                            } else {
                                as[i].classList.remove('active');
                            }

                        }
                    });
                }
            };
        }
    ]).
    directive('onFinishRender', function($timeout) { //ng-repeat最后一个渲染完成。触发时间
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function() {
                        scope.$emit('ngRepeatFinished');
                    });
                }
            }
        };
    }).
    directive('ngMin', function() { // 替换默认的input['number']的验证,因为无法在模版渲染后（也就是默认验证初始化后)，在更改min或max的值.那样完全没有效果
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, elem, attr, ctrl) {
                scope.$watch(attr.ngMin, function() {
                    ctrl.$setViewValue(ctrl.$viewValue);
                });
                var minValidator = function(value) {
                    var min = scope.$eval(attr.ngMin) || 0;
                    if (!isEmpty(value) && value < min) {
                        ctrl.$setValidity('ngMin', false);
                        return undefined;
                    } else {
                        ctrl.$setValidity('ngMin', true);
                        return value;
                    }
                };

                ctrl.$parsers.push(minValidator);
                ctrl.$formatters.push(minValidator);
            }
        };
    }).
    directive('ngMax', function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, elem, attr, ctrl) {
                scope.$watch(attr.ngMax, function() {
                    ctrl.$setViewValue(ctrl.$viewValue);
                });
                var maxValidator = function(value) {
                    var max = scope.$eval(attr.ngMax) || Infinity;
                    if (!isEmpty(value) && value > max) {
                        ctrl.$setValidity('ngMax', false);
                        return undefined;
                    } else {
                        ctrl.$setValidity('ngMax', true);
                        return value;
                    }
                };
                ctrl.$parsers.push(maxValidator);
                ctrl.$formatters.push(maxValidator);
            }
        };
    });
});