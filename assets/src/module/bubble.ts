import Circle from '~cModule/circle';

class Bubble implements IBubble {
    public canvas: HTMLCanvasElement;
    public ctx!: CanvasRenderingContext2D;
    public circles!: ICircle[];
    public animateHeader!: boolean;
    public width!: number;
    public height!: number;
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = '0px';
        this.canvas.style.top = '0px';
        this.init();
    }
    public init(): void {
        this.resize();
        this.ctx = <CanvasRenderingContext2D>this.canvas.getContext('2d');
        this.circles = [];
        this.animateHeader = true;
        for (let x: number = 0; x < this.width * 0.5; x += 1) {
            const c: Circle = new Circle(this.ctx, this.width, this.height);
            this.circles.push(c);
        }
        this.animate();
        this.eventHandler();
    }
    public eventHandler(): void {
        const parent: Element = <Element>this.canvas.parentNode;
        parent.addEventListener('resize', this.resize);
    }
    public resize(): void {
        const parent: Element = <Element>this.canvas.parentElement;
        this.width = parent.clientWidth;
        this.height = parent.clientHeight;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = parent.clientHeight;
    }
    public animate(): void {
        if (this.animateHeader) {
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.circles.forEach((item: Circle) => {
                item.draw();
            });
        }
        window.requestAnimationFrame(() => this.animate());
    }
}

export default Bubble;
