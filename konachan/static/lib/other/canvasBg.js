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
        this.getAnimateRandomRects = this.getRects;
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
            // this.canvas.style.zIndex = "-1";
            this.diagonal = Math.floor(Math.sqrt(this.canW * this.canW + this.canH * this.canH));

        },
        getXandY: function(line) {
            var x = this.canW * line / this.diagonal;
            var y = this.canH * line / this.diagonal;
            return {
                x: x,
                y: y
            };
        },
        getShape: function(shape, dotData) {
            var shapeData = [],
                sx = 0,
                sy = 0;
            switch (shape) {
                case "rect": //dotData {w:w,h:h} x stands for  the width,h stands for the height
                    while (sy * dotData.h < this.canH) {
                        sx = 0;
                        while (sx * dotData.w < this.canW) {
                            shapeData.push([sx * dotData.w, sy * dotData.h, dotData.w, dotData.h]);
                            sx++;
                        }
                        sy++;
                    }
                    return shapeData;
                    break;
                case "doubleRect": //dotData {w:w,h:h,sw:sw,sh:sh} x stands for  width of the outer rect ,h stands for height of the outer rect,sw and sh mean width and height of the inner rect
                    var offsetw = (dotData.w - dotData.sw) / 2,
                        offseth = (dotData.h - dotData.sh) / 2;
                    while (sy * dotData.h < this.canH) {
                        sx = 0;
                        while (sx * dotData.w < this.canW) {
                            shapeData.push([sx * dotData.w, sy * dotData.h, dotData.w, dotData.h]);
                            shapeData.push([sx * dotData.w + offsetw, sy * dotData.h + offseth, dotData.sw, dotData.sh]);
                            sx++;
                        }
                        sy++;
                    }
                    return shapeData;
                    break;
                case "hexagon": //dotData {w:w} w stands for long of the line of the hexagon
                    var h = Math.sin(Math.PI / 180 * 60) * dotData.w;
                    while (sy * 2 * h < this.canH) {
                        sx = 0;
                        var offsetnum = 0;
                        while (3 / 2 * dotData.w * sx < this.canW) {
                            var points = [];
                            if ((sx + 1) % 2 === 0) {
                                var offsety = 2 * h * sy - h;
                            } else {
                                var offsety = 2 * h * sy;
                            }
                            var offsetx = 3 / 2 * dotData.w * sx;
                            var origin = [offsetx, offsety + h];
                            points[0] = origin;
                            points[1] = [origin[0] + dotData.w / 2, origin[1] - h];
                            points[2] = [origin[0] + dotData.w / 2 + dotData.w, origin[1] - h];
                            points[3] = [origin[0] + 2 * dotData.w, origin[1]];
                            points[4] = [origin[0] + dotData.w / 2 + dotData.w, origin[1] + h];
                            points[5] = [origin[0] + dotData.w / 2, origin[1] + h];
                            shapeData.push(points);
                            sx++;
                        }
                        sy++;
                    }
                    return shapeData;
                    break;
                case "string": //dotData {w:w} w stands for width of the line of the string
                    var offsety = 100;
                    while (sy * dotData.w < this.canH) {
                        var path = [],
                            origin = [0, sy * dotData.w];
                        path[0] = origin;
                        path[1] = [origin[0] + this.canW / 4, sy * dotData.w + offsety];
                        path[2] = [origin[0] + this.canW / 4 * 3, sy * dotData.w + offsety];
                        path[3] = [this.canW, sy * dotData.w];
                        shapeData.push(path);
                        sy++;
                    }
                    return shapeData;
                    break;
            }
        },
        renderAnimateRandomFillStroke: function(shape, baseColor, graphy, lineWidth) {
            //lineWidth only for 'path' case and 'double' case
            var color = ['#ddd', '#222'];
            this.ctx.fillStyle = baseColor;
            this.ctx.lineCap = "round";
            this.ctx.lineJoin = "round";
            this.ctx.fillRect(0, 0, this.canW, this.canH);
            // this.ctx.globalAlpha = Math.random() * 0.1;
            var ctx = this.ctx,
                canW = this.canW,
                canH = this.canH,
                offset = 0,
                animate;

            function renderRandom() {
                var num = Math.floor(Math.random() * graphy.length);
                var dot = graphy[num];
                ctx.globalAlpha = Math.random() * 0.1;
                graphy.splice(num, 1);
                switch (shape) {
                    case "line":
                        ctx.beginPath();
                        ctx.fillStyle = color[Math.round(Math.random())];
                        ctx.strokeStyle = "#000";
                        ctx.globalAlpha = Math.random() * 0.1;
                        ctx.moveTo(dot[0][0], dot[0][1]);
                        for (var j = 1; j < dot.length; j++) {
                            ctx.lineTo(dot[j][0], dot[j][1]);
                        }
                        ctx.closePath();
                        ctx.stroke();
                        ctx.fill();
                        break;
                    case "rect":
                        ctx.fillStyle = color[Math.round(Math.random())];
                        ctx.globalAlpha = Math.random() * 0.1;
                        ctx.fillRect(dot[0], dot[1], dot[2], dot[3]);
                        ctx.strokStyle = "#000";
                        ctx.globalAlpha = 0.02;
                        ctx.strokeRect(dot[0], dot[1], dot[2], dot[3]);
                        break;
                    case "path":
                        ctx.lineWidth = lineWidth;
                        ctx.beginPath();
                        ctx.strokeStyle = color[Math.round(Math.random())];
                        ctx.moveTo(dot[0][0], dot[0][1]);
                        ctx.bezierCurveTo(dot[1][0], dot[1][1], dot[2][0], dot[2][1], dot[3][0], dot[3][1]);
                        ctx.stroke();
                    case "double":
                        ctx.lineWidth = lineWidth;
                        ctx.strokeStyle = color[Math.round(Math.random())];
                        ctx.strokeRect(dot[0], dot[1], dot[2], dot[3]);

                }

                if (graphy.length == 0) {
                    window.cancelAnimFrame(animate);
                } else {
                    animate = window.requestAnimFrame(function() {
                        renderRandom();
                        offset++;
                    });
                }

            }
            renderRandom();
        }
    };
    return canvasBg;
});