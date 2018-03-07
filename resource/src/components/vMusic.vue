<template>
    <section id="Mmusic" class="mPlayer">
        <img :src="ablumImg" class="bgImage" @load="loadedBgImg" v-show="isLoadedBgImage" transition="fade">
        <svg class="strokeAnima" viewBox="0 0 300 300">
            <rect x="0" y="0" width="300" height="300" :style="strokePlayed" />
        </svg>
        <div class="MplayerContain" v-show="isStrokeAnimationEnd">
            <div class="mContent">
                <h1 class="mAuthor">{{ initData.artist }}</h1>
                <h1 class="mName">{{ initData.title }}</h1>
                <div class="mProcessBar" @click.stop="pickTime($event)">
                    <div class="mBufferBar" :style="initData.bufferedPercentage" />
                    <div class="mPlayedBar" :style="initData.playedPercentage" />
                </div>
                <div class="mVolume">
                    <i :class="initData.muted ? 'icon-mute' : 'icon-volume'" @click.stop="muted()" />
                    <div class="mVolumeBar">
                        <div class="mActiveBar" :class="initData.muted ? 'muted' : ''" :style="initData.volumePercentage" />
                        <div class="mFeakeBar" @click.stop="pickVolume($event)" />
                    </div>
                </div>
                <div class="mAction">
                    <i class="skip_previous" @click.stop="prevSong" />
                    <i :class="initData.paused ? 'icon-pause' : 'icon-play'" @click.stop="playPause" />
                    <i class="skip_next" @click.stop="nextSong" />
                    <i :class="initData.playOrder" @click.stop="switchPlayOrder" />
                </div>
                <div class="mTimeBox">
                    <div class="mPlayedTime">{{ initData.playedTime }}</div>
                    <div class="mTotalTime">{{ initData.totalTime }}</div>
                </div>
            </div>
        </div>
        <v-loading :show="showLoading" />
    </section>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { IVueData, IPlayer, IMusic } from "src/interface";
import { getMusic } from "src/service";
import Player from "src/module/player";
import vLoading from "src/components/vLoading2.vue";
import bubble from "../module/bubble";

const initData: IVueData = {
    bufferedPercentage: { width: "0%" },
    playedPercentage: { width: "0%" },
    volumePercentage: { width: "50%" },
    playedTime: "00:00",
    totalTime: "00:00",
    bgImg: "",
    muted: false,
    paused: true,
    title: "",
    artist: "",
    playOrder: {
        "icon-repeat": true,
        "icon-reload": false,
        "icon-shuffle": false
    }
};
@Component({
    components: {
        vLoading
    }
})
export default class vMusic extends Vue {
    
    initData: IVueData = initData;
    mPlayer!: IPlayer;
    showLoading: boolean = false;
    isLoadedBgImage: boolean = false;
    ablumImg: string = "";
    isStrokeAnimation: boolean = false;
    strokePlayer: number = 1200;
    isStrokeAnimationEnd: boolean = true;

    get strokePlayed() {
        const num =
            Number.parseInt(this.initData.playedPercentage.width, 10) / 100;
        if (num) {
            return {
                strokeDashoffset: (1 - num) * 1200,
                stroke: "#00e6e6"
            };
        }
    }
    @Watch("initData.bgImg")
    fadeBg(val: string) {
        this.isLoadedBgImage = false;
        setTimeout(() => {
            this.ablumImg = val;
        }, 100); // 为了实现淡入淡出的折中办法。
    }
    pickTime(event: MouseEvent) {
        this.mPlayer.pickTimeBar(event);
    }
    muted() {
        this.mPlayer.muted();
    }
    pickVolume(event: MouseEvent) {
        this.mPlayer.pickVolume(event);
    }
    playPause() {
        this.mPlayer.playPause();
    }
    nextSong() {
        this.mPlayer.nextSong();
    }
    prevSong() {
        this.mPlayer.prevSong();
    }
    switchPlayOrder() {
        this.mPlayer.switchPlayOrder();
    }
    loadedBgImg() {
        setTimeout(() => {
            this.isLoadedBgImage = true;
        }, 100); // 为了实现淡入淡出的折中办法。
    }

    mounted() {
        // svg stroke animation event
        const rect = document.querySelector('.strokeAnima rect') as Element;
        rect.addEventListener(
            'animationend',
            async () => {
                const response = await getMusic();
                this.showLoading = true;
                this.mPlayer = new Player({
                    listSongs: <IMusic[]>response.data,
                    vueData: initData
                });
                this.showLoading = false;
                this.isStrokeAnimationEnd = true;
                this.mPlayer.init();
            },
            false
        );
    }
}
</script>
<style>
@import "_icon.css";
i {
    cursor: pointer;
}
:root {
    --mainRadius: 5px;
    --mWidth: 360px;
    --mHeight: 220px;
}

