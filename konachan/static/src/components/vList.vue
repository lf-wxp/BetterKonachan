<template>
    <section id="list">
        <ul class="listCon">
            <li v-for="item in listData" transition="staggered" stagger="10">
                <img :src="item.prev_url" alt="">
                <div class="listAction"><span>{{ item.width }}x{{ item.height }}</span>
                <a href="" @click.prevent="viewSampleImg(item)" >preview<i class="icon-remove_red_eye"></i></a>
                <a href="{{ item.url }}" download="123.png">download<i class="icon-get_app"></i></a></div>
            </li>
        </ul>
        <v-loading :show='showLoading'></v-loading>
        <v-dialog :show.sync='isDialog' :load-success='loadSampleSuccess'>
            <div class="sampleCon" :class="loadSampleSuccess ? 'showOff' : ''" slot="image" :style="sampleSize">
                <img :src="sampleDataUrl" alt="">
            </div>
        </v-dialog>
    </section>
</template>
<script>
    import { setSession, getSession, getLocal, setLocal, getPost, getSampleImg } from '../servers/servers.js';
    import vDialog from './vDialog.vue';
    import vLoading from './vLoading4.vue';
    function fitSize(width, height) { /* 根据窗口大小 调整弹出框大小 */
        const wW = window.innerWidth - 120;
        const wH = window.innerHeight - 120;
        let fitW;
        let fitH;
        if (width <= wW && height <= wH) {
            fitW = width;
            fitH = height;
        }
        if (width > wW && height <= wH) {
            fitW = wW;
            fitH = wW * height / width;
        }
        if (width <= wW && height > wH) {
            fitW = wH * width / height;
            fitH = wH;
        }
        if (width > wW && height > wH) {
            fitW = wW;
            fitH = wW * height / width;
            return fitSize(fitW, fitH);
        }
        return { fitW, fitH };
    }
    export default {
        data() {
            return {
                listData: [],
                pages: 0,
                currentPage: 1,
                showLoading: true,
                isDialog: false,
                loadSampleSuccess: false,
                sampleDataUrl: '',
                sampleSize: {
                    width: '300px',
                    height: '200px'
                }
            };
        },
        components: {
            vDialog,
            vLoading
        },
        methods: {
            viewSampleImg(item) {/* 弹出框预览图片 */
                this.isDialog = true;
                this.loadSampleSuccess = false;
                this.sampleDataUrl = '';
                this.sampleSize.width = '300px';
                this.sampleSize.height = '200px';
                const size = fitSize(item.sample_width, item.sample_height);
                getSampleImg((reponse) => {
                    this.sampleDataUrl = reponse.data.data_url;
                    this.loadSampleSuccess = true;
                    this.sampleSize.width = size.fitW + 'px';
                    this.sampleSize.height = size.fitH + 'px';
                }, item.sample);
            }
        },
        watch: {
            pages(val) {
                setSession.pages = val;
            }
        },
        ready() {
            const getData = (currentPage, isSafe, tags) => {
                getPost((response) => {
                    this.listData = response.data.images;
                    this.pages = response.data.pages;
                    this.showLoading = false;
                    /* storage the page info */
                    setSession('currentPage', currentPage);
                    if (getLocal('rememberPage')) {
                        setLocal('currentPage', currentPage);
                    }
                    this.$dispatch('listReady', { pages: this.pages, currentPage });
                }, currentPage, isSafe, tags);
            };
            setSession('tags', '');
            let initPage = 1;
            let isSafe = true;
            if (getLocal('rememberPage')) {
                initPage = getLocal('currentPage') ? getLocal('currentPage') : 1;
            } else {
                initPage = getSession('currentPage') ? getSession('currentPage') : 1;
            }
            if (getLocal('securityMode') !== undefined) {
                isSafe = getLocal('securityMode');
            } else {
                setLocal('securityMode', true);
            }
            getData(Number(initPage), isSafe, '');
            this.$on('invoke', (data) => {
                const tags = getSession('tags');
                const isSafe = getLocal('securityMode');
                this.showLoading = true;
                getData(data.currentPage, isSafe, tags);
            });
        }
    };
</script>
<style lang="sass" scope>
    #list {
        margin-left: 0px!important;
        width: 100%;
        background: repeating-linear-gradient(-55deg,#222,#222 10px,#333 10px,#333 20px);
        position: relative;
        &:before {
            content:"";
            position: absolute;
            width: 100%;
            height: 100%;
            background-color:rgba(0,0,0,0.7);
            border-radius:5px;
            z-index: 0;
        }
        &:after {
            content:"\e8a7"!important;
            color: white;
        }
    }
    .listCon {
        display: flex;
        justify-content: space-between;
        flex-flow: row wrap;
        align-items: stretch;
        position:relative;
        li {
            flex:1 0 auto;
            border-radius: 5px;
            margin-bottom: 10px;
            height: 150px;
            margin: 5px;
            position: relative;
            overflow: hidden;
            transition:all 0.2s ease;
            &:hover {
                .listAction {
                    transform: translateY(0%);
                    opacity: 1;
                }
                img {
                    transform: translateY(-34px);
                    border-bottom-left-radius: 0px;
                    border-bottom-right-radius:0px;
                }
            }
        }
        img {
            display: block;
            object-fit: cover;
            width: 100%;
            height: 100%;
            min-width: 100px;
            border-radius:5px;
            transition: all 0.2s ease;
        }
    }
    .listAction {
        font-size: 0px;
        font-family: 'diner-regularregular';
        position: absolute;
        bottom:0px;
        left: 0px;
        width: 100%;
        box-sizing:border-box;
        opacity: 0;
        transform: translateY(100%);
        transition: all 0.2s ease;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius:5px;
        span,a {
            display: inline-block;
            font-size: 14px;
            font-family: inherit;
            color:white;
            text-transform:uppercase;
            border:0px;
            vertical-align: top;
            box-sizing:border-box;
            text-align: center;
            height: 34px;

        }
        span {
            background-color:rgba(#39CCCC,0.6);
            line-height: 39px;
            font-size: 20px;
            letter-spacing: 3px;
            width:calc(100% - 180px);

        }
        a {
            font-size: 20px;
            padding: 5px;
            background-color:rgba(darken(#39CCCC,5%),0.6);
            cursor: pointer;
            letter-spacing: 2px;
            width: 90px;
            line-height: 30px;
            transition:all 0.2s ease;
            &:nth-of-type(2) {
                background-color:rgba(darken(#39CCCC,10%),0.6);
            }
            &:hover {
                background-color:rgba(#39CCCC,0.8);
            }
        }
        i {
            margin-left: 3px;
        }
    }
    .staggered-transition {
        transition: all 0.5s ease;
    }
    .staggered-enter, .staggered-leave {
        opacity: 0;
    }
    .sampleCon {
        transition: all 0.2s ease-in-out;
        opacity: 0;
        img {
            width:100%;
            height: 100%;
        }
        &.showOff {
            opacity: 1;
        }
    }
</style>