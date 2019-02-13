<template>
    <section class="music">
        <div class="mPlayerContain">
            <div class="mContent">
                <div class="mProcessBar" @click.stop="pickTime($event)">
                    <div class="mBufferBar" :style="audioBufPercentage" />
                    <div class="mPlayedBar" :style="audioPlayedPercentage" />
                </div>
                <div class="mInfo">
                    <h1 class="mAuthor">{{ audioArtist }}</h1>
                    <h1 class="mName">{{ audioTitle }}</h1>
                    <div class="mVolume">
                        <i :class="audioMuted ? 'icon-mute' : 'icon-volume'" @click.stop="muted()" />
                        <div class="mVolumeBar" @click.stop="pickVolume($event)">
                            <div class="mActiveBar" :class="audioMuted ? 'muted' : ''" :style="audioVolumePercentage" />
                        </div>
                    </div>
                    <div class="mAction">
                        <i class="icon-left" @click.stop="prevSong" />
                        <i :class="audioPaused ? 'icon-pause' : 'icon-play'" @click.stop="playPause" />
                        <i class="icon-right" @click.stop="nextSong" />
                    </div>
                    <div class="mTimeBox">
                        <div class="mPlayedTime">{{ audioPlayedTime }}</div>
                        <div class="mTotalTime">{{ audioTotalTime }}</div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getMusic } from '~service';
import { Mutation, State } from 'vuex-class';
import Bubble from '~cModule/bubble';
import * as Paper from 'paper';

import { ISong } from '~model/song';
import { IServiceHttpRes, isValidRes } from '~cModel/service';
import { IResponse } from '~model/response';

@Component
export default class VMusic extends Vue {
    public isLoadedBgImage: boolean = false;
    public canvas: HTMLCanvasElement = document.createElement('canvas');
    public canvasBubble: HTMLCanvasElement = document.createElement('canvas');
    public songIndex: number = 0;
    public songList: ISong[] = [];
    public fftSize: number = 128;
    public analyserNode!: AnalyserNode;
    public audioBufPercentage: { width: string } = { width: '0%' };
    public audioPlayedPercentage: { width: string } = { width: '0%' };
    public audioVolumePercentage: { width: string } = { width: '20%' };
    public audioPlayedTime: string = '00:00';
    public audioTotalTime: string = '00:00';
    public audioMuted: boolean = false;
    public audioPaused: boolean = false;
    public audioTitle: string = '';
    public audioArtist: string = '';
    public audio: HTMLAudioElement = new Audio();
    public audioLine!: Paper.Path;
    @State('themeColor') public themeColor: string;

    @Mutation('SETBG') public setBg!: Function;

    public parseTime(time: number): string {
        const is2b: (n: number) => string = (num: number): string => (num < 10 ? `0${num}` : `${num}`);
        const min: number = Number.parseInt(`${time / 60}`, 10);
        const sec: number = Number.parseInt(`${time - min * 60}`, 10);

        return `${is2b(min)}:${is2b(sec)}`;
    }

    public initialAudio(): void {
        this.audio.volume = 0.2;
    }

    public initialAudioEvent(): void {
        this.audio.addEventListener('loadedmetadata', () => {
            this.audioTotalTime = this.parseTime(this.audio.duration);
        });
        this.audio.addEventListener('play', () => {
            this.audioPaused = false;
        });
        this.audio.addEventListener('ended', () => {
            this.audioPaused = true;
            this.nextSong();
        });
        this.audio.addEventListener('timeupdate', () => {
            // update the processing Bar
            this.audioPlayedTime = this.parseTime(
                this.audio.currentTime
            );
            this.audioPlayedPercentage.width = `${this.audio.currentTime / this.audio.duration * 100}%`;
        });
        this.audio.addEventListener('progress', () => {
            // update the processing Bar
            if (this.audio.buffered.length) {
                this.audioBufPercentage.width = `${this.audio.buffered.end(this.audio.buffered.length - 1) / this.audio.duration * 100}%`;
            }
        });
        this.audio.addEventListener('canplay', () => {
            console.log('canplay');
            this.initialAudioBuffer();
        }, { once: true });
    }

