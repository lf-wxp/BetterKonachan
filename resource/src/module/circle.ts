import { ICircle } from 'src/interface';

class Circle implements ICircle {
    public ctx: CanvasRenderingContext2D;
    public width: number;
    public height: number;
    public pos!: { x: number, y: number };
    public alpha!: number;
    public velocity!: number;
    public scale!: number;
    constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.pos = { x: 0, y: 0 };
        this.init();
    }
    public init() {
        this.pos.x = Math.random() * this.width;
        this.pos.y = this.height + Math.random() * 100;
        this.alpha = 0.1 + Math.random() * 0.3;
        this.scale = 0.1 + Math.random() * 0.3;
        this.velocity = Math.random();
    }
    public draw() {
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

export default Circle;
