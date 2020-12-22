type Flag = 'h' | 'v';

type Point = { x: number; y: number };

const randomIntFromInterval = (mn: number, mx: number): number =>
  ~~(Math.random() * (mx - mn + 1) + mn);

const intersect2lines = (l1: Line, l2: Line): Point | undefined => {
  const p1 = l1.a;
  const p2 = l1.b;
  const p3 = l2.a;
  const p4 = l2.b;
  const denominator =
    (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);
  const ua =
    ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) /
    denominator;
  const ub =
    ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) /
    denominator;
  const x = p1.x + ua * (p2.x - p1.x);
  const y = p1.y + ua * (p2.y - p1.y);
  if (ua > 0 && ub > 0) {
    return {
      x,
      y,
    };
  }
};

class Line {
  private flag: Flag;
  private va!: number;
  private vb!: number;
  private w: number;
  private h: number;
  public b: Point;
  public a: Point;

  constructor(flag: Flag, w: number, h: number) {
    this.flag = flag;
    this.a = {} as Point;
    this.b = {} as Point;
    this.w = w;
    this.h = h;
    this.init();
  }

  private init(): void {
    if (this.flag === 'v') {
      this.a.y = 0;
      this.a.x = randomIntFromInterval(0, this.h);
      this.b.y = this.h;
      this.b.x = randomIntFromInterval(0, this.h);
    } else {
      this.a.x = 0;
      this.a.y = randomIntFromInterval(0, this.w);
      this.b.x = this.w;
      this.b.y = randomIntFromInterval(0, this.w);
    }
    this.va = randomIntFromInterval(25, 100) / 100;
    this.vb = randomIntFromInterval(25, 100) / 100;
  }

  public update(): void {
    if (this.flag == 'v') {
      this.a.x += this.va;
      this.b.x += this.vb;
    } else {
      this.a.y += this.va;
      this.b.y += this.vb;
    }

    this.edges();
  }

  public edges(): void {
    if (this.flag == 'v') {
      if (this.a.x < 0 || this.a.x > this.w) {
        this.va *= -1;
      }
      if (this.b.x < 0 || this.b.x > this.w) {
        this.vb *= -1;
      }
    } else {
      if (this.a.y < 0 || this.a.y > this.h) {
        this.va *= -1;
      }
      if (this.b.y < 0 || this.b.y > this.h) {
        this.vb *= -1;
      }
    }
  }
}

export default class DotLine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private lineNum: number;
  private lines: Line[];
  private lineColor: string;
  private dotColor: string;

  constructor(
    canvas: HTMLCanvasElement,
    lineNum: number,
    lineColor = '#ccc',
    dotColor = '#000',
  ) {
    this.lineNum = lineNum;
    this.canvas = canvas;
    this.lineColor = lineColor;
    this.dotColor = dotColor;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.lines = this.createLines();
    this.render();
  }

  private createLines(): Line[] {
    return new Array(this.lineNum).fill(0).map((__, idx) => {
      const flag = idx % 2 === 0 ? 'h' : 'v';
      return new Line(flag, this.canvas.width, this.canvas.height);
    });
  }

  private render(): void {
    requestAnimationFrame(() => {
      this.render();
      this.draw();
    });
  }

  public resize(width: number, height: number): void {
    this.canvas.height = height;
    this.canvas.width = width;
    this.lines = this.createLines();
  }

  public setColor({
    lineColor,
    dotColor,
  }: {
    lineColor?: string;
    dotColor?: string;
  }): void {
    lineColor && (this.lineColor = lineColor);
    dotColor && (this.dotColor = dotColor);
  }

  private draw(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.lines.forEach((line) => {
      this.ctx.strokeStyle = this.lineColor;
      this.ctx.beginPath();
      this.ctx.moveTo(line.a.x, line.a.y);
      this.ctx.lineTo(line.b.x, line.b.y);
      this.ctx.stroke();
      line.update();
    });

    const points: Point[] = [];
    this.lines.forEach((line, idx) => {
      this.lines.slice(idx + 1).forEach((l) => {
        const point = intersect2lines(line, l);
        if (point) {
          points.push(point);
        }
      });
    });

    points.forEach((point) => {
      this.ctx.beginPath();
      this.ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
      this.ctx.fillStyle = this.dotColor;
      this.ctx.fill();
    });
  }
}
