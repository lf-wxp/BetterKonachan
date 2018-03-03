// the types of files in module folder

declare interface ICircle {
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    alpha: number;
    velocity: number;
    scale: number;
    pos: { x: number, y: number };
    init(): void;
    draw(): void;
}

declare interface IBubble {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    circles: ICircle[];
    animateHeader: boolean;
    width: number;
    height: number;
    init(): void;
    eventHandler(): void;
    resize(): void;
    animate(): void;
}

export { ICircle, IBubble };
