<template>
    <section id="Mmusic" class="mPlayer">
        <img :src="ablumImg" class="bgImage" @load="loadedBgImg" v-show="isLoadedBgImage" transition="fade">
        <svg class="strokeAnima" viewBox="0 0 300 300">
            <rect x="0" y="0" width="300" height="300" :style="strokePlayed"></rect>
        </svg>
        <div class="MplayerContain" v-show="isStrokeAnimationEnd">
            <div class="mContent">
                <h1 class="mAuthor">{{ initData.artist }}</h1>
                <h1 class="mName">{{ initData.title }}</h1>
                <div class="mProcessBar" @click.stop="pickTime($event)">
                    <div class="mBufferBar" :style="initData.bufferedPercentage"></div>
                    <div class="mPlayedBar" :style="initData.playedPercentage"></div>
                </div>
                <div class="mVolume">
                    <i :class="initData.muted ? 'icon-mute' : 'icon-volume'" @click.stop="muted()"></i>
                    <div class="mVolumeBar">
                        <div class="mActiveBar" :class="initData.muted ? 'muted' : ''" :style="initData.volumePercentage"></div>
                        <div class="mFeakeBar" @click.stop="pickVolume($event)"></div>
                    </div>
                </div>
                <div class="mAction">
                    <i class="skip_previous" @click.stop="prevSong"></i>
                    <i :class="initData.paused ? 'icon-pause' : 'icon-play'" @click.stop="playPause"></i>
                    <i class="skip_next" @click.stop="nextSong"></i>
                    <i :class="initData.playOrder" @click.stop="switchPlayOrder"></i>
                </div>
                <div class="mTimeBox">
                    <div class="mPlayedTime">{{ initData.playedTime }}</div>
                    <div class="mTotalTime">{{ initData.totalTime }}</div>
                </div>
            </div>
        </div>
        <v-loading :show='showLoading'></v-loading>
    </section>
