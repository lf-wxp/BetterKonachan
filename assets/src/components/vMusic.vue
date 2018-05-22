<template>
    <section class="music">
        <canvas class="mCanvas"></canvas>
        <div class="mPlayerContain" >
            <div class="mContent">
                <div class="mProcessBar" @click.stop="pickTime($event)">
                    <div class="mBufferBar" :style="initData.bufferedPercentage" />
                    <div class="mPlayedBar" :style="initData.playedPercentage" />
                </div>
                <div class="mInfo">
                    <h1 class="mAuthor">{{ initData.artist }}</h1>
                    <h1 class="mName">{{ initData.title }}</h1>
                    <div class="mVolume">
                        <i :class="initData.muted ? 'icon-mute' : 'icon-volume'" @click.stop="muted()" />
                        <div class="mVolumeBar" @click.stop="pickVolume($event)">
                            <div class="mActiveBar" :class="initData.muted ? 'muted' : ''" :style="initData.volumePercentage" />
                        </div>
                    </div>
                    <div class="mAction">
                        <i class="icon-left" @click.stop="prevSong" />
                        <i :class="initData.paused ? 'icon-pause' : 'icon-play'" @click.stop="playPause" />
                        <i class="icon-right" @click.stop="nextSong" />
                        <i :class="initData.playOrder" @click.stop="switchPlayOrder" />
                    </div>
                    <div class="mTimeBox">
                        <div class="mPlayedTime">{{ initData.playedTime }}</div>
                        <div class="mTotalTime">{{ initData.totalTime }}</div>
                    </div>
                </div>
            </div>
        </div>
        <v-loading :show="showLoading" />
    </section>
</template>
<script lang="ts">
import 'css/_icon.css';
import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { getMusic } from 'src/service';
import { Mutation } from 'vuex-class';
import Player from 'modules/player';
import vLoading from 'components/vLoading2.vue';
import bubble from 'modules/bubble';

const initData: IVueData = {
    bufferedPercentage: { width: '0%' },
    playedPercentage: { width: '0%' },
    volumePercentage: { width: '50%' },
    playedTime: '00:00',
    totalTime: '00:00',
    bgImg: '',
    muted: false,
    paused: false,
    title: '',
    artist: '',
    playOrder: {
        'icon-repeat': true,
        'icon-reload': false,
        'icon-shuffle': false
    }
};
@Component({
    components: {
        vLoading,
    }
})
export default class vMusic extends Vue {
    initData: IVueData = initData;
    mPlayer!: IPlayer;
    showLoading: boolean = false;
    isLoadedBgImage: boolean = false;

    @Mutation SETBG!: Function;

    @Watch('initData.bgImg')
    setBackground(val: string, oldVal: string) {
        this.SETBG(val);
    }
    pickTime(event: MouseEvent) {
        const percentage =
            event.offsetX / (event.target as Element).clientWidth;
        console.log(percentage);
        this.initData.playedPercentage.width = `${percentage * 100}%`;
        this.mPlayer.seek(percentage);
    }
    muted() {
        this.mPlayer.muted();
    }
    pickVolume(event: MouseEvent) {
        const percentage =
            event.offsetX / (event.target as Element).clientWidth;
        this.initData.volumePercentage.width = `${percentage * 100}%`;
        this.mPlayer.volume(percentage);
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

    async mounted() {
        const response = await getMusic.http();
        this.showLoading = true;
        this.mPlayer = new Player({
            listSongs: <IMusic[]>response.data,
            vueData: initData
        });
        this.showLoading = false;
        this.mPlayer.init();
    }
}
</script>
<style scoped>
i {
    cursor: pointer;
}
:root {
    --mainRadius: 5px;
    --mWidth: 360px;
    --mHeight: 220px;
    --teal: #39CCCC;
}

.music {
    position: relative;
    overflow: hidden;
}

.mCanvas {
    position: absolute;
    top: 100px;
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
