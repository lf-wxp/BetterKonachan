define(['app', 'services', 'ngDialog', 'angular-ui-router'], function(app) {
    app.
    controller('indexCtr', ['$scope', '$window', 'ngDialog', 'Post', 'PageStorage', 'LocalSetting',
        function($scope, $window, ngDialog, Post, PageStorage, LocalSetting) {
            var navSize = 5;
            var isFinish = true;
            $scope.noFinish = true;
            $scope.isSafe = LocalSetting.getSetting('isSafe') || false;

            if (LocalSetting.getSetting('support') == 'false') { // 弹出检测download属性
                ngDialog.open({
                    template: 'notify'
                });
            }

            $scope.$watch('isSafe', function(newValue, oldValue) {
                LocalSetting.setSetting('isSafe', newValue);
                invoke(PageStorage.getCurrentPage());
            });

            function creatNavPage() {
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
                    $scope.posts = d.images;
                    $scope.current = page;
                    $scope.allpages = d.pages;
                    if (d.success == "false") { //超时提醒。
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

            function checkNumType(value) {
                if (value == undefined) {
                    if (arguments[1]){
                        arguments[1].target.blur();
                    }
                    ngDialog.open({
                        template: 'numbererror'
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
                if (event.keyCode == 13) {
                    checkNumType($scope.jumpData,event);
                }
            };
        }
    ]);
});