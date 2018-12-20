<template>
    <section class="music">
        <div class="mPlayerContain" >
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
import '~css/_icon.css';
import * as Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { getMusic } from '~service';
import { Mutation } from 'vuex-class';
// @ts-ignore: 不可达代码错误
@Component
export class VMusic extends Vue {
    public isLoadedBgImage: boolean = false;
    public canvas: HTMLCanvasElement = document.createElement('canvas');
    public songIndex: number = 0;
    public songList: any[] = [];
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

    @Mutation('SETBG') setBg!: Function;

    parseTime(time: number) {
        const is2b = (num: number) => (num < 10 ? '0' + num : '' + num);
        const min = Number.parseInt(`${time / 60}`, 10);
        const sec = Number.parseInt(`${time - min * 60}`, 10);
        return is2b(min) + ':' + is2b(sec);
    }

    initialAudio() {
        this.audio.volume = 0.2;
    }

    initialAudioEvent() {
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
    }

    loadSong() {
        this.clearance();
        const { track, title, pic, artist } = this.songList[this.songIndex];
        this.audio.src = track;
        this.audioTitle = title;
        this.audioArtist = artist;
        this.setBg(pic);
    }

    pickTime(e: MouseEvent) {
        const percentage = e.offsetX / (e.target as Element).clientWidth;
        this.audioPlayedPercentage.width = `${percentage * 100}%`;
        this.audio.currentTime = percentage * this.audio.duration;
    }

    muted() {
        this.audio.muted = !this.audio.muted;
        this.audioMuted = this.audio.muted;
    }

    pickVolume(e: MouseEvent) {
        const percentage = e.offsetX / (e.target as Element).clientWidth;
        this.audioVolumePercentage.width = `${percentage * 100}%`;
        this.audio.volume = percentage;
    }

    playPause() {
        if (this.audio.paused) {
            this.audio.play()
            this.audioPaused = false;
        } else {
            this.audio.pause();
            this.audioPaused = true;
        }
    }

    clearance() {
        this.audioBufPercentage.width =  '0%';
        this.audioPlayedPercentage.width = '0%';
        this.audioPlayedTime = '00:00';
        this.audioTotalTime = '00:00';
    }

    initialAudioBuffer() {
        const ac = new AudioContext();
        const source = ac.createMediaElementSource(this.audio);
        const gainNode = ac.createGain();
        this.analyserNode = ac.createAnalyser();
        this.analyserNode.fftSize = this.fftSize * 2;
        this.analyserNode.connect(gainNode);
        gainNode.connect(ac.destination);
        source.connect(this.analyserNode);
        this.visualizer();
    }

    visualizer() {
        const arr = new Uint8Array(this.analyserNode.frequencyBinCount);
        const anima = () => {
            this.analyserNode.getByteFrequencyData(arr);
            this.draw(arr);
            requestAnimationFrame(anima);
        };
        requestAnimationFrame(anima);
    }

    getCtx() {
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;
        const ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        return { width, height, ctx };
    }

    clearDraw() {
        const { width, height, ctx } = this.getCtx();
        ctx.clearRect(0, 0, width, height);
    }

    draw(arr: Uint8Array) {
        const { width, height, ctx } = this.getCtx();
        const line = ctx.createLinearGradient(0, 0, 0, height);
        const w = width / this.fftSize;
        ctx.globalAlpha = 0.3;
        line.addColorStop(0, '#39cccc');
        line.addColorStop(1, '#0cf2f2');
        ctx.fillStyle = line;
        // ctx.fillStyle = '#39CCCC';
        ctx.clearRect(0, 0, width, height);
        arr.forEach((item: number, i: number) => {
            const h = item / (this.fftSize * 2 ) * height;
            ctx.fillRect(w * i, height - h, w * .6, h);
        });
    }

    resizeCanvas() {
        const width = (this.canvas.parentNode as Element).clientWidth;
        const height = 100;
        this.canvas.width = width;
        this.canvas.height = height;
    }

    nextSong() {
        const n = this.songIndex + 1;
        this.songIndex = n < this.songList.length ? n : 0;
        this.loadSong();
    }
    prevSong() {
        const p = this.songIndex - 1;
        this.songIndex = p >=0 ? p : this.songList.length - 1;
        this.loadSong();
    }

    async mounted() {
        this.canvas.style.cssText = `
            position:absolute;
            bottom: 32px;
        `;
        this.$el.insertBefore(this.canvas, this.$el.firstChild);
        const res = await getMusic.http();
        this.songList = res.data;
        this.audio.autoplay = true;
        this.resizeCanvas();
        this.initialAudio();
        this.initialAudioEvent();
        this.loadSong();
        this.initialAudioBuffer();
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
    }
}
</script>
<style scoped>
:root {
    --mainRadius: 5px;
    --mWidth: 360px;
    --mHeight: 220px;
    --teal: #39cccc;
}
i {
    cursor: pointer;
    color: white;
    transition: color 0.2s ease-in-out;
    &:hover {
        color: var(--teal);
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
    margin-top: 200px;
}

.mInfo {
    display: flex;
    justify-content: flex-end;
    flex-flow: row nowrap;
    align-items: center;
    margin-top: 5px;
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
    margin-left: 10px;
    i {
        color: white;
        transition: color 0.2s ease;
        vertical-align: middle;
        &:hover {
            color: var(--teal);
        }
    }
}
.mProcessBar {
    box-sizing: border-box;
    height: 4px;
    background: rgba(255, 255, 255, 0.4);
    border-radius: 1px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    margin: auto;
}
.mBufferBar {
    position: absolute;
    pointer-events: none;
    width: 0%;
    height: 100%;
    background: rgba(255, 255, 255, 0.7);
    transition: width 0.5s ease;
}
.mPlayedBar {
    position: absolute;
    pointer-events: none;
    width: 0%;
    height: 100%;
    transition: width 0.5s ease;
    background: color(var(--teal) a(30%));
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
    width: 70px;
    height: 5px;
    background: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    display: inline-block;
    position: relative;
    border-radius: 2px;
    margin-left: 10px;
    transition: all 0.2s ease;
}

.mActiveBar {
    background: color(var(--teal) a(30%));
    height: 100%;
    border-radius: 2px;
    position: absolute;
    pointer-events: none;
    bottom: 0px;
    width: 50%;
    transition: all 0.2s ease;
    &.muted {
        background: gray;
    }
}
.mFeakeBar {
    width: 100%;
    height: 100%;
    position: absolute;
}
@keyframes dash {
    100% {
        stroke-dashoffset: 0;
    }
}
</style>
