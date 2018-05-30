declare module '*.vue' {
    import Vue from 'vue';
    export default Vue;
}
declare module '*.json' {
    const value: any;
    export default value;
}
declare module '*.css' {
    interface IClassNames {
        [className: string]: string;
    }
    const classNames: IClassNames;
    export = classNames;
}

declare module '*.png' {
    const value: string;
    export default value;
}

declare module '*.jpg' {
    const value: string;
    export default value;
}

declare module 'vue-spinkit' {
    const Spinner: any;
    export default Spinner;
}

declare interface ICircle {
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    alpha: number;
    velocity: number;
    scale: number;
    pos: { x: number; y: number };
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
    CAC: Isong;
    autoplay: boolean;
    canvas: HTMLCanvasElement;
    vueData: object;
    loadTimeHandler: number;
    songsLen: number;
    playOrderIndex: number;
    isDone: boolean;
    currentSongIndex: number;
    playedTime: string;
    init(): void;
    nextSong(): void;
    muted(): void;
    volume(vo: number): void;
    loadSong(): void;
    prevSong(): void;
    seek(per: number): void;
    switchPlayOrder(): void;
    shuffleSongs(): void;
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

declare interface ISong {
    ac: AudioContext;
    id: number;
    duration: number;
    gainNode: GainNode;
    volume: number;
    analyserNode: AnalyserNode;
    canvas: HTMLCanvasElement;
    bufferSource: AudioBufferSourceNode;
    activeData: IVueData;
    stopStatus: boolean;
    pause(): void;
    play(): void;
    mute(): void;
    end(): Promise<{}>;
    stop(): void;
    seek(sec: number): void;
    setVolume(n: number): void;
    load(): void;
    visualizer(): void;
    draw(arr: Uint8Array): void;
}

declare interface IService {
    cancel(): void;
    http(data: object): AxiosPromise<any>;
}

declare interface uploadFile {
    file: File;
    isSuccess: boolean;
    isStart: boolean;
    md5: string;
    processBar: {
        width: string;
    }
}
