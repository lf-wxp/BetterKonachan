/*
    多文件上传，拖拽，类型判断，图片预览，上传进度，进度条，多种函数回调，功能可配置
*/
function FileUpload(opt) {
    this.fileInput = null; //html file控件
    this.dragDrop = null; //拖拽敏感区域
    this.dragActiveClass = null; //拖拽到敏感区域添加的类名
    this.previewBox = null; //图片预览区域
    this.selectButton = null; //文件选择按钮
    this.upButton = null; //提交按钮
    this.limitSize = 2000; //限制文件上传大小(M)
    this.sliceSize = 2; //断点续传文件切割的大小(M),当上传文件大于这个值，就使用断点上传.只有启用resumeUpload时才有用
    this.resumeUpload = true; //是否启用断点上传
    this.xhrObject = {}; //用于断点续传的xhr对象
    this.url = ''; //ajax地址
    this.fileType = ['rar', 'png', 'jpg', 'gif', 'txt', 'exe', 'mp4']; //上传文件类型
    this.fileFilter = []; //过滤后的文件数组
    this.identity = 1; // 用于标记每个文件与子进度条的唯一识别，自增加的
    this.getOpt(opt); // 获得用户的配置选项
    this.init(); // 初始化
}
FileUpload.prototype = {
    init: function() {
        this.funGetFiles();
        this.funDragHover();
        this.funRegisteUpload();
        this.funDeleteFile();
        this.funPauseResume();
        this.mainBar = document.querySelector('.fileUpload >.processbar');
    },
    getOpt: function(opt) {
        for (var i in opt) {
            if (i in this) {
                this[i] = opt[i];
            }
        }
    },
    getUniqueName: function(str) {
        var newName = '';
        for (var i in str) {
            newName += i.codePointAt(0);
        }
        return newName;
    },
    customFilter: function(file) {
        //选择文件组的过滤方法
        return file;
    },
    onSelect: function() {}, //文件选择后
    onDelete: function() {}, //文件删除后
    onDragEnter: function() {}, //文件进入拖拽到敏感区域时
    onDragOver: function() {}, //文件拖拽到敏感区域时
    onDragLeave: function() {}, //文件离开到敏感区域时
    onProgress: function(prosize) {}, //所有文件上传进度
    onSuccess: function() {}, //单个文件上传成功时
    onFailure: function() {}, //单个文件上传失败时,
    onComplete: function() {}, //单个文件全部上传完毕时
    funSuccessClean: function(identity) {
        //文件上传一次后就清理fileFile数组里的文件
        this.fileFilter = this.fileFilter.filter(function(fileObj) {
            return fileObj.identity !== identity;
        });
    },
    funComputeSize: function(size) {
        var result = size / 1024;
        if (result < 1024) {
            return Math.ceil(result) + 'K';
        } else {
            return Math.ceil(result / 1024) + 'M';
        }
    },
    funExistFileHandle: function(identity) {
        var div = document.querySelector('.preview .file' + identity),
            strong = document.createElement('strong');
        strong.innerHTML = '已存在';
        strong.className = 'exist';
        div.appendChild(strong);
        this.funSuccessClean(identity);
    },
    funNotify: function(message) {
        //一个简单的通知组件
        var notice = document.createElement('div');
        notice.className = 'upload notice';
        notice.innerHTML = message;
        document.body.appendChild(notice);
        var styles = document.defaultView.getComputedStyle(notice, null),
            an = null,
            offset = 2,
            base = parseFloat(styles.marginTop);
        notice.style.marginTop = styles.marginTop;

        function slideDown() {
            var num = parseFloat(notice.style.marginTop);
            if (num >= 0) {
                window.cancelAnimationFrame(an);
                window.setTimeout(slideUp, 2000);
            } else {
                notice.style.marginTop = num + offset + 'px';
                an = window.requestAnimationFrame(slideDown);
            }
        }
        slideDown();

        function slideUp() {
            var num = parseFloat(notice.style.marginTop);
            if (num <= base) {
                window.cancelAnimationFrame(an);
                document.body.removeChild(notice);
            } else {
                notice.style.marginTop = num - offset + 'px';
                an = window.requestAnimationFrame(slideUp);
            }
        }
    },
    funPauseResume: function() {
        //断点续传文件的暂停与恢复
        var that = this;
        this.previewBox.addEventListener(
            'click',
            function(event) {
                var target = event.target;
                if (/resume/.test(target.className)) {
                    var identity = Number(
                            target.parentNode.className.match(/\w+(\d+)/)[1]
                        ),
                        file = that.fileFilter.filter(function(file) {
                            return file.identity === identity;
                        });
                    if (/play/.test(target.className) && file[0]) {
                        if (that.xhrObject['file' + identity]) {
                            that.xhrObject['file' + identity].abort();
                            target.className = 'fa fa-pause resume';
                        }
                    } else {
                        if (file[0]) {
                            that.funSliceUpload(file[0]);
                            target.className = 'fa fa-play resume';
                        }
                    }
                }
            },
            false
        );
    },
    funChangeState: function(state, identity) {
        //每个子进度条的状态，上传成功或失败
        var i = document.querySelector(
                '.preview .file' + identity + ' i:nth-child(1)'
            ),
            that = this;
        if (state.status === 'error') {
            that.onFailure();
            document
                .querySelector('.preview .file' + identity + ' .processbar')
                .classList.add('error');
            i.className = 'fa-warning fa';
            this.mainBar.classList.add('error');
            this.funNotify('文件上传失败 ' + state.reason);
        }
        if (state.status === 'success') {
            that.onSuccess();
            i.className = 'fa-check fa';
            this.funNotify('文件上传完成');
        }
    },
    funSubProgress: function(upload, identity) {
        //每个文件的子进度条
        var that = this;
        upload.addEventListener(
            'progress',
            function(event) {
                var prosize = Math.round(event.loaded * 100 / event.total),
                    span = document.querySelector(
                        '.preview .file' + identity + ' .processbar span'
                    );
                that.subProTotal['file' + identity] = event.total;
                that.subProSize['file' + identity] = event.loaded;
                that.funTotalProgress();
                span.style.width = prosize + '%';
            },
            false
        );
        upload.addEventListener(
            'error',
            function(event) {
                //传输过程中出现错误，而不是服务器处理数据时的错误
                document
                    .querySelector('.preview .file' + identity + ' .processbar')
                    .classList.add('error');
                that.mainBar.classList.add('error');
                console.log('upload error');
            },
            false
        );
    },
    funSubSliceProgress: function(upload, base, total, identity) {
        //每个断点续传文件的子进度条
        var that = this;
        upload.addEventListener(
            'progress',
            function(event) {
                var prosize = Math.round((base + event.loaded) * 100 / total),
                    span = document.querySelector(
                        '.preview .file' + identity + ' .processbar span'
                    );
                that.subProTotal['file' + identity] = total;
                that.subProSize['file' + identity] = base + event.loaded;
                that.funTotalProgress();
                span.style.width = prosize + '%';
            },
            false
        );
        upload.addEventListener(
            'error',
            function(event) {
                //传输过程中出现错误，而不是服务器处理数据时的错误
                document
                    .querySelector('.preview .file' + identity + ' .processbar')
                    .classList.add('error');
                that.mainBar.classList.add('error');
                console.log('upload error');
            },
            false
        );
    },
    funTotalProgress: function() {
        //总进度条
        var total = 0,
            loaded = 0;
        for (var i in this.subProTotal) {
            total += this.subProTotal[i];
        }
        for (var j in this.subProSize) {
            loaded += this.subProSize[j];
        }
        var prosize = Math.round(loaded * 100 / total),
            span = document.querySelector('.fileUpload >.processbar span');
        span.innerHTML = prosize + '%';
        span.style.width = prosize + '%';
        this.onProgress(prosize);
        if (prosize === 100) {
            //当进度为100时，上传完成，并不一定是成功，只能说明是传输没有问题，服务器处理上传的文件算是另外的问题
            // this.funNotify("文件上传完成");
        }
        // } else {
        //     this.funNotify("文件上传失败");
        //     this.mainBar.classList.add('error');
        // }
    },
    funDragHover: function() {
        //拖拽添加文件
        var that = this;
        this.dragDrop.addEventListener(
            'dragenter',
            function(event) {
                event.preventDefault();
                event.stopPropagation();
                that.onDragEnter();
                that.dragDrop.classList.add(that.dragActiveClass);
            },
            false
        );
        this.dragDrop.addEventListener(
            'dragover',
            function(event) {
                event.preventDefault();
                event.stopPropagation();
                that.onDragOver();
            },
            false
        );
        this.dragDrop.addEventListener(
            'dragleave',
            function(event) {
                event.preventDefault();
                event.stopPropagation();
                that.onDragLeave();
                that.dragDrop.classList.remove(that.dragActiveClass);
            },
            false
        );
    },
    funGetFiles: function() {
        //常规文件控件选择文件
        var that = this;
        this.selectButton.addEventListener(
            'click',
            function(event) {
                event.preventDefault();
                that.fileInput.click();
            },
            false
        );
        this.fileInput.addEventListener(
            'change',
            function() {
                that.funDealFiles(this.files);
                that.onSelect();
                this.value = null; //防止选择后删除文件，在选择相同文件无法选择bug
            },
            false
        );
        this.dragDrop.addEventListener(
            'drop',
            function(event) {
                event.preventDefault();
                event.stopPropagation();
                that.funDealFiles(event.dataTransfer.files);
            },
            false
        );
    },
    funDealFiles: function(files) {
        //处理文件，比如类型选择，大小限制
        var that = this;
        [].forEach.call(files, function(file) {
            var type = file.name.match(/.+\.(\w+)$/)[1],
                name = file.name.match(/(.+)\./)[1],
                isAllowType = that.fileType.some(function(value) {
                    return value === type;
                }),
                islimiteSize = file.size / 1024 / 1024 <= that.limitSize;
            file.uniqueName = that.getUniqueName(name) + '.' + type;
            if (!isAllowType && islimiteSize) {
                that.funNotify(file.name + '文件类型不允许');
            }
            if (isAllowType && !islimiteSize) {
                that.funNotify(
                    file.name + '文件大小超过限定值' + that.limitSize + 'M'
                );
            }
            if (!isAllowType && !islimiteSize) {
                that.funNotify(file.name + '文件类型大小都不允许');
            }
            if (isAllowType && islimiteSize) {
                file = {
                    file: that.customFilter(file),
                    identity: that.identity
                };
                that.fileFilter.push(file);
                that.funPreviewFiles(file);
                that.identity++;
            }
        });
    },
    funPreviewFiles: function(fileObj) {
        //预览文件，支持图片和文本
        var file = fileObj.file,
            that = this,
            reader = new FileReader(),
            div = document.createElement('div'),
            name = document.createElement('span'),
            subprocess = document.createElement('p'),
            subbar = document.createElement('span'),
            remove = document.createElement('i'),
            type = file.name.match(/.+\.(\w+)$/)[1],
            pContain = document.createElement('p'),
            showType = document.createElement('span'),
            showSize = document.createElement('span');
        showType.innerHTML = 'Type:' + type;
        showSize.innerHTML = 'Size:' + this.funComputeSize(file.size);
        pContain.appendChild(showType);
        pContain.appendChild(showSize);
        remove.className = 'fa fa-remove';
        div.className = 'file' + fileObj.identity;
        subprocess.className = 'processbar process1 tiny';
        subprocess.appendChild(subbar);
        div.appendChild(remove);
        div.appendChild(subprocess);
        name.innerHTML = file.name;
        name.className = 'name';
        if (/image/.test(file.type)) {
            reader.readAsDataURL(file);
            reader.onload = function(event) {
                var img = document.createElement('img');
                img.src = this.result;
                div.appendChild(img);
                div.appendChild(name);
                that.previewBox.appendChild(div);
            };
        } else if (/text/.test(file.type)) {
            reader.readAsText(file);
            reader.onload = function(event) {
                var span = document.createElement('span');
                span.className = 'text';
                span.innerHTML = this.result.slice(0, 170);
                div.appendChild(span);
                div.appendChild(name);
                that.previewBox.appendChild(div);
            };
        } else {
            var i = document.createElement('i');
            i.className = 'fa fa-file';
            div.appendChild(i);
            div.appendChild(name);
            that.previewBox.appendChild(div);
        }
        if (this.resumeUpload && file.size > this.sliceSize * 1024 * 1024) {
            var resume = document.createElement('i');
            resume.className = 'fa fa-play resume';
            div.appendChild(resume);
        }
        div.appendChild(pContain);
    },
    funDeleteFile: function() {
        //删除文件
        var that = this;
        this.previewBox.addEventListener(
            'click',
            function(event) {
                var target = event.target;
                if (/remove/.test(target.className)) {
                    var identity = Number(
                        target.parentNode.className.match(/\w+(\d+)/)[1]
                    );
                    this.removeChild(target.parentNode);
                    that.onDelete();
                    that.fileFilter = that.fileFilter.filter(function(file) {
                        return file.identity !== identity;
                    });
                }
            },
            false
        );
    },
    funRegisteUpload: function() {
        //注册上传事件及其上传前的文件处理
        var that = this;
        this.upButton.addEventListener(
            'click',
            function(event) {
                event.preventDefault();
                if (that.fileFilter.length) {
                    that.mainBar.classList.remove('error');
                    that.subProTotal = {};
                    that.subProSize = {};
                    that.fileFilter.forEach(function(fileObj) {
                        that.subProTotal['file' + fileObj.identity] = '';
                        that.subProSize['file' + fileObj.identity] = '';
                        that.funUploadFile(fileObj);
                    });
                }
            },
            false
        );
    },
    funUploadFile: function(fileObj) {
        //文件上传
        var file = fileObj.file;
        if (this.resumeUpload && file.size > this.sliceSize * 1024 * 1024) {
            this.funSliceUpload(fileObj);
        } else {
            this.funSingleUpload(fileObj);
        }
    },
    funSingleUpload: function(fileObj) {
        //非断点文件上传
        var that = this,
            file = fileObj.file,
            identity = fileObj.identity,
            xhr = new XMLHttpRequest(),
            fileData = new FormData();
        xhr.open('POST', this.url, true);
        xhr.addEventListener(
            'readystatechange',
            function(event) {
                if (xhr.readyState === 4) {
                    that.onComplete();
                    if (xhr.status === 200) {
                        var responseJson = JSON.parse(xhr.responseText);
                        that.funChangeState(responseJson, fileObj.identity);
                        that.funSuccessClean(identity);
                    }
                }
            },
            false
        );
        that.funSubProgress(xhr.upload, identity);
        fileData.append('file', file);
        xhr.send(fileData);
    },
    funSliceUpload: function(fileObj) {
        //断点文件的上传
        var that = this,
            file = fileObj.file,
            identity = fileObj.identity;

        function getFileInfo() {
            //先从服务器获得文件的信息，再生成分片文件的大小
            var xhr = new XMLHttpRequest();
            that.xhrObject['file' + identity] = xhr;
            xhr.open(
                'GET',
                that.url + '?name=' + file.uniqueName + '&size=' + file.size,
                true
            );
            xhr.addEventListener(
                'readystatechange',
                function(event) {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        var responseJson = JSON.parse(xhr.responseText);
                        if (responseJson.reason === 'exists') {
                            that.funExistFileHandle(identity);
                        } else {
                            uploadSlice(responseJson.size);
                        }
                    }
                },
                false
            );
            xhr.send(null);
        }

        function uploadSlice(uploadedSize) {
            //上传分片的文件，根据之前返回的已存在服务器文件的大小，创建分片
            var uploadedSize = Number(uploadedSize),
                newslice = file.slice(
                    uploadedSize,
                    uploadedSize + that.sliceSize * 1024 * 1024
                );
            if (newslice.size) {
                var xhr = new XMLHttpRequest();
                that.xhrObject['file' + identity] = xhr;
                xhr.open('POST', that.url, true);
                xhr.setRequestHeader('upload_resume', 'True');
                xhr.setRequestHeader('upload_name', encodeURI(file.uniqueName));
                xhr.setRequestHeader('upload_totalsize', file.size);
                xhr.addEventListener(
                    'readystatechange',
                    function(event) {
                        if (xhr.readyState === 4 && xhr.status === 200) {
                            var responseJson = JSON.parse(xhr.responseText);
                            if (responseJson.status !== 'success') {
                                getFileInfo();
                            } else {
                                that.funChangeState(responseJson, identity);
                                that.funSuccessClean(identity);
                            }
                        }
                    },
                    false
                );
                that.funSubSliceProgress(
                    xhr.upload,
                    uploadedSize,
                    file.size,
                    identity
                );
                xhr.send(newslice);
            }
        }
        getFileInfo();
    }
};