    public loadSong(): void {
        this.clearance();
        const song = this.songList[this.songIndex];
        if (!song) return;
        const { track, title, pic, artist } = song;
        this.audio.src = track;
        this.audioTitle = title;
        this.audioArtist = artist;
        this.setBg(pic);
    }

    public pickTime(e: MouseEvent): void {
        const percentage: number = e.offsetX / (<Element>e.target).clientWidth;
        this.audioPlayedPercentage.width = `${percentage * 100}%`;
        this.audio.currentTime = percentage * this.audio.duration;
    }

    public muted(): void {
        this.audio.muted = !this.audio.muted;
        this.audioMuted = this.audio.muted;
    }

    public pickVolume(e: MouseEvent): void {
        const percentage: number = e.offsetX / (<Element>e.target).clientWidth;
        this.audioVolumePercentage.width = `${percentage * 100}%`;
        this.audio.volume = percentage;
    }

    public playPause(): void {
        if (this.audio.paused) {
            this.audio.play();
            this.audioPaused = false;
        } else {
            this.audio.pause();
            this.audioPaused = true;
        }
    }

    public clearance(): void {
        this.audioBufPercentage.width = '0%';
        this.audioPlayedPercentage.width = '0%';
        this.audioPlayedTime = '00:00';
        this.audioTotalTime = '00:00';
    }

    public initialAudioBuffer(): void {
        const ac: AudioContext = new AudioContext();
        const source: MediaElementAudioSourceNode = ac.createMediaElementSource(this.audio);
        const gainNode: GainNode = ac.createGain();
        this.analyserNode = ac.createAnalyser();
        this.analyserNode.fftSize = this.fftSize * 2;
        this.analyserNode.connect(gainNode);
        gainNode.connect(ac.destination);
        source.connect(this.analyserNode);
        this.visualizer();
    }

    public visualizer(): void {
        const arr: Uint8Array = new Uint8Array(this.analyserNode.frequencyBinCount);
        this.audioLine.onFrame = (): void => {
            this.analyserNode.getByteFrequencyData(arr);
            this.draw(arr);
        };
    }

    public getCtx(): { width: number; height: number; ctx: CanvasRenderingContext2D } {
        const width: number = this.canvas.clientWidth;
        const height: number = this.canvas.clientHeight;
        const ctx: CanvasRenderingContext2D = <CanvasRenderingContext2D>this.canvas.getContext('2d');

        return { width, height, ctx };
    }

    public initAudioLine(): void {
        Paper.setup(this.canvas);
        this.audioLine = new Paper.Path({
            segments: Array(this.fftSize)
                .fill([0, 0]),
            strokeColor: this.themeColor,
            strokeWidth: 1
        });
    }

    public draw(arr: Uint8Array): void {
        const { width, height } = this.getCtx();
        const w: number = width / this.fftSize;
        arr.forEach((item: number, i: number) => {
            const h: number = item / (this.fftSize * 2) * height;
            this.audioLine.segments[i].point = new Paper.Point(w * i, height - h);
        });
        this.audioLine.smooth();
    }

    public resizeCanvas(): void {
        const width: number = (<Element>this.canvas.parentNode).clientWidth;
        const height: number = (<Element>this.canvas.parentNode).clientHeight;
        const cHeight: number = 100;
        this.canvasBubble.width = width;
        this.canvasBubble.height = height;
        this.canvas.width = width;
        this.canvas.height = cHeight;
    }

    public nextSong(): void {
        const n: number = this.songIndex + 1;
        this.songIndex = n < this.songList.length ? n : 0;
        this.loadSong();
    }

    public prevSong(): void {
        const p: number = this.songIndex - 1;
        this.songIndex = p >= 0 ? p : this.songList.length - 1;
        this.loadSong();
    }

