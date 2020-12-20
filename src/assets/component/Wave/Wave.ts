class WaveItem {
  public color: string;
  public nodes: number[][];

  constructor(color: string, nodeNum: number, width: number) {
    this.color = color;
    this.nodes = new Array(nodeNum + 2)
      .fill(1)
      .map((__, i) => [
        ((i - 1) * width) / nodeNum,
        0,
        Math.random() * 200,
        0.1,
      ]);
  }
}

const diffNode = (a: number, b: number): number => (b - a) / 2 + a;

export default class Wave {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private wave: WaveItem[];
  private waveNum: number;
  private waveDot: number;
  private colorList?: string[];

  constructor(
    canvas: HTMLCanvasElement,
    waveNum: number,
    waveDot: number,
    colorList?: string[],
  ) {
    this.waveNum = waveNum;
    this.waveDot = waveDot;
    this.colorList = colorList;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.wave = this.createWave({ num: waveNum, waveDot, colorList });
    this.render();
  }

  private render(): void {
    requestAnimationFrame(() => {
      this.update();
      this.render();
    });
  }

  private update(): void {
    // this.ctx.fillStyle = '#215';
    this.ctx.fillStyle = '#215';
    this.ctx.globalCompositeOperation = 'source-over';
    // ctx.fillRect(0, 0, cvs.width, cvs.height);
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalCompositeOperation = 'screen';
    this.wave.forEach((wave) => {
      wave.nodes.forEach((node) => {
        this.bounce(node);
      });
      this.draw(wave);
    });
    // this.ctx.globalCompositeOperation = 'hue';
    // this.ctx.fillStyle = '#fff';
  }

  private createWave({
    num,
    waveDot,
    width = this.canvas.width,
    colorList,
  }: {
    num: number;
    waveDot: number;
    width?: number;
    colorList?: string[];
  }): WaveItem[] {
    return new Array(num)
      .fill(0)
      .map(
        (__, idx) =>
          new WaveItem(colorList?.[idx] ?? this.randomColor(), waveDot, width),
      );
  }

  private randomColor(): string {
    const h = Math.round(Math.random() * 360);
    return 'hsl(' + h + ',100%,50%)';
  }

  private draw(wave: WaveItem): void {
    this.ctx.fillStyle = wave.color;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.canvas.height);
    this.ctx.lineTo(wave.nodes[0][0], wave.nodes[0][1]);
    wave.nodes.forEach((node, idx) => {
      const nextNode = wave.nodes[idx + 1];
      if (nextNode) {
        this.ctx.quadraticCurveTo(
          node[0],
          node[1],
          diffNode(node[0], nextNode[0]),
          diffNode(node[1], nextNode[1]),
        );
      } else {
        this.ctx.lineTo(node[0], node[1]);
        this.ctx.lineTo(this.canvas.width, this.canvas.height);
      }
    });
    this.ctx.closePath();
    this.ctx.fill();
  }

  private bounce(node: number[]): void {
    node[1] =
      (this.canvas.height / 2) * Math.sin(node[2] / 20) +
      this.canvas.height / 2;
    node[2] = node[2] + node[3];
  }

  public resize(width: number, height: number): void {
    this.canvas.height = height;
    this.canvas.width = width;
    this.wave = this.createWave({
      num: this.waveNum,
      waveDot: this.waveDot,
      colorList: this.colorList,
    });
  }
}
