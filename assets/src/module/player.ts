import Song from '~cModule/song';

class Player implements IPlayer {
    public listSongs: IMusic[];
    public autoplay: boolean;
    public CAC!: ISong;
    public canvas!: HTMLCanvasElement;
    public vueData: IVueData;
    public loadTimeHandler!: number;
    public songsLen!: number;
    public playOrderIndex!: number;
    public isDone!: boolean;
    public currentSongIndex!: number;
    public playedTime!: string;

    constructor({
        listSongs,
        autoplay = true,
        vueData
    }: {
        listSongs: IMusic[];
        autoplay?: boolean;
        vueData: IVueData;
    }) {
        this.listSongs = listSongs;
        this.autoplay = autoplay;
        this.vueData = vueData;
    }
    public static shuffle(a: IMusic[]): IMusic[] {
        for (let i: number = a.length - 1; i > 0; i -= 1) {
            const j: number = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }

        return a;
    }
    public init(): void {
        this.songsLen = this.listSongs.length;
        this.canvas = <HTMLCanvasElement>document.querySelector('.mCanvas');
        this.resize();
        if (!this.songsLen) {
            throw new Error('MPlayer Error: should provide song object');
        }
        this.currentSongIndex = 0;
        this.playOrderIndex = 0;
        this.isDone = false;
        this.loadSong();
        let handler: number;
        window.addEventListener('resize', () => {
            if (handler) {
                clearTimeout(handler);
            }
            handler = window.setTimeout(() => {
                this.resize();
            }, 500);
        });
    }
    public nextSong(): boolean | void {
        if (this.currentSongIndex + 1 < this.songsLen) {
            this.currentSongIndex += 1;
        } else {
            if (this.playOrderIndex === 0) {
                // playorder is repeat the list
                this.currentSongIndex = 0;
            } else {
                this.isDone = true;

                return false;
            }
        }
        this.loadSong();
    }
    public resize(): void {
        const width: number = (<Element>this.canvas.parentNode).clientWidth;
        const height: number = 100;
        this.canvas.width = width;
        this.canvas.height = height;
    }
    // public switchPlayOrder(): void {}
    public volume(vo: number): void {
        this.CAC.setVolume(vo);
    }
    public seek(per: number): void {
        this.CAC.seek(per);
    }
    public prevSong(): boolean | void {
        if (this.currentSongIndex - 1 >= 0) {
            this.currentSongIndex -= 1;
        } else {
            return false;
        }
        this.loadSong();
    }
    public shuffleSongs(): void {
        this.listSongs = Player.shuffle(this.listSongs);
    }
    public async loadSong(): Promise<void> {
        this.clearUpResource();
        const currentSong: IMusic = this.listSongs[this.currentSongIndex];
        this.vueData.title = currentSong.title;
        this.vueData.artist = currentSong.artist;
        this.vueData.bgImg = currentSong.pic;
        this.CAC = new Song({
            id: Number(currentSong.id),
            volume: 0.5,
            canvas: <HTMLCanvasElement>document.querySelector('.mCanvas'),
            activeData: this.vueData
        });
        this.CAC.end().then((result: string) => {
            if (result === 'auto') {
                this.nextSong();
            }
        });
    }
    public clearUpResource(): void {
        if (this.CAC) {
            this.CAC.stop();
        }
        this.vueData.bufferedPercentage.width = '0%';
        this.vueData.playedPercentage.width = '0%';
        this.vueData.totalTime = '00:00';
        this.vueData.playedTime = '00:00';
    }
    public muted(): void {
        this.vueData.muted = !this.vueData.muted;
        this.CAC.mute();
    }
    public playPause(): void {
        if (this.vueData.paused) {
            if (this.isDone === true) {
                this.currentSongIndex = 0;
                this.loadSong();
            } else {
                this.play();
            }
        } else {
            this.pause();
        }
    }
    public play(): void {
        this.vueData.paused = false;
        this.CAC.play();
    }
    public pause(): void {
        this.vueData.paused = true;
        this.CAC.pause();
    }
}

export default Player;
