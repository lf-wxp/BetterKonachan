define(['app', 'services', 'ngDialog', 'angular-ui-router'], function(app) {
    app.
    controller('indexCtr', ['$scope', '$window', 'ngDialog', 'Post', 'PageStorage',
        function($scope, $window, ngDialog, Post, PageStorage) {
            var navSize = 5;
            var isFinish = true;
            $scope.noFinish = true;

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
                    'page': page
                }, function(d) {
                    PageStorage.setCurrentPage(page);
                    $scope.posts = d.images;
                    $scope.current = page;
                    $scope.allpages = d.pages;
                    PageStorage.setAllPages(d.pages);
                    creatNavPage();
                    isFinish = true;
                    $scope.noFinish = false;
                });
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
                invoke($scope.jumpData);
            };
        }
    ]);
});