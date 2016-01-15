<template>
  <div id="wrap">
    <article>
      <v-header></v-header>
      <v-music :mplayer='mplayer'></v-music>
      <v-search></v-search>
    </article>
    <article>
      <section id="pager"></section>
      <section id="list"></section>
    </article>
    <article>
      <section id="setting"></section>
      <section id="footer"></section>
    </article>
  </div>
</template>

<script>
    const listSongs = [
        {
            track: 'http://m2.music.126.net/iAc8wPI00faApKXLDyYxpQ==/5748246790021526.mp3',
            title: 'song of 树海',
            pic: 'http://p4.music.126.net/-eutzq1FdXH-HFTRLR6IYg==/4425534301808090.jpg',
            artist: '树海'
        }, {
            track: 'http://m2.music.126.net/x7guWXyvnyca8XURgxfHeQ==/2840038534552546.mp3',
            title: 'さよならソリティア',
            pic: 'http://p3.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
            artist: '千葉紗子'
        }, {
            track: 'http://m2.music.126.net/G-c-mFpq0xhNHV_RKX9cUQ==/3275445146899527.mp3',
            title: 'Eternal Flower',
            pic: 'http://p4.music.126.net/HDmP_UJP2z5vWmFypBO49g==/1364493964967804.jpg',
            artist: '寺田はるひ'
        }, {
            track: 'http://m2.music.126.net/xkKtlx24OevXwjaBlAmPtA==/5744948255135159.mp3',
            title: 'radiance',
            pic: 'http://p3.music.126.net/1mawHaWZo97tsb0M6Hm1YQ==/931286348726485.jpg',
            artist: '川田まみ'
        }
    ];
    import vHeader from './components/vHeader.vue';
    import vMusic from './components/vMusic.vue';
    import vSearch from './components/vSearch.vue';
    export default {
        data() {
            return {
                msg: 'Hello from vue-loader!',
                mplayer: {
                    listSongs,
                    autoplay: true
                }
            };
        },
        components: {
            vHeader,
            vMusic,
            vSearch
        }
    };

</script>

<style lang="sass">
    @import "./assets/sass/base/_normalize";
    @import "./assets/sass/help/_helper";
    @import "./assets/sass/components/_font";
    #wrap {
        font-size: 20px;
        background: #282828;
        article {
            display: flex;
            flex-flow: row nowrap;
            justify-content:space-between;
            align-items: stretch;
            height: 250px;
            border-bottom:1px solid black;
            width: 100%;
        }
        section {
            position: relative;
            margin:10px;
            flex:1 1 auto;
            border-radius: 5px;
            box-sizing:border-box;
            background-size:cover;
            background-repeat:no-repeat;
            &:after {
                position: absolute;
                right: 10px;
                top: 10px;
                content:"\e1ad";
                font-family: 'icomoon' !important;
                speak: none;
                font-style: normal;
                font-weight: normal;
                font-variant: normal;
                text-transform: none;
                line-height: 1;
                -webkit-font-smoothing: antialiased;
            }
        }
    }
</style>
