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

declare interface IMusic {
    id: number;
    artist: string;
    pic: string;
    title: string;
    track: string;
}

declare interface IPlayer {
    listSongs: IMusic[];
    autoplay: boolean;
    vueData: object;
    loadTimeHandler: number;
    audio: HTMLAudioElement;
    songsLen: number;
    playOrderIndex: number;
    isDone: boolean;
    currentSongIndex: number;
    playedTime: string;
    init(): void;
    nextSong(): void;
    pickTimeBar(ev: MouseEvent): void;
    pickVolume(ev: MouseEvent): void;
    muted(): void;
    loadSong(): void;
    prevSong(): void;
    switchPlayOrder(): void;
    shuffleSongs(): void;
    audioEvent(): void;
    clearUpResource(): void;
    playPause(): void;
    play(): void;
    pause(): void;
}

declare interface IVueData {
    bufferedPercentage: { width: string };
    playedPercentage: { width: string };
    volumePercentage: { width: string };
    playedTime: string;
    totalTime: string;
    bgImg: string;
    muted: boolean;
    paused: boolean;
    title: string;
    artist: string;
    playOrder: {
        'icon-repeat': boolean;
        'icon-reload': boolean;
        'icon-shuffle': boolean;
    };
}

export { ICircle, IBubble, IMusic, IPlayer, IVueData };