</template>
<script>
    // import Vibrant from 'node-vibrant';
    // const v = new Vibrant(rgbimg, {});
    // v.getPalette((err, palette) => {
    //     console.log(palette.Vibrant.getRgb());
    // });
    class Mplayer {
        /*
        * defaultOpts
        *   listSongs:
        *   autoplay:true
        *   playOrder:
        *        shuffle
        *        repeat
        *        repeat_one
        */
        constructor(opts) {
            this.defaultOpts = {
                listSongs: null,
                autoplay: true,
                vueData: null
            };
            this.extend(opts);
        }
        init() {
            this.loadTimeHandler = null;
            this.audio = document.createElement('audio');
            this.songsLen = this.defaultOpts.listSongs.length;
            if (!this.songsLen) {
                throw 'MPlayer Error: should provide song object';
            }
            this.currentSongIndex = 0;
            this.playOrderIndex = 0;
            this.audio.preload = 'metadata';
            this.isDone = false;
            this.audio.volume = Number.parseInt(this.defaultOpts.vueData.volumePercentage.width, 10) / 100;
            this.audioEvent();
            this.loadSong();
        }
        nextSong() {
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
        switchPlayOrder() {
            const keys = Object.keys(this.defaultOpts.vueData.playOrder);
            if (this.playOrderIndex + 1 > keys.length - 1) {
                this.playOrderIndex = 0;
            } else {
                this.playOrderIndex += 1;
            }
            const currentKey = keys[this.playOrderIndex];
            if (currentKey === 1) {
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
            for (const i in this.defaultOpts.vueData.playOrder) {
                if (i === currentKey) {
                    this.defaultOpts.vueData.playOrder[i] = true;
                } else {
                    this.defaultOpts.vueData.playOrder[i] = false;
                }
            }
        }
        prevSong() {
            if (this.currentSongIndex - 1 >= 0) {
                this.currentSongIndex -= 1;
            } else {
                return false;
            }
            this.loadSong();
        }
        shuffleSongs() {
            const shuffle = (o) => {
                for (let j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
                return o;
            };
            this.defaultOpts.listSongs = shuffle(this.defaultOpts.listSongs);
        }
        loadSong() {
            if (this.audio.loop) {
                return false;
            }
            const currentSong = this.defaultOpts.listSongs[this.currentSongIndex];
            this.audio.src = currentSong.track;
            this.defaultOpts.vueData.title = currentSong.title;
            this.defaultOpts.vueData.artist = currentSong.artist;
            this.defaultOpts.vueData.bgImg = currentSong.pic;
            this.audio.autoplay = true;
        }
        audioEvent() {
            this.audio.addEventListener('loadedmetadata', () => {
                this.defaultOpts.vueData.totalTime = this.parseTime(this.audio.duration);
            });
            this.audio.addEventListener('play', () => {
                this.defaultOpts.vueData.paused = false;
            });
            this.audio.addEventListener('ended', () => {
                this.defaultOpts.vueData.paused = true;
                this.nextSong();
            });
            this.audio.addEventListener('timeupdate', () => {// update the processing Bar
                this.defaultOpts.vueData.playedTime = this.parseTime(this.audio.currentTime);
                this.defaultOpts.vueData.playedPercentage.width = this.audio.currentTime / this.audio.duration * 100 + '%';
            });
            this.audio.addEventListener('progress', () => {// update the processing Bar
                if (this.audio.buffered.length) {
                    this.defaultOpts.vueData.bufferedPercentage.width = this.audio.buffered.end(this.audio.buffered.length - 1) / this.audio.duration * 100 + '%';
                }
            });
        }
        clearUpResource() {
            this.pause();
            this.defaultOpts.vueData.bufferedPercentage.width = '0%';
            this.defaultOpts.vueData.playedPercentage.width = '0%';
            this.defaultOpts.vueData.totalTime = '00:00';
            this.defaultOpts.vueData.playedTime = '00:00';
        }
        pickTimeBar(event) {
            if (!this.audio.ended) {
                const processBarWidth = document.querySelector('.mProcessBar').clientWidth;
                const percentage = event.offsetX / processBarWidth;
                this.audio.currentTime = percentage * this.audio.duration;
                this.defaultOpts.vueData.playedPercentage.width = percentage * 100 + '%';
                this.playedTime = this.parseTime(percentage * this.audio.duration);
            }
        }
        pickVolume(event) {
            if (!this.defaultOpts.vueData.muted) {
                const volumeBarWidth = document.querySelector('.mFeakeBar').clientWidth;
                const percentage = event.offsetX / volumeBarWidth;
                this.defaultOpts.vueData.volumePercentage.width = percentage * 100 + '%';
                this.audio.volume = percentage;
            }
        }
        muted() {
            this.defaultOpts.vueData.muted = !this.defaultOpts.vueData.muted;
            this.audio.muted = this.defaultOpts.vueData.muted;
        }
        playPause() {
            if (this.defaultOpts.vueData.paused) {
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
        play() {
            this.defaultOpts.vueData.paused = false;
            this.audio.play();
        }
        pause() {
            this.defaultOpts.vueData.paused = true;
            this.audio.pause();
        }
        extend(opts) {
            for (const i in opts) {
                if (this.defaultOpts.hasOwnProperty(i)) {
                    this.defaultOpts[i] = opts[i];
                }
            }
        }
        parseTime(time) {
            const is2b = (num) => num < 10 ? '0' + num : '' + num;
            const min = Number.parseInt(time / 60, 10);
            const sec = Number.parseInt(time - min * 60, 10);
            return is2b(min) + ':' + is2b(sec);
        }
    }
    import { getMusic } from '../servers/servers.js';
    import vLoading from './vLoading2.vue';
    import Util from '../lib/util.js';
    const initData = {
        bufferedPercentage: { width: '0%' },
        playedPercentage: { width: '0%' },
        volumePercentage: { width: '50%' },
        playedTime: '00:00',
        totalTime: '00:00',
        bgImg: '',
        muted: false,
        paused: true,
        title: '',
        artist: '',
        playOrder: {
            'icon-repeat': true,
            'icon-reload': false,
            'icon-shuffle': false
        }

    };
    export default {
        data() {
            return {
                initData,
                mPlayer: null,
                showLoading: false,
                isLoadedBgImage: false,
                ablumImg: '',
                isStrokeAnimationEnd: false,
                strokePlayed: 1200
            };
        },
        components: {
            vLoading
        },
        methods: {
            pickTime(event) {
                this.mPlayer.pickTimeBar(event);
            },
            muted() {
                this.mPlayer.muted();
            },
            pickVolume(event) {
                this.mPlayer.pickVolume(event);
            },
            playPause() {
                this.mPlayer.playPause();
            },
            nextSong() {
                this.mPlayer.nextSong();
            },
            prevSong() {
                this.mPlayer.prevSong();
            },
            switchPlayOrder() {
                this.mPlayer.switchPlayOrder();
            },
            loadedBgImg() {
                setTimeout(() => {
                    this.isLoadedBgImage = true;
                }, 100); // 为了实现淡入淡出的折中办法。
            }
        },
        watch: {
            'initData.bgImg': function(value) {
                this.isLoadedBgImage = false;
                setTimeout(() => {
                    this.ablumImg = value;
                }, 100); // 为了实现淡入淡出的折中办法。
            }
        },
        computed: {
            strokePlayed() {
                let num = Number.parseInt(this.initData.playedPercentage.width) / 100;
                if (num) {
                    return { strokeDashoffset: (1 - num) * 1200, stroke: '#00e6e6' };
                }
            }
        },
        props: ['mplayer'],
        ready() {
            // svg stroke animation event 
            document.querySelector('.strokeAnima rect').addEventListener(Util.whichAnimationEventEnd(), () => {
                this.showLoading = true;
                getMusic((response) => {
                    this.mPlayer = new Mplayer(Object.assign({}, { listSongs: response.data }, { vueData: initData }));
                    this.showLoading = false;
                    this.isStrokeAnimationEnd = true;
                    this.mPlayer.init();
                });
            }, false);
        }
    };

</script>
<style lang="sass" scoped>
    @import "../assets/sass/components/_colors";
    @import "../assets/sass/components/_icon";


    i {
        cursor: pointer;
    }
    $mainRadius:5px;
    $mWidth:360px;
    $mHeight:220px;
    #Mmusic {
        height:300px;
        width:300px;
        position:relative;
        margin-left: 0px;
        margin-right: 0px;
        transform:rotate(45deg);
        margin:100px;
        overflow:hidden;
    }
    .MplayerContain {
        width: 100%;
        height: 100%;
        position:relative;
        box-sizing:border-box;
        background-size:cover;
        border-radius: $mainRadius;
        border-bottom-left-radius:$mainRadius;
        border-bottom-right-radius:$mainRadius;
        transform:rotate(-45deg);
    }
    .bgImage {
            position: absolute;
            width:142%;
            height:142%;
            transform:rotate(-45deg) translate(0px,-21%);
            transition:all 0.2s ease-in-out;
    }
    .fade-enter {
        opacity:0;
    }
    .fade-leave {
        opacity:0;
    }
    .mContent {
        width: 100%;
        box-sizing:border-box;
        position: absolute;
        top:0px;
        height:100%;
    }
    .mName,.mAuthor {
        color: white;
        font-size: 12px;
        font-weight:normal;
        text-align: center;
        width:100%;
        overflow:hidden;
        white-space: nowrap;
        text-overflow:ellipsis;
        font-family:"Microsoft YaHei","Open sans", "Segoe UI", "Segoe WP", Helvetica, Arial, sans-serif;
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
            color:white;
            transition: color 0.2s ease;
            vertical-align: middle;
            &:hover {
                color:$teal;
            }
        }
    }
    .mProcessBar {
        box-sizing:border-box;
        height: 4px;
        width:100%;
        background:rgba(255,255,255,0.4);
        border-radius:1px;
        position:absolute;
        cursor: pointer;
        left:0px;
        right:0px;
        top: 0px;
        bottom:0px;
        margin: auto;
    }
    .mBufferBar {
        position:absolute;
        width: 0%;
        height: 100%;
        background:rgba(255,255,255,0.7);
        transition:width 0.5s ease;
    }
    .mPlayedBar {
        position:absolute;
        width:0%;
        height: 100%;
        background:$teal;
    }
    .mTimeBox {
        box-sizing:border-box;
        width:100%;
        color:white;
        font-size: 0px;
        display:inline-block;
        text-align: center;
        vertical-align: middle;
        >div {
            font-size: 12px;
            line-height: 12px;
            font-family: "NanoCore";
            display: inline-block;
        }
    }
    .mPlayedTime {
        &:after {
            content:"/";
            color:white;
            display: inline-block;
            margin:0px 2px;
        }
    }
    .mVolume {
        box-sizing:border-box;
        color:white;
        width:100%;
        text-align: center;
        position:relative;
        &:hover {
            .mVolumeBar {
                opacity: 1;
                visibility: visible;
                will-change:transition;
            }
        }
        i {
            vertical-align: middle;
        }
    }
    .skip_next {
        position:absolute;
        display:block;
        width:20px;
        height:20px;
        top:0px;
        right:0px;
        bottom:0px;
        margin:auto;
        background:#252323;
        transform:translateX(240%) rotate(45deg);
        outline: 2px solid black;
        outline-offset:2px;
        &:before {
            content:"";
            background:teal;
            position:absolute;
            right:0px;
            left: 0px;
            top:0px;
            bottom:0px;
            margin:auto;
            width:50%;
            height:50%;
            transform:translate(22%,-22%);

        }
    }
    .skip_previous {
        position:absolute;
        display:block;
        width:20px;
        height:20px;
        top:0px;
        left:0px;
        bottom:0px;
        margin:auto;
        background:#252323;
        transform:translateX(-240%) rotate(45deg);
        outline: 2px solid black;
        outline-offset:2px;
        &:before {
            content:"";
            background:teal;
            position:absolute;
            right:0px;
            left: 0px;
            top:0px;
            bottom:0px;
            margin:auto;
            width:50%;
            height:50%;
            transform:translate(-22%,22%);

        }
    }
    .mVolumeBar {
        position:relative;
        width: 70px;
        height: 5px;
        background:rgba(255,255,255,0.5);
        cursor: pointer;
        display:inline-block;
        vertical-align: middle;
        left: 0px;
        right: 0px;
        margin:auto;
        border-radius:2px;
        transition: all 0.2s ease;
    }
    .mActiveBar {
        background:$teal;
        height: 100%;
        border-radius:2px;
        position:absolute;
        bottom:0px;
        width: 50%;
        transition:all 0.2s ease;
        &.muted {
            background:$gray;
        }
    }
    .mFeakeBar {
        width: 100%;
        height: 100%;
        position:absolute;
    }
    .strokeAnima {
        position:absolute;
        left: 0px;
        top: 0px;
        width:100%;
        height:100%;
        rect {
            stroke-width:5px;
            stroke:white;
            fill:transparent;
            stroke-dasharray: 1200;
            stroke-dashoffset: 1200;
            animation: dash 2s linear;
            transition:all 0.2s ease;
        }
    }
    @keyframes dash {
        100% {
            stroke-dashoffset: 0;
        }
    }
</style>
