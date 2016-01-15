<template>
    <section id="Mmusic" class="mPlayer">
        <div class="MplayerContain" :style="initData.bgImg">
            <div class="mContent">
                <h1 class="mAuthor">{{ initData.artist }}</h1>
                <h1 class="mName">{{ initData.title }}</h1>
                <div class="mAction">
                    <i class="icon-skip_previous" @click.stop="prevSong"></i>
                    <i :class="initData.paused ? 'icon-pause' : 'icon-play_arrow'" @click.stop="playPause"></i>
                    <i class="icon-skip_next" @click.stop="nextSong"></i>
                    <i :class="initData.playOrder" @click.stop="switchPlayOrder"></i>
                </div>
                <div class="mFlex">
                    <div class="mProcessBar" @click.stop="pickTime($event)">
                        <div class="mBufferBar" :style="initData.bufferedPercentage"></div>
                        <div class="mPlayedBar" :style="initData.playedPercentage"></div>
                    </div>
                    <div class="mTimeBox">
                        <div class="mPlayedTime">{{ initData.playedTime }}</div>
                        <div class="mTotalTime">{{ initData.totalTime }}</div>
                    </div>
                    <div class="mVolume">
                        <i :class="initData.muted ? 'icon-volume_off' : 'icon-volume_up'" @click.stop="muted()"></i>
                        <div class="mVolumeBar">
                            <div class="mActiveBar" :class="initData.muted ? 'muted' : ''" :style="initData.volumePercentage"></div>
                            <div class="mFeakeBar" @click.stop="pickVolume($event)"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
    // import rgbimg from '../assets/images/4425534301808090.jpg';
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
            this.audio.volume = Number.parseInt(this.defaultOpts.vueData.volumePercentage.height, 10) / 100;
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
            this.defaultOpts.vueData.bgImg.backgroundImage = `url(${currentSong.pic})`;
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
                const volumeBarHeight = document.querySelector('.mFeakeBar').clientHeight;
                const percentage = (volumeBarHeight - event.offsetY) / volumeBarHeight;
                this.defaultOpts.vueData.volumePercentage.height = percentage * 100 + '%';
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
    const initData = {
        bufferedPercentage: { width: '0%' },
        playedPercentage: { width: '0%' },
        volumePercentage: { height: '50%' },
        playedTime: '00:00',
        totalTime: '00:00',
        bgImg: { backgroundImage: '' },
        muted: false,
        paused: true,
        title: '',
        artist: '',
        playOrder: {
            'icon-repeat': true,
            'icon-repeat_one': false,
            'icon-shuffle': false
        }

    };
    export default {
        data() {
            return {
                initData,
                mPlayer: new Mplayer(Object.assign({}, this.mplayer, { vueData: initData }))
            };
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
            }
        },
        props: ['mplayer'],
        ready() {
            this.mPlayer.init();
        }
    };

</script>
<style lang="sass">
    @import "../assets/sass/components/_colors";

    $icon-loop: "\e028";
    $icon-pause: "\e034";
    $icon-play_arrow: "\e037";
    $icon-repeat: "\e040";
    $icon-repeat_one: "\e041";
    $icon-replay: "\e042";
    $icon-shuffle: "\e043";
    $icon-skip_next: "\e044";
    $icon-skip_previous: "\e045";
    $icon-volume_off: "\e04f";
    $icon-volume_up: "\e050";
    $icon-media-pause: "\e900";
    @font-face {
        font-family: 'icomoon';
        src:    url('../assets/fonts/icomoon.eot?d0fho6');
        src:    url('../assets/fonts/icomoon.eot?d0fho6#iefix') format('embedded-opentype'),
            url('../assets/fonts/icomoon.ttf?d0fho6') format('truetype'),
            url('../assets/fonts/icomoon.woff?d0fho6') format('woff'),
            url('../assets/fonts/icomoon.svg?d0fho6#icomoon') format('svg');
        font-weight: normal;
        font-style: normal;
    }

    i {
        /* use !important to prevent issues with browser extensions that change fonts */
        font-family: 'icomoon' !important;
        speak: none;
        font-style: normal;
        font-weight: normal;
        font-variant: normal;
        text-transform: none;
        line-height: 1;
        transition:transform 0.2s ease;
        /* Better Font Rendering =========== */
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    .icon-loop {
        &:before {
            content: $icon-loop;
        }
    }
    .icon-pause {
        &:before {
            content: $icon-pause;
        }
    }
    .icon-play_arrow {
        &:before {
            content: $icon-play_arrow;
        }
    }
    .icon-repeat {
        &:before {
            content: $icon-repeat;
        }
    }
    .icon-repeat_one {
        &:before {
            content: $icon-repeat_one;
        }
    }
    .icon-replay {
        &:before {
            content: $icon-replay;
        }
    }
    .icon-shuffle {
        &:before {
            content: $icon-shuffle;
        }
    }
    .icon-skip_next {
        &:before {
            content: $icon-skip_next;
        }
    }
    .icon-skip_previous {
        &:before {
            content: $icon-skip_previous;
        }
    }
    .icon-volume_off {
        &:before {
            content: $icon-volume_off;
        }
    }
    .icon-volume_up {
        &:before {
            content: $icon-volume_up;
        }
    }
    .icon-media-pause {
        &:before {
            content: $icon-media-pause;
        }
    }
    i {
        cursor: pointer;
    }
    $mainRadius:5px;
    $mWidth:360px;
    $mHeight:220px;
    #Mmusic {
        height: $mHeight;
        position:relative;
        flex:0 0 $mWidth!important;
        margin-left: 0px!important;
        margin-right: 0px!important;
    }
    .MplayerContain {
        overflow: hidden;
        width: 100%;
        height: 100%;
        position:relative;
        box-sizing:border-box;
        background-size:cover;
        border-radius: $mainRadius;
        border-bottom-left-radius:$mainRadius;
        border-bottom-right-radius:$mainRadius;
    }
    .mFlex {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        align-items: center;
    }
    .mContent {
        position:absolute;
        bottom:0px;
        width: 100%;
        box-sizing:border-box;
        padding: 20px;
    }
    .mName,.mAuthor {
        color: white;
        font-size: 12px;
        font-weight:normal;
        width:100%;
    }
    .mName {
        font-size: 16px;
    }
    .mAction {
        width: 100%;
        i {
            color:white;
        }
    }
    .mProcessBar {
        flex:1 auto 1;
        box-sizing:border-box;
        height: 4px;
        background:rgba(255,255,255,0.4);
        border-radius:1px;
        position:relative;
        cursor: pointer;
        width: 70%;

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
        flex:1 auto 0;
        box-sizing:border-box;
        width:70px;
        color:white;
        font-size: 0px;
        >div {
            font-size: 12px;
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
        flex:1 20px 0;
        box-sizing:border-box;
        color:white;
        position:relative;
        &:hover {
            .mVolumeBar {
                opacity: 1;
                visibility: visible;
                will-change:transition;
            }
        }
    }
    .mVolumeBar {
        position:absolute;
        bottom:25px;
        width: 5px;
        height: 50px;
        background:rgba(255,255,255,0.5);
        cursor: pointer;
        left: 0px;
        right: 0px;
        margin:auto;
        border-radius:2px;
        opacity: 0;
        visibility: hidden;
        transition: all 0.2s ease;
    }
    .mActiveBar {
        background:$teal;
        height: 50%;
        border-radius:2px;
        position:absolute;
        bottom:0px;
        width: 100%;
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

</style>