    public async mounted(): Promise<void> {
        this.canvas.style.cssText = `
            position:absolute;
            bottom: 32px;
            pointer-events: none;
        `;
        this.canvasBubble.style.cssText = `
            position:absolute;
            bottom: 32px;
            pointer-events: none;
        `;
        this.$el.insertBefore(this.canvas, this.$el.firstChild);
        this.$el.insertBefore(this.canvasBubble, this.$el.firstChild);
        this.resizeCanvas();
        new Bubble(this.canvasBubble);
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
        const res: IServiceHttpRes<IResponse<ISong[]>> = await getMusic.http({});
        if (isValidRes<ISong[]>(res) && res.data) {
            this.songList = res.data.data;
        }
        if (this.songList.length === 0) {
            return;
        }
        this.audio.autoplay = true;
        Paper.setup(this.canvas);
        this.initAudioLine();
        this.initialAudio();
        this.initialAudioEvent();
        this.loadSong();
    }
}
</script>
<style lang="postcss">
i {
    cursor: pointer;
    color: white;
    transition: color 0.2s ease-in-out;
    &:hover {
        color: var(--themeBaseColor);
    }
}
.music {
    position: relative;
    overflow: hidden;
}

.mPlayerContain {
    position: relative;
    box-sizing: border-box;
    background-size: cover;
    margin-block-start: 200px;
}

.mInfo {
    display: flex;
    justify-content: flex-end;
    flex-flow: row nowrap;
    align-items: center;
    margin-block-start: 5px;
}
.mName,
.mAuthor {
    flex: 0 0 auto;
    color: white;
    margin: 0 10px;
    font-size: 12px;
    font-weight: normal;
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-family: 'Microsoft YaHei', 'Open sans', 'Segoe UI', 'Segoe WP',
        Helvetica, Arial, sans-serif;
}
.mName {
    font-size: 16px;
}
.mAction {
    flex: 0 0 auto;
    text-align: center;
    margin-inline-start: 10px;
    i {
        color: white;
        transition: color 0.2s ease;
        vertical-align: middle;
        &:hover {
            color: var(--themeBaseColor);
        }
    }
}
.mProcessBar {
    box-sizing: border-box;
    block-size: 2px;
    background: rgba(255, 255, 255, 0.4);
    border-radius: 1px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    inset: 0 0 0 0;
    margin: auto;
}
.mBufferBar {
    position: absolute;
    pointer-events: none;
    inline-size: 0%;
    block-size: 100%;
    background: rgba(255, 255, 255, 0.7);
    transition: width 0.5s ease;
}
.mPlayedBar {
    position: absolute;
    pointer-events: none;
    inline-size: 0%;
    block-size: 100%;
    transition: width 0.5s ease;
    background: var(--themeBaseColorAlpha80);
}
.mTimeBox {
    flex: 0 0 auto;
    box-sizing: border-box;
    color: white;
    margin: 0 10px;
    font-size: 12px;
    line-height: 12px;
    display: flex;
    text-align: center;
    vertical-align: middle;
}
.mPlayedTime {
    flex: 0 0 auto;
    &:after {
        content: '/';
        color: white;
        display: inline-block;
        margin: 0px 2px;
    }
}
.mTotalTime {
    flex: 0 0 auto;
}
.mVolume {
    flex: 0 0 auto;
    box-sizing: border-box;
    color: white;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    position: relative;
}
.mVolumeBar {
    flex: 0 0 auto;
    inline-size: 70px;
    block-size: 5px;
    background: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    display: inline-block;
    position: relative;
    border-radius: 2px;
    margin-inline-start: 10px;
    transition: all 0.2s ease;
}

.mActiveBar {
    background: var(--themeBaseColorAlpha30);
    block-size: 100%;
    border-radius: 2px;
    position: absolute;
    pointer-events: none;
    inset-block-end: 0px;
    inline-size: 50%;
    transition: all 0.2s ease;
    &.muted {
        background: gray;
    }
}
.mFeakeBar {
    inline-size: 100%;
    block-size: 100%;
    position: absolute;
}
@keyframes dash {
    100% {
        stroke-dashoffset: 0;
    }
}
</style>
