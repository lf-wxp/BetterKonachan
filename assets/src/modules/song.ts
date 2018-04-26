import { Isong, IVueData } from 'src/interface';
import { getStream } from 'src/service';

class Song implements Isong {
    public static size = 128;
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
    public ac: AudioContext;
    public id: number;
    public canvas: HTMLCanvasElement;
    public gainNode: GainNode;
    public volume: number;
    public analyserNode: AnalyserNode;
    public bufferSource: AudioBufferSourceNode;
    public activeData: IVueData;

    constructor({ volume, id, canvas, activeData }: { volume: number, id: number, canvas: HTMLCanvasElement, activeData: IVueData }) {
        this.id = id;
        this.canvas = canvas;
        this.volume = volume;
        this.activeData = activeData as IVueData;
        this.ac = new AudioContext();
        this.gainNode = this.ac.createGain();
        this.analyserNode = this.ac.createAnalyser();
        this.analyserNode.fftSize = Song.size * 2;
        this.analyserNode.connect(this.gainNode);
        this.gainNode.connect(this.ac.destination);
        this.bufferSource = this.ac.createBufferSource();
        this.setVolume();
        this.load();
        this.activeData.totalTime = Song.parseTime((this.bufferSource.buffer as AudioBuffer).duration);
    }
    public getInform() {

    }
    public seek(sec: number) {

    }
    public setVolume() {
        this.gainNode.gain.value = this.volume;
    }
    public pause() {
        this.ac.suspend();
    }
    public mute() {
        this.gainNode.gain.value = this.gainNode.gain.value ? 0 : this.volume;
    }
    public play() {
        this.ac.resume();
    }
    public end() {
        return new Promise((resolve, reject) => {
            this.bufferSource.addEventListener('ended', () => {
                resolve('end');
            });
        });
    }
    public async load() {
        const res = await getStream(this.id);
        const buffer = await this.ac.decodeAudioData(res.data);
        this.bufferSource.buffer = buffer;
        this.bufferSource.connect(this.analyserNode);
        this.bufferSource.start();
        this.visualizer();
    }
    public visualizer() {
        const arr = new Uint8Array(this.analyserNode.frequencyBinCount);
        const anima = () => {
            this.analyserNode.getByteFrequencyData(arr);
            this.draw(arr);
            requestAnimationFrame(anima);
        };
        requestAnimationFrame(anima);
    }
    public draw(arr: Uint8Array) {
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;
        const ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        // const line = ctx.createLinearGradient(0, 0, 0, height);
        const w = width / Song.size;
        ctx.globalAlpha=0.2;
        // line.addColorStop(0, 'red');
        // line.addColorStop(0.5, 'yellow');
        // line.addColorStop(1, 'green');
        // ctx.fillStyle = line;
        ctx.fillStyle = 'white';
        ctx.clearRect(0, 0, width, height);
        arr.forEach((item: number, i: number) => {
            const h = item / (Song.size * 2 )* height;
            ctx.fillRect(w * i, height - h, w * .6, h);
        });
    }
}

export default Song;
