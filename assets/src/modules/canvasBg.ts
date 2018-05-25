define([''], function() {
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
        this.canvas = select instanceof HTMLElement ? select : document.querySelector(select);
        this.ctx = this.canvas.getContext('2d');
        this.getAnimateRandomRects = this.getRects;
        this.renders = [{
            'shape': ['string'],
            'method': ['pathOpen']
        }, {
            'shape': ['rect', 'doubleRect'],
            'method': ['rectFill', 'rectStroke', 'rectAll']
        }, {
            'shape': ['arrow', 'doubleArrow', 'doubleHexagon', 'hexagon', 'triangle', 'doubleTriangle', 'diamond', 'doubleDiamond'],
            'method': ['pathCloseAll', 'pathCloseStroke', 'pathCloseFill']
        }, {
            'shape': ['circle', 'doubleCircle'],
            'method': ['circleAll', 'circleFill', 'circleStroke']
        }]
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
            this.canvas.style.zIndex = '1';
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
        bulidHexagon: function(w, h, offsetx, offsety) {
            var points = [],
                origin = [offsetx, offsety + h];
            points[0] = origin;
            points[1] = [origin[0] + w / 2, origin[1] - h];
            points[2] = [origin[0] + w / 2 + w, origin[1] - h];
            points[3] = [origin[0] + 2 * w, origin[1]];
            points[4] = [origin[0] + w / 2 + w, origin[1] + h];
            points[5] = [origin[0] + w / 2, origin[1] + h];
            return points;
        },
        bulidDiamond: function(w, h, offsetx, offsety) {
            var points = [],
                origin = [offsetx, offsety + h];
            points[0] = origin;
            points[1] = [origin[0] + h, origin[1] - h];
            points[2] = [origin[0] + 2 * h, origin[1]];
            points[3] = [origin[0] + h, origin[1] + h];
            return points;
        },
        bulidArrow: function(w, h, offsetx, offsety) {
            var points = [],
                origin = [offsetx, offsety];
            points[0] = origin;
            points[1] = [origin[0] + h, origin[1] + w / 2];
            points[2] = [origin[0] + 2 * h, origin[1]];
            points[3] = [origin[0] + 2 * h, origin[1] + w];
            points[4] = [origin[0] + h, origin[1] + w + w / 2];
            points[5] = [origin[0], origin[1] + w];
            return points;
        },
        getShape: function(shape, dotData) {
            var shapeData = [],
                sx = 0,
                sy = 0;
            switch (shape) {
                case "arrow": //dotData {w:w} w stands for  the length of the arrow
                    var h = Math.sin(Math.PI / 180 * 60) * dotData.w;
                    while (sy * dotData.w < this.canH) {
                        sx = 0;
                        while (sx * 2 * h < this.canW) {
                            var offsetx = sx * 2 * h,
                                offsety = sy * dotData.w;
                            shapeData.push(this.bulidArrow(dotData.w, h, offsetx, offsety));
                            sx++;
                        }
                        sy++;
                    }
                    return shapeData;
                    break;
                case "doubleArrow":
                    var h = Math.sin(Math.PI / 180 * 60) * dotData.w,
                        ofx = Math.tan(Math.PI / 180 * 30) * dotData.w / 2,
                        ofy = dotData.w / 2,
                        newW = ofx / Math.sin(Math.PI / 180 * 60) * 2,
                        newH = Math.sin(Math.PI / 180 * 60) * newW;
                    while (sy * dotData.w < this.canH) {
                        sx = 0;
                        while (sx * 2 * h < this.canW) {
                            var offsetx = sx * 2 * h,
                                offsety = sy * dotData.w;
                            shapeData.push(this.bulidArrow(dotData.w, h, offsetx, offsety));
                            shapeData.push(this.bulidArrow(newW, newH, offsetx + ofx, offsety + ofy));
                            sx++;
                        }
                        sy++;
                    }
                    return shapeData;
                    break;
                case "circle": //dotData {w:w} r stands for  the arc of the circle
                    while (sy * dotData.w < this.canH) {
                        sx = 0;
                        while (sx * dotData.w < this.canW) {
                            shapeData.push([sx * dotData.w * 2, sy * dotData.w * 2, dotData.w]);
                            sx++;
                        }
                        sy++;
                    }
                    return shapeData;
                    break;
                case "doubleCircle":
                    while (sy * dotData.w < this.canH) {
                        sx = 0;
                        while (sx * dotData.w < this.canW) {
                            shapeData.push([sx * dotData.w * 2, sy * dotData.w * 2, dotData.w]);
                            shapeData.push([sx * dotData.w * 2, sy * dotData.w * 2, dotData.w / 2]);
                            sx++;
                        }
                        sy++;
                    }
                    return shapeData;
                    break;
                case "rect": //dotData {w:w,h:h} x stands for  the width,h stands for the height
                    while (sy * dotData.w < this.canH) {
                        sx = 0;
                        while (sx * dotData.w < this.canW) {
                            shapeData.push([sx * dotData.w, sy * dotData.w, dotData.w, dotData.w]);
                            sx++;
                        }
                        sy++;
                    }
                    return shapeData;
                    break;
                case "doubleRect": //dotData {w:w,h:h,sw:sw,sh:sh} x stands for  width of the outer rect ,h stands for height of the outer rect,sw and sh mean width and height of the inner rect
                    var offsetw = (dotData.w - dotData.w / 2) / 2;
                    while (sy * dotData.w < this.canH) {
                        sx = 0;
                        while (sx * dotData.w < this.canW) {
                            shapeData.push([sx * dotData.w, sy * dotData.w, dotData.w, dotData.w]);
                            shapeData.push([sx * dotData.w + offsetw, sy * dotData.w + offsetw, dotData.w / 2, dotData.w / 2]);
                            sx++;
                        }
                        sy++;
                    }
                    return shapeData;
                    break;
                case "doubleHexagon":
                    var h = Math.sin(Math.PI / 180 * 60) * dotData.w;
                    while (sy * 2 * h < this.canH) {
                        sx = 0;
                        while (3 / 2 * dotData.w * sx < this.canW) {
                            var points = [];
                            if ((sx + 1) % 2 === 0) {
                                var offsety = 2 * h * sy - h;
                            } else {
                                var offsety = 2 * h * sy;
                            }
                            var offsetx = 3 / 2 * dotData.w * sx;
                            shapeData.push(this.bulidHexagon(dotData.w, h, offsetx, offsety));
                            shapeData.push(this.bulidHexagon(dotData.w / 2, h / 2, offsetx + dotData.w / 2, offsety + h / 2));
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
                        while (3 / 2 * dotData.w * sx < this.canW) {
                            var points = [];
                            if ((sx + 1) % 2 === 0) {
                                var offsety = 2 * h * sy - h;
                            } else {
                                var offsety = 2 * h * sy;
                            }
                            var offsetx = 3 / 2 * dotData.w * sx;
                            shapeData.push(this.bulidHexagon(dotData.w, h, offsetx, offsety));
                            sx++;
                        }
                        sy++;
                    }
                    return shapeData;
                    break;
                case "string": //dotData {w:w} w stands for width of the line of the string
                    var offsety = 400;
                    while (sy * dotData.w < this.canH) {
                        var path = [],
                            path1 = [],
                            origin = [0, sy * dotData.w];
                        path[0] = origin;
                        path[1] = [origin[0] + this.canW / 6, sy * dotData.w + offsety];
                        path[2] = [origin[0] + this.canW / 6 * 2, sy * dotData.w - offsety];
                        path[3] = [origin[0] + this.canW / 6 * 3, sy * dotData.w];
                        path1[0] = [origin[0] + this.canW / 6 * 4, sy * dotData.w + offsety];
                        path1[1] = [origin[0] + this.canW / 6 * 5, sy * dotData.w - offsety];
                        path1[2] = [origin[0] + this.canW / 6 * 6, sy * dotData.w];
                        shapeData.push([path, path1]);
                        sy++;
                    }
                    return shapeData;
                    break;
                case "triangle": //dotData {w:w} w stands for width of the line of the triangle
                    var h = Math.sin(Math.PI / 180 * 60) * dotData.w;
                    while (sy * h < this.canH) {
                        sx = 0;
                        while (dotData.w * sx < this.canW) {
                            if ((sy + 1) % 2 === 0) {
                                var offsetx = dotData.w * sx - dotData.w / 2;
                            } else {
                                var offsetx = dotData.w * sx;
                            }
                            var offsety = h * sy,
                                points = [],
                                origin = [offsetx, offsety + h];
                            points[0] = origin;
                            points[1] = [origin[0] + dotData.w / 2, origin[1] - h];
                            points[3] = [origin[0] + 3 / 2 * dotData.w, origin[1] - h];
                            points[2] = [origin[0] + dotData.w, origin[1]];
                            for (var i = 0; i < 2; i++) {
                                shapeData.push([points[i], points[i + 1], points[i + 2]]);
                            };
                            sx++;
                        }
                        sy++;
                    }
                    return shapeData;
                    break;
                case "doubleTriangle":
                    var h = Math.sin(Math.PI / 180 * 60) * dotData.w;
                    while (sy * h < this.canH) {
                        sx = 0;
                        while (dotData.w * sx < this.canW) {
                            if ((sy + 1) % 2 === 0) {
                                var offsetx = dotData.w * sx - dotData.w / 2;
                            } else {
                                var offsetx = dotData.w * sx;
                            }
                            var offsety = h * sy,
                                points = [],
                                xc = dotData.w / 4 / Math.cos(Math.PI / 180 * 30),
                                xy = dotData.w / 4 * Math.tan(Math.PI / 180 * 30);
                            origin = [offsetx, offsety + h];
                            points[0] = origin;
                            points[1] = [origin[0] + dotData.w / 2, origin[1] - h];
                            points[2] = [origin[0] + dotData.w, origin[1]];
                            points[3] = [origin[0] + 3 / 2 * dotData.w, origin[1] - h];
                            for (var i = 0; i < 2; i++) {
                                if (i == 0) {
                                    var tmp1 = [points[i][0] + dotData.w / 4, points[i][1] - xy],
                                        tmp2 = [points[i + 1][0], points[i + 1][1] + xc],
                                        tmp3 = [points[i + 2][0] - dotData.w / 4, points[i + 2][1] - xy];
                                    shapeData.push([tmp1, tmp2, tmp3]);
                                } else {
                                    var tmp1 = [points[i][0] + dotData.w / 4, points[i][1] + xy],
                                        tmp2 = [points[i + 1][0], points[i + 1][1] - xc],
                                        tmp3 = [points[i + 2][0] - dotData.w / 4, points[i + 2][1] + xy];
                                    shapeData.push([tmp1, tmp2, tmp3]);
                                }
                                shapeData.push([points[i], points[i + 1], points[i + 2]]);
                            };
                            sx++;
                        }
                        sy++;
                    }
                    return shapeData;
                    break;
                case "diamond":
                    var h = Math.sin(Math.PI / 180 * 45) * dotData.w;
                    while (sy * h * 2 < this.canH) {
                        sx = 0;
                        while (h * sx < this.canW) {
                            var points = [];
                            if ((sx + 1) % 2 === 0) {
                                var offsety = 2 * h * sy - h;
                            } else {
                                var offsety = 2 * h * sy;
                            }
                            var offsetx = h * sx;
                            var origin = [offsetx, offsety + h];
                            shapeData.push(this.bulidDiamond(dotData.w, h, offsetx, offsety));
                            sx++;
                        }
                        sy++;
                    }
                    return shapeData;
                    break;
                case "doubleDiamond":
                    var h = Math.sin(Math.PI / 180 * 45) * dotData.w;
                    while (sy * h * 2 < this.canH) {
                        sx = 0;
                        while (h * sx < this.canW) {
                            var points = [];
                            if ((sx + 1) % 2 === 0) {
                                var offsety = 2 * h * sy - h;
                            } else {
                                var offsety = 2 * h * sy;
                            }
                            var offsetx = h * sx;
                            var origin = [offsetx, offsety + h];
                            shapeData.push(this.bulidDiamond(dotData.w, h, offsetx, offsety));
                            shapeData.push(this.bulidDiamond(dotData.w / 2, h / 2, offsetx + h / 2, offsety + h / 2));
                            sx++;
                        }
                        sy++;
                    }
                    return shapeData;
                    break;
            }
        },
        renderAnimateRandom: function(baseColor, width, lineWidth) {
            var render = this.renders[Math.floor(Math.random() * this.renders.length)],
                shape = render.shape[Math.floor(Math.random() * render.shape.length)],
                method = render.method[Math.floor(Math.random() * render.method.length)];
            this.renderAnimate(method, baseColor, this.getShape(shape, {
                w: width
            }), lineWidth);
        },
        renderAnimate: function(shape, baseColor, graphy, lineWidth) {
            //lineWidth only for 'path' case and 'double' case
            var color = ['#ddd', '#222'];
            this.ctx.fillStyle = baseColor;
            this.ctx.lineCap = "round";
            this.ctx.lineJoin = "round";
            this.ctx.fillRect(0, 0, this.canW, this.canH);
            this.ctx.lineWidth = lineWidth ? lineWidth : 1;
            var ctx = this.ctx,
                canW = this.canW,
                canH = this.canH,
                offset = 0,
                animate;

            function renderPath(dot) {
                ctx.beginPath();
                ctx.moveTo(dot[0][0], dot[0][1]);
                for (var j = 1; j < dot.length; j++) {
                    ctx.lineTo(dot[j][0], dot[j][1]);
                }
                ctx.closePath();
            }

            function renderRandom() {
                var num = Math.floor(Math.random() * graphy.length);
                var dot = graphy[num];
                ctx.globalAlpha = Math.random() * 0.1;
                graphy.splice(num, 1);
                switch (shape) {
                    case "pathCloseAll":
                        ctx.strokeStyle = "#000";
                        ctx.fillStyle = color[Math.round(Math.random())];
                        renderPath(dot);
                        ctx.stroke();
                        ctx.fill();
                        break;
                    case "pathCloseStroke":
                        ctx.strokeStyle = "#000";
                        renderPath(dot);
                        ctx.stroke();
                        break;
                    case "pathCloseFill":
                        ctx.fillStyle = color[Math.round(Math.random())];
                        renderPath(dot);
                        ctx.fill();
                        break;
                    case "circleAll":
                        ctx.fillStyle = color[Math.round(Math.random())];
                        ctx.strokeStyle = "#000";
                        ctx.beginPath();
                        ctx.arc(dot[0], dot[1], dot[2], 0, 2 * Math.PI);
                        ctx.fill();
                        ctx.stroke();
                        break;
                    case "circleFill":
                        ctx.fillStyle = color[Math.round(Math.random())];
                        ctx.beginPath();
                        ctx.arc(dot[0], dot[1], dot[2], 0, 2 * Math.PI);
                        ctx.fill();
                        break;
                    case "circleStroke":
                        ctx.strokeStyle = "#000";
                        ctx.beginPath();
                        ctx.arc(dot[0], dot[1], dot[2], 0, 2 * Math.PI);
                        ctx.stroke();
                        break;
                    case "rectFill":
                        ctx.fillStyle = color[Math.round(Math.random())];
                        ctx.fillRect(dot[0], dot[1], dot[2], dot[3]);
                        break;
                    case "rectStroke":
                        ctx.strokeStyle = "#000";
                        ctx.strokeRect(dot[0], dot[1], dot[2], dot[3]);
                        break;
                    case "rectAll":
                        ctx.fillStyle = color[Math.round(Math.random())];
                        ctx.fillRect(dot[0], dot[1], dot[2], dot[3]);
                        ctx.strokeStyle = "rgba(0,0,0,0.5)";
                        ctx.strokeRect(dot[0], dot[1], dot[2], dot[3]);
                        break;
                    case "pathOpen":
                        ctx.beginPath();
                        ctx.strokeStyle = color[Math.round(Math.random())];
                        ctx.moveTo(dot[0][0][0], dot[0][0][1]);
                        ctx.bezierCurveTo(dot[0][1][0], dot[0][1][1], dot[0][2][0], dot[0][2][1], dot[0][3][0], dot[0][3][1]);
                        ctx.bezierCurveTo(dot[1][0][0], dot[1][0][1], dot[1][1][0], dot[1][1][1], dot[1][2][0], dot[1][2][1]);
                        ctx.stroke();
                        break;
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
})