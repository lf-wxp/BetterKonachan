import Song from '~cModule/song';

class Player implements IPlayer {
    public static shuffle(a: IMusic[]) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
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

    constructor({ listSongs, autoplay = true, vueData }: { listSongs: IMusic[], autoplay?: boolean, vueData: IVueData}) {
        this.listSongs = listSongs;
        this.autoplay = autoplay;
        this.vueData = vueData;
    }
    public init() {
        this.songsLen = this.listSongs.length;
        this.canvas = document.querySelector('.mCanvas') as HTMLCanvasElement;
        this.resize();
        if (!this.songsLen) {
            throw new Error('MPlayer Error: should provide song object');
        }
        this.currentSongIndex = 0;
        this.playOrderIndex = 0;
        this.isDone = false;
        this.loadSong();
        let handler: any;
        window.addEventListener('resize', () => {
            if (handler) {
                clearTimeout(handler);
            }
            handler = setTimeout(() => {
                this.resize();
            }, 500);
        });
    }
    public nextSong(): boolean | void {
        if (this.currentSongIndex + 1 < this.songsLen) {
            this.currentSongIndex += 1;
        } else {
            if (this.playOrderIndex === 0) { // playorder is repeat the list
                this.currentSongIndex = 0;
            } else {
                this.isDone = true;
                return false;
            }
        }
        this.loadSong();
    }
    public resize() {
        const width = (this.canvas.parentNode as Element).clientWidth;
        const height = 100;
        this.canvas.width = width;
        this.canvas.height = height;
    }
    public switchPlayOrder() {
    }
    public volume(vo: number) {
        this.CAC.setVolume(vo);
    }
    public seek(per: number) {
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
    public shuffleSongs() {
        this.listSongs = Player.shuffle(this.listSongs);
    }
    public async loadSong() {
        this.clearUpResource();
        const currentSong = this.listSongs[this.currentSongIndex];
        this.vueData.title = currentSong.title;
        this.vueData.artist = currentSong.artist;
        this.vueData.bgImg = currentSong.pic;
        this.CAC = new Song({
            id: Number(currentSong.id),
            volume: .5,
            canvas: document.querySelector('.mCanvas') as HTMLCanvasElement,
            activeData: this.vueData,
        });
        this.CAC.end().then((result) => {
            if (result === 'auto') {
                this.nextSong();
            }
        });
    }
    public clearUpResource() {
        if (this.CAC) {
            this.CAC.stop();
        }
        this.vueData.bufferedPercentage.width = '0%';
        this.vueData.playedPercentage.width = '0%';
        this.vueData.totalTime = '00:00';
        this.vueData.playedTime = '00:00';
    }
    public muted() {
        this.vueData.muted = !this.vueData.muted;
        this.CAC.mute();
    }
    public playPause() {
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
    public play() {
        this.vueData.paused = false;
        this.CAC.play();
    }
    public pause() {
        this.vueData.paused = true;
        this.CAC.pause();
    }
}

export default Player;