#Mmusic {
    height: 300px;
    width: 300px;
    position: relative;
    margin-left: 0px;
    margin-right: 0px;
    transform: rotate(45deg);
    margin: 100px;
    overflow: hidden;
}
.MplayerContain {
    width: 100%;
    height: 100%;
    position: relative;
    box-sizing: border-box;
    background-size: cover;
    border-radius: var(--mainRadius);
    border-bottom-left-radius: var(--mainRadius);
    border-bottom-right-radius: var(--mainRadius);
    transform: rotate(-45deg);
}
.bgImage {
    position: absolute;
    width: 142%;
    height: 142%;
    transform: rotate(-45deg) translate(0px, -21%);
    transition: all 0.2s ease-in-out;
}
.fade-enter {
    opacity: 0;
}
.fade-leave {
    opacity: 0;
}
.mContent {
    width: 100%;
    box-sizing: border-box;
    position: absolute;
    top: 0px;
    height: 100%;
}
.mName,
.mAuthor {
    color: white;
    font-size: 12px;
    font-weight: normal;
    text-align: center;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-family: "Microsoft YaHei", "Open sans", "Segoe UI", "Segoe WP",
        Helvetica, Arial, sans-serif;
}
.mName {
    font-size: 16px;
}
.mAuthor {
    margin-top: 70px;
}
.mAction {
    width: 100%;
    text-align: center;
    margin-top: 50px;
    i {
        color: white;
        transition: color 0.2s ease;
        vertical-align: middle;
        &:hover {
            color: $teal;
        }
    }
}
.mProcessBar {
    box-sizing: border-box;
    height: 4px;
    width: 100%;
    background: rgba(255, 255, 255, 0.4);
    border-radius: 1px;
    position: absolute;
    cursor: pointer;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    margin: auto;
}
.mBufferBar {
    position: absolute;
    width: 0%;
    height: 100%;
    background: rgba(255, 255, 255, 0.7);
    transition: width 0.5s ease;
}
.mPlayedBar {
    position: absolute;
    width: 0%;
    height: 100%;
    background: $teal;
}
.mTimeBox {
    box-sizing: border-box;
    width: 100%;
    color: white;
    font-size: 0px;
    display: inline-block;
    text-align: center;
    vertical-align: middle;
    > div {
        font-size: 12px;
        line-height: 12px;
        font-family: "NanoCore";
        display: inline-block;
    }
}
.mPlayedTime {
    &:after {
        content: "/";
        color: white;
        display: inline-block;
        margin: 0px 2px;
    }
}
.mVolume {
    box-sizing: border-box;
    color: white;
    width: 100%;
    text-align: center;
    position: relative;
    &:hover {
        .mVolumeBar {
            opacity: 1;
            visibility: visible;
            will-change: transition;
        }
    }
    i {
        vertical-align: middle;
    }
}
.skip_next {
    position: absolute;
    display: block;
    width: 20px;
    height: 20px;
    top: 0px;
    right: 0px;
    bottom: 0px;
    margin: auto;
    background: #252323;
    transform: translateX(240%) rotate(45deg);
    outline: 2px solid black;
    outline-offset: 2px;
    &:before {
        content: "";
        background: teal;
        position: absolute;
        right: 0px;
        left: 0px;
        top: 0px;
        bottom: 0px;
        margin: auto;
        width: 50%;
        height: 50%;
        transform: translate(22%, -22%);
    }
}
.skip_previous {
    position: absolute;
    display: block;
    width: 20px;
    height: 20px;
    top: 0px;
    left: 0px;
    bottom: 0px;
    margin: auto;
    background: #252323;
    transform: translateX(-240%) rotate(45deg);
    outline: 2px solid black;
    outline-offset: 2px;
    &:before {
        content: "";
        background: teal;
        position: absolute;
        right: 0px;
        left: 0px;
        top: 0px;
        bottom: 0px;
        margin: auto;
        width: 50%;
        height: 50%;
        transform: translate(-22%, 22%);
    }
}
.mVolumeBar {
    position: relative;
    width: 70px;
    height: 5px;
    background: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    display: inline-block;
    vertical-align: middle;
    left: 0px;
    right: 0px;
    margin: auto;
    border-radius: 2px;
    transition: all 0.2s ease;
}
.mActiveBar {
    background: $teal;
    height: 100%;
    border-radius: 2px;
    position: absolute;
    bottom: 0px;
    width: 50%;
    transition: all 0.2s ease;
    &.muted {
        background: $gray;
    }
}
.mFeakeBar {
    width: 100%;
    height: 100%;
    position: absolute;
}
.strokeAnima {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    rect {
        stroke-width: 5px;
        stroke: white;
        fill: transparent;
        stroke-dasharray: 1200;
        stroke-dashoffset: 1200;
        animation: dash 2s linear;
        transition: all 0.2s ease;
    }
}
@keyframes dash {
    100% {
        stroke-dashoffset: 0;
    }
}
</style>
