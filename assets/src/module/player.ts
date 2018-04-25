import { IPlayer, IMusic, IVueData } from 'src/interface';
import { getStream } from 'src/service';

class Player implements IPlayer {
    public static parseTime(time: number) {
        const is2b = (num: number) => {
            let result;
            if (num < 10) {
                result = `0${num}`;
            } else {
                result = num;
            }
            return result;
        };
        const min = Math.ceil(time / 60);
        const sec = Math.ceil(time - (min * 60));
        return `${is2b(min)}:${is2b(sec)}`;
    }
    public static shuffle(a: IMusic[]) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
    public listSongs: IMusic[];
    public autoplay: boolean;
    public vueData: IVueData;
    public loadTimeHandler!: number;
    public audio!: HTMLAudioElement;
    public songsLen!: number;
    public playOrderIndex!: number;
    public isDone!: boolean;
    public currentSongIndex!: number;
    public playedTime!: string;
    public analyserNode!: AnalyserNode;
    public ac!: AudioContext;
    public bufferSource!: AudioBufferSourceNode;
    public gainNode!: GainNode;

    constructor({ listSongs, autoplay = true, vueData }: { listSongs: IMusic[], autoplay?: boolean, vueData: IVueData}) {
        this.listSongs = listSongs;
        this.autoplay = autoplay;
        this.vueData = vueData;
    }
    public init() {
        this.songsLen = this.listSongs.length;
        this.ac = new AudioContext();
        this.gainNode = this.ac.createGain();
        this.analyserNode = this.ac.createAnalyser();
        this.analyserNode.fftSize = 256;
        this.analyserNode.connect(this.gainNode);
        this.gainNode.connect(this.ac.destination);
        if (!this.songsLen) {
            throw new Error('MPlayer Error: should provide song object');
        }
        this.currentSongIndex = 0;
        this.playOrderIndex = 0;
        // this.audio.preload = 'metadata';
        this.isDone = false;
        // this.audio.volume = Number.parseInt(this.vueData.volumePercentage.width, 10) / 100;
        // this.audioEvent();
        // this.analyser();
        this.loadSong();
    }
    public nextSong() {
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
    private resize() {
        const canvas = document.querySelector('.mCanvas');
    }
    private visualizer() {
        const arr = new Uint8Array(this.analyserNode.frequencyBinCount);
        const anima = () => {
            this.analyserNode.getByteFrequencyData(arr);
            this.draw(arr);
            requestAnimationFrame(anima);
            console.log(arr);
        };
        requestAnimationFrame(anima);
    }
    private draw(arr: Uint8Array) {
        const canvas = document.querySelector('.mCanvas') as HTMLCanvasElement;
        canvas.width = 256;
        canvas.height = 150;
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        const line = ctx.createLinearGradient(0, 0, 0, 150);
        const w = 256 / 128;
        line.addColorStop(0, 'red');
        line.addColorStop(0.5, 'yellow');
        line.addColorStop(1, 'green');
        ctx.fillStyle = line;
        ctx.clearRect(0, 0, 256, 150);
        arr.forEach((item: number, i: number) => {
            const h = item / 256 *  150;
            ctx.fillRect(w * i, 150 - h, w * .6 , h);
        });
    }
    private switchPlayOrder() {
        const keys = Object.keys(this.vueData.playOrder);
        if (this.playOrderIndex + 1 > keys.length - 1) {
            this.playOrderIndex = 0;
        } else {
            this.playOrderIndex += 1;
        }
        const currentKey = keys[this.playOrderIndex];
        debugger;
        if (currentKey === '') {
            this.audio.loop = true;
        } else {
            this.audio.loop = false;
        }
        switch (this.playOrderIndex) {
            case 1:
                this.audio.loop = true;
                break;
            case 2:
                this.shuffleSongs();
                break;
            default:
                this.audio.loop = false;
        }
        Object.keys(this.vueData.playOrder).forEach((key) => {
            if (key === currentKey) {
                this.vueData.playOrder[key] = true;
            } else {
                this.vueData.playOrder[key] = false;
            }
        });
    }
    public prevSong() {
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
        // if (!this.audio.loop) {
            const currentSong = this.listSongs[this.currentSongIndex];
            const res = await getStream(currentSong.id);
            const buffer = await this.ac.decodeAudioData(res.data, );
            this.bufferSource = this.ac.createBufferSource();
            this.bufferSource.buffer = buffer;
            this.bufferSource.connect(this.analyserNode);
            this.bufferSource.start();
            this.vueData.totalTime = Player.parseTime(this.bufferSource.buffer.duration);
            this.vueData.title = currentSong.title;
            this.vueData.artist = currentSong.artist;
            this.vueData.bgImg = currentSong.pic;
            this.visualizer();
        // }
    }
    public audioEvent() {
        this.audio.addEventListener('loadedmetadata', () => {
            this.vueData.totalTime = Player.parseTime(this.audio.duration);
        });
        this.audio.addEventListener('play', () => {
            this.vueData.paused = false;
            // this.visualizer();
        });
        this.audio.addEventListener('ended', () => {
            this.vueData.paused = true;
            this.nextSong();
        });
        this.audio.addEventListener('timeupdate', () => { // update the processing Bar
            this.vueData.playedTime = Player.parseTime(this.audio.currentTime);
            this.vueData.playedPercentage.width = `${(this.audio.currentTime / this.audio.duration) * 100}%`;
        });
        this.audio.addEventListener('progress', () => { // update the processing Bar
            if (this.audio.buffered.length) {
                this.vueData.bufferedPercentage.width = `${(this.audio.buffered.end(this.audio.buffered.length - 1) / this.audio.duration) * 100}%`;
            }
        });
    }
    public clearUpResource() {
        this.pause();
        this.vueData.bufferedPercentage.width = '0%';
        this.vueData.playedPercentage.width = '0%';
        this.vueData.totalTime = '00:00';
        this.vueData.playedTime = '00:00';
    }
    public pickTimeBar(event: MouseEvent) {
        if (!this.audio.ended) {

            const processBarWidth = (document.querySelector('.mProcessBar') as Element).clientWidth;
            const percentage = event.offsetX / processBarWidth;
            this.audio.currentTime = percentage * this.audio.duration;
            this.vueData.playedPercentage.width = percentage * 100 + '%';
            this.playedTime = Player.parseTime(percentage * this.audio.duration);
        }
    }
    public pickVolume(per: number) {
        console.log(per);
        this.gainNode.gain.value = per;
    }
    public muted() {
        this.vueData.muted = !this.vueData.muted;
        this.gainNode.gain.value = 0;
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
        this.ac.resume();
    }
    public pause() {
        this.vueData.paused = true;
        this.ac.suspend();
    }

}

export default Player;
