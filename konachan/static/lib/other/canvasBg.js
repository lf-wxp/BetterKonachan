define([''], function($) {
    window.requestAnimFrame = function() {
        return (
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function( /* function */ callback) {
                window.setTimeout(callback, 1000 / 60);
            }
        );
    }();

    window.cancelAnimFrame = function() {
        return (
            window.cancelAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            window.mozCancelAnimationFrame ||
            window.oCancelAnimationFrame ||
            window.msCancelAnimationFrame ||
            function(id) {
                window.clearTimeout(id);
            }
        );
    }();

    function canvasBg(select) {
        this.canvas = document.querySelector(select);
        this.ctx = this.canvas.getContext('2d');
        this.init();

    }
    canvasBg.prototype = {
        init: function() {
            this.canW = this.canvas.parentNode.clientWidth;
            this.canH = this.canvas.parentNode.clientHeight;
            this.canvas.width = this.canW;
            this.canvas.height = this.canH;
            this.canvas.style.position = 'absolute';
            this.canvas.style.top = "0px";
            this.canvas.style.left = "0px";
            this.canvas.style.zIndex = "-1";
            this.diagonal =Math.floor(Math.sqrt(this.canW*this.canW+this.canH*this.canH));

        },
        getXandY:function(line){
            var x = this.canW*line/this.diagonal;
            var y = this.canH*line/this.diagonal;
            return {x:x,y:y}
        },
        getRects: function(w, h) {
            var rects = [];
            var sx = 0,
                sy = 0;
            while (sy * h < this.canH) {
                sx = 0;
                while (sx * w < this.canW) {
                    rects.push([sx * w, sy * h, w, h])
                    sx++;
                }
                sy++;
            }
            return rects;
        },
        getBoubleRects: function(w, h, sw, sh) {
            var rects = [];
            var sx = 0,
                sy = 0,
                offsetw = (w - sw) / 2,
                offseth = (h - sh) / 2;
            while (sy * h < this.canH) {
                sx = 0;
                while (sx * w < this.canW) {
                    rects.push([sx * w, sy * h, w, h]);
                    rects.push([sx * w + offsetw, sy * h + offseth, sw, sh]);
                    sx++;
                }
                sy++;
            }
            return rects;
        },
        getHexagon: function(w) {
            /*w为六边形的单边长*/
            var hexagons = [];
            var sx = 0,
                sy = 0;
            var h = Math.sin(Math.PI / 180 * 60) * w;
            while (sy * 2 * h < this.canH) {
                sx = 0;
                var offsetnum = 0;
                while (3 / 2 * w * sx < this.canW) {
                    var points = [];
                    if ((sx + 1) % 2 == 0) {
                        var offsety = 2 * h * sy - h;
                    } else {
                        var offsety = 2 * h * sy;
                    }
                    var offsetx = 3 / 2 * w * sx;
                    var origin = [offsetx, offsety + h];
                    points[0] = origin;
                    points[1] = [origin[0] + w / 2, origin[1] - h];
                    points[2] = [origin[0] + w / 2 + w, origin[1] - h];
                    points[3] = [origin[0] + 2 * w, origin[1]];
                    points[4] = [origin[0] + w / 2 + w, origin[1] + h];
                    points[5] = [origin[0] + w / 2, origin[1] + h];
                    hexagons.push(points);
                    sx++;
                }
                sy++;
            }
            return hexagons;
        },
        getString: function(w) {
            /*w is the width of the string*/
            var strings = [];
            var sy = 0;
            var offsety = 100;
            while (sy * w < this.canH) {
                var path = [],
                    origin = [0, sy * w];
                path[0] = origin;
                path[1] = [origin[0] + this.canW / 4, sy * w + offsety];
                path[2] = [origin[0] + this.canW / 4 * 3, sy * w + offsety];
                path[3] = [this.canW, sy * w];
                strings.push(path);
                sy++;
            }
            return strings;
        },
        animate: function(fun) {
            this[fun.name] = window.requestAnimFrame(fun);
        },
        renderStrokeCircle: function(lineWidth, baseColor) {
            this.ctx.fillStyle = baseColor;
            this.ctx.lineCap = "round";
            this.ctx.lineJoin = "round";
            this.ctx.fillRect(0, 0, this.canW, this.canH);
            this.ctx.lineWidth = lineWidth;
            var color = ['#ddd', '#dcdcdc'];
            for (var i = 0; i < 10; i++) {
                this.ctx.strokeStyle = color[Math.round(Math.random())];
                this.ctx.globalAlpha = Math.random() * 0.1;
                this.ctx.beginPath();
                this.ctx.arc(Math.random() * this.canW, Math.random() * this.canH, Math.random() * 100 + 100, 0, Math.PI * 2, true);
                this.ctx.closePath();
                this.ctx.stroke();
            };
        },
        renderDoubleStrokeRect: function(lineWidth, baseColor, graphy) {
            var color = ['#ddd', '#222'];
            this.ctx.fillStyle = baseColor;
            this.ctx.fillRect(0, 0, this.canW, this.canH);
            this.ctx.lineWidth = lineWidth;
            for (var i = 0; i < graphy.length; i++) {
                this.ctx.strokeStyle = color[Math.round(Math.random())];
                this.ctx.globalAlpha = Math.random() * 0.1;
                this.ctx.strokeRect(graphy[i][0], graphy[i][1], graphy[i][2], graphy[i][3]);
            };

        },
        renderFillStrokeRect: function(baseColor, graphy) {
            var color = ['#ddd', '#222'];
            // var color = ['#B10DC9', '#001f3f'];
            this.ctx.fillStyle = baseColor;
            this.ctx.lineCap = "round";
            this.ctx.lineJoin = "round";
            this.ctx.fillRect(0, 0, this.canW, this.canH);
            for (var i = 0; i < graphy.length; i++) {
                this.ctx.fillStyle = color[Math.round(Math.random()*color.length)];
                this.ctx.globalAlpha = Math.random() * 0.1;
                this.ctx.fillRect(graphy[i][0], graphy[i][1], graphy[i][2], graphy[i][3]);
                this.ctx.strokStyle = "#000";
                this.ctx.globalAlpha = 0.02;
                this.ctx.strokeRect(graphy[i][0], graphy[i][1], graphy[i][2], graphy[i][3]);
            };

        },
        renderFillStrokeLine: function(baseColor, graphy) {
            var color = ['#ddd', '#222'];
            this.ctx.fillStyle = baseColor;
            this.ctx.lineCap = "round";
            this.ctx.lineJoin = "round";
            this.ctx.fillRect(0, 0, this.canW, this.canH);
            this.ctx.globalAlpha = Math.random() * 0.1;
            for (var i = 0; i < graphy.length; i++) {
                this.ctx.beginPath();
                this.ctx.fillStyle = color[Math.round(Math.random())];
                this.ctx.strokeStyle = "#000";
                this.ctx.globalAlpha = Math.random() * 0.1;
                this.ctx.moveTo(graphy[i][0][0], graphy[i][0][1]);
                for (var j = 1; j < graphy[i].length; j++) {
                    this.ctx.lineTo(graphy[i][j][0], graphy[i][j][1]);
                };
                this.ctx.closePath();
                this.ctx.stroke();
                this.ctx.fill();
            };
        },
        renderStringPath: function(lineWidth, baseColor, graphy) {
            var color = ['#ddd', '#222'];
            this.ctx.fillStyle = baseColor;
            this.ctx.lineCap = "round";
            this.ctx.lineJoin = "round";
            this.ctx.fillRect(0, 0, this.canW, this.canH);
            this.ctx.lineWidth = lineWidth;
            this.ctx.globalAlpha = Math.random() * 0.1;
            for (var i = 0; i < graphy.length; i++) {
                this.ctx.beginPath();
                this.ctx.strokeStyle = color[Math.round(Math.random())];
                this.ctx.moveTo(graphy[i][0][0], graphy[i][0][1]);
                this.ctx.bezierCurveTo(graphy[i][1][0], graphy[i][1][1], graphy[i][2][0], graphy[i][2][1], graphy[i][3][0], graphy[i][3][1]);
                this.ctx.stroke();
            };
        }
    }
    return canvasBg;
})