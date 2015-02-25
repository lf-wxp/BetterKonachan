define(['app', 'services', 'ngDialog', 'angular-ui-router'], function(app) {
    app.
    controller('indexCtr', ['$scope', '$window', 'ngDialog', 'Post', 'PageStorage', 'LocalSetting',
        function($scope, $window, ngDialog, Post, PageStorage, LocalSetting) {
            var navSize = 5;
            var isFinish = true;
            $scope.noFinish = true;
            $scope.isSafe = LocalSetting.getSetting('isSafe');

            if (LocalSetting.getSetting('support') === 'false') { // 弹出检测download属性
                ngDialog.open({
                    template: 'notify',
                    className: 'ngdialog-theme-default ngdialog-text'
                });
            }

            $scope.$on('isSafeChange', function() { //监听isSafeChange事件
                invoke(PageStorage.getCurrentPage());
            });

            function creatNavPage() { // 创建分页的导航页
                current = PageStorage.getCurrentPage();
                allpages = PageStorage.getAllPages();
                half = Math.floor(navSize / 2);
                navpage = [];
                if (current > half && current < allpages - half) {
                    for (var i = current - half, j = 0; j < navSize; j++, i++) {
                        navpage.push(i);
                    }
                }
                if (current <= half) {
                    for (var i = 1, j = 0; j < navSize; j++, i++) {
                        navpage.push(i);
                    }
                }
                if (current >= allpages - half) {
                    for (var i = allpages - navSize + 1, j = 0; j < navSize; j++, i++) {
                        navpage.push(i);
                    }
                }
                $scope.navpage = navpage;
            }

            function invoke(page) {
                if (!isFinish) {
                    return false;
                }
                isFinish = false;
                $scope.noFinish = true;
                Post.query({
                    'page': page,
                    'isSafe': LocalSetting.getSetting('isSafe')
                }, function(d) {
                    PageStorage.setCurrentPage(page);
                    if (LocalSetting.getSetting('isRememberPage') === 'true') {
                        LocalSetting.setSetting('localCurrent', page);
                    }
                    $scope.posts = d.images;
                    $scope.current = page;
                    $scope.allpages = d.pages;
                    if (d.success === "false") { //超时提醒。
                        var dialog = ngDialog.open({
                            template: 'timeout',

                        });
                        dialog.closePromise.then(function(data) { //重新请求
                            invoke(PageStorage.getCurrentPage());
                        });
                    }
                    PageStorage.setAllPages(d.pages);
                    creatNavPage();
                    isFinish = true;
                    $scope.noFinish = false;
                });
            }

            function checkNumType(value) { //检测输入数字跳转功能中的值是不是为数字
                if (value === undefined) {
                    if (arguments[1]) {
                        arguments[1].target.blur();
                    }
                    ngDialog.open({ //不是数字提醒
                        template: 'numbererror',
                        className: 'ngdialog-theme-default ngdialog-text'
                    });
                } else {
                    invoke(value);
                }
            }

            $scope.invoke = invoke;
            firstpage = PageStorage.getCurrentPage() || 1;
            invoke(firstpage);
            $scope.next = function() {
                if (PageStorage.getCurrentPage() + 1 <= PageStorage.getAllPages()) {
                    invoke(PageStorage.getCurrentPage() + 1);
                }
            };
            $scope.prev = function() {
                if (PageStorage.getCurrentPage() - 1 > 0) {
                    invoke(PageStorage.getCurrentPage() - 1);
                }
            };
            $scope.jump = function() {
                checkNumType($scope.jumpData);
            };
            $scope.keyjump = function(event) {
                if (event.keyCode === 13) {
                    checkNumType($scope.jumpData, event);
                }
            };
            $scope.previewFun = function(event) { //preview and download function
                if (/^img$/ig.test(event.target.tagName)) {
                    img = event.target.dataset.sample;
                    width = event.target.dataset.width;
                    height = event.target.dataset.height;
                    parentli = event.target.parentNode.parentNode;
                    source = parentli.querySelector('a.download').href;
                    name = parentli.querySelector('a.download').download;
                    ngDialog.open({
                        template: 'preview',
                        scope: $scope,
                        data: {
                            img: img,
                            width: width,
                            height: height,
                            source: source,
                            name: name
                        },
                        className: 'ngdialog-theme-default ngdialog-preview'
                    });
                }
            };
        }
    ]).
    controller("settingCtr", ["$scope", "$rootScope", "$window", "LocalSetting",
        function($scope, $rootScope, $window, LocalSetting) {
            $scope.isSafe = LocalSetting.getSetting('isSafe');
            $scope.isRememberPage = LocalSetting.getSetting('isRememberPage');
            $scope.$watch('isSafe', function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    LocalSetting.setSetting('isSafe', newValue);
                    $scope.$emit("isSafeChange", 'data'); //当isSafe值变化时，触发isSafeChange事件
                }
            });
            $scope.$watch('isRememberPage', function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    LocalSetting.setSetting('isRememberPage', newValue);
                }
            });
        }
    ]);
});