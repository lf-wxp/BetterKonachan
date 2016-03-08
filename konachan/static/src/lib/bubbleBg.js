const isAnimationFrame = () => {
    let lastTime = 0;
    const vendors = ['ms', 'moz', 'webkit', 'o'];
    for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = (callback) => {
            const currTime = new Date().getTime();
            const timeToCall = Math.max(0, 16 - (currTime - lastTime));
            const id = window.setTimeout(() => {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = (id) => {
            clearTimeout(id);
        };
    }
};

isAnimationFrame();
class Circle {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.pos = {};
        this.init();
    }
    init() {
        this.pos.x = Math.random() * this.width;
        this.pos.y = this.height + Math.random() * 100;
        this.alpha = 0.1 + Math.random() * 0.3;
        this.scale = 0.1 + Math.random() * 0.3;
        this.velocity = Math.random();
    }
    draw() {
        if (this.alpha <= 0) {
            this.init();
        }
        this.pos.y -= this.velocity;
        this.alpha -= 0.0005;
        this.ctx.beginPath();
        this.ctx.arc(this.pos.x, this.pos.y, this.scale * 10, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = 'rgba(255,255,255,' + this.alpha + ')';
        this.ctx.fill();
    }

}
class Bubble {
    constructor(canvas) {
        this.canvas = canvas;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = '0px';
        this.canvas.style.top = '0px';
        this.init();
    }
    init() {
        this.resize();
        this.ctx = this.canvas.getContext('2d');
        this.circles = [];
        this.animateHeader = true;
        for (let x = 0; x < this.width * 0.5; x++) {
            const c = new Circle(this.ctx, this.width, this.height);
            this.circles.push(c);
        }
        this.animate();
        this.eventHandler();
    }
    eventHandler() {
        this.canvas.parentNode.addEventListener('resize', this.resize);
    }
    resize() {
        const width = this.canvas.parentNode.clientWidth;
        const height = this.canvas.parentNode.clientHeight;
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
    }
    animate() {
        if (this.animateHeader) {
            this.ctx.clearRect(0, 0, this.width, this.height);
            for (let i = 0; i < this.circles.length; i++) {
                this.circles[i].draw();
            }
        }
        requestAnimationFrame(() => this.animate());
    }
}


export default Bubble;
