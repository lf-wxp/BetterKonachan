define(['app', 'canvasBg', 'services'], function(app, canvasBg) {
    app.
    controller('viewCtr', ['$scope', '$window', 'ngDialog', 'Post', 'PageStorage', 'LocalSetting',
        function($scope, $window, ngDialog, Post, PageStorage, LocalSetting) {
            var navSize = 5,
                isFinish = true, //是否请求完成，避免多次请求数据。
                historyArray = []; //配合window.history来增加浏览记录支持
            $scope.noFinish = true; //前端进度条显示判断的依据
            $scope.isSafe = LocalSetting.getSetting('isSafe');
            $scope.current = PageStorage.getCurrentPage();
            historyArray.push($scope.current);

            function pushState(page) {
                var state = {
                    "page": page
                };

                $window.history.pushState(state, "", "");
            }

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

            function invoke(page) { //获取具体哪一页
                if (!isFinish) {
                    return false;
                }
                isFinish = false;
                $scope.noFinish = true;
                Post.query({
                    'page': page,
                    'tags': $scope.tags,
                    'isSafe': $scope.isSafe
                }, function(d) {
                    PageStorage.setCurrentPage(page);
                    if (LocalSetting.getSetting('isRememberPage') === 'true') {
                        LocalSetting.setSetting('localCurrent', page);
                    }
                    if ($scope.current != page && historyArray.indexOf(page) == -1) { //当请求和当前页数相同时，不添加记录到历史记录里面
                        pushState(page);
                        historyArray.push(page);
                    }
                    $scope.posts = d.images;
                    $scope.current = page;
                    $scope.allpages = d.pages;

                    if (d.success === "false" && d.timeOut) { //超时提醒。
                        var dialog = ngDialog.open({
                            template: 'timeout'
                        });
                        dialog.closePromise.then(function(data) { //重新请求
                            invoke(PageStorage.getCurrentPage());
                        });
                    }
                    if (d.success === "false" && d.noResult) {
                        var noResult = ngDialog.open({
                            template: 'noResult'
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

            $window.addEventListener('popstate', function(event) {
                var state = event.state;
                if (state && state.page) {
                    invoke(state.page)
                }
            });

            if (LocalSetting.getSetting('support') === 'false') { // 弹出检测download属性
                ngDialog.open({
                    template: 'notify',
                    className: 'ngdialog-theme-default ngdialog-text'
                });
            }

            $scope.$on('isSafeChange', function(event, args) { //监听isSafeChange事件
                $scope.isSafe = args.isSafe;
                invoke(PageStorage.getCurrentPage());
            });

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
            $scope.jumpAction = function() {
                checkNumType($scope.jumpData);
            };
            $scope.keyjump = function(event) {
                if (event.keyCode === 13) {
                    checkNumType($scope.jumpData, event);
                }
            };
            $scope.previewFun = function(event) { //preview and download function
                if (/^span$/ig.test(event.target.tagName)) {
                    imgDom = event.target.querySelector('img');
                    img = imgDom.dataset.sample;
                    width = imgDom.dataset.width;
                    height = imgDom.dataset.height;
                    parentli = event.target.parentNode;
                    source = parentli.querySelector('a.btn3e').href;
                    name = parentli.querySelector('a.btn3e').download;
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
            $scope.$on('searchEvent', function(evnet, args) {
                $scope.tags = args.tags;
                invoke(1);
            })
            $scope.$on('searchTagsChangeEvent', function(event, args) {
                $scope.tags = args.tags;
            })

        }
    ]).
    controller("setCtr", ["$scope", "$rootScope", "$window", "LocalSetting", '$translate',
        function($scope, $rootScope, $window, LocalSetting, $translate) {
            $scope.isSafe = LocalSetting.getSetting('isSafe');
            $scope.isRememberPage = LocalSetting.getSetting('isRememberPage');
            $scope.$watch('isSafe', function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    $rootScope.$broadcast('isSafeChange', {
                        isSafe: newValue
                    });
                    LocalSetting.setSetting('isSafe', newValue);
                }
            });
            $scope.$watch('isRememberPage', function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    LocalSetting.setSetting('isRememberPage', newValue);
                }
            });
            /* change the language */
            function setLang(lang) {
                if (lang == 'en') {
                    $translate.use('en');
                    $scope.en = true;
                    $scope.zh = false;
                }
                if (lang == 'zh') {
                    $translate.use('zh');
                    $scope.zh = true;
                    $scope.en = false;
                }
            }
            var lang;
            if (LocalSetting.getSetting('language')) {
                lang = LocalSetting.getSetting('language');
            } else {
                lang = 'zh';
            }
            setLang(lang);
            $scope.language = function(lang) {
                setLang(lang);
                LocalSetting.setSetting('language', lang);
            }
        }
    ]).
    controller("searchCtr", ['$scope', '$rootScope',
        function($scope, $rootScope) {
            $scope.searchFun = function() {
                $rootScope.$broadcast("searchEvent", {
                    tags: $scope.tags
                })
            }
            $scope.$watch('tags', function(newValue, oldValue) {
                $rootScope.$broadcast("searchTagsChangeEvent", {
                    tags: newValue
                })
            })
        }
    ]).
    controller("headCtr", ['$scope', '$rootScope', '$window', 'LocalSetting', 'GetOneBg',
        function($scope, $rootScope, $window, LocalSetting, GetOneBg) {

            if (LocalSetting.getSetting('cover')) { //header 和footer 的backgroundImg 设置
                setBgImg(LocalSetting.getSetting('cover'))
            } else {
                setBgImg('../images/bg.jpg');
            }

            function canvasParentSizeChange(selector, place) { //判断canvas的父元素窗口大小是否发生改变
                var canvasParent = document.querySelector(selector),
                    nowWith = canvasParent.clientWidth,
                    nowHeight = canvasParent.clientHeight,
                    width = "headerWidth",
                    height = "headerHeight";
                if ($rootScope[width] == undefined && $rootScope[height] == undefined) {
                    $rootScope[width] = nowWith;
                    $rootScope[height] = nowHeight;
                    return true;
                } else if ($rootScope[width] == nowWith && $rootScope[height] == nowHeight) {
                    return false;
                } else {
                    $rootScope[width] = nowWith;
                    $rootScope[height] = nowHeight;
                    return true;
                }
            }

            function renderHeaderCanvasBg() {
                var can = new canvasBg('body header canvas');
                can.renderAnimate('pathCloseFill', "transparent", can.getShape('doubleHexagon', {
                    w: 20
                }));
            }

            function setBgImg(url) {
                var covers = document.querySelectorAll('.cover'),
                    blur = document.querySelector('.blur');
                [].forEach.call(covers, function(elem) {
                    elem.style.backgroundImage = "url(" + url + ")";
                })
                blur.src = url;
            }

            function renderCover() { //远程获取一张图片当作header和footer的背景，并存入localstorage中
                GetOneBg.get().then(function(data) {
                    setBgImg(data);
                    LocalSetting.setSetting('cover', data);
                })
            }
            if ($window.sessionStorage['isMobile'] !== "true") {
                var w = angular.element($window);
                var handler;
                w.bind('resize', function() { //当窗口resize时，重新绘制背景
                    if (handler) {
                        clearTimeout(handler);
                    }
                    handler = setTimeout(function() {
                        var isHeaderChange = canvasParentSizeChange('body>header', 'header');
                        if (isHeaderChange) {
                            renderHeaderCanvasBg();
                        }
                    }, 500);
                });
                renderHeaderCanvasBg();
            }
            setTimeout(renderCover, 5000); //放入记时器中，异步执行。
        }
    ])
});