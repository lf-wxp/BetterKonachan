<template>
    <section id="list">
        <ul class="listCon">
            <li v-for="item in listData" transition="staggered" stagger="10">
                <div class="infoW"><span>{{ item.width }}</span></div>
                <div class="infoH"><span>{{ item.height }}</span></div>
                <a href="" @click.prevent="viewSampleImg(item)" ><i class="icon-eye"></i></a>
                <a href="{{ item.url }}" download="123.png"><i class="icon-download"></i></a>
                <div class="imgCon" @click.stop="clickActive($event)">
                    <img :src="item.prev_url" alt="" @error="loadError($event)" >
                </div>
            </li>
            <div class="bgDimmer"></div>
        </ul>
        <v-loading :show='showLoading'></v-loading>
    </section>
    <v-dialog :show.sync='isDialog' :load-success='loadSampleSuccess' :sample-size="sampleSize" :sample-position="samplePosition" >
        <div class="sampleCon" :class="loadSampleSuccess ? 'showOff' : ''" slot="image" :style="sampleSize">
            <img :src="sampleDataUrl" alt="">
        </div>
    </v-dialog>
</template>
<script>
    import { setSession, getSession, getLocal, setLocal, getPost, getSampleImg } from '../servers/servers.js';
    import vDialog from './vDialog.vue';
    import vLoading from './vLoading4.vue';
    import errorImage from '../assets/images/loaderror.png';
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
                    width: '150px',
                    height: '150px'
                },
                samplePosition:{

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
                this.sampleSize.width = '150px';
                this.sampleSize.height = '150px';
                const size = fitSize(item.sample_width, item.sample_height);
                this.sampleDataUrl = item.prev_url;
                // getSampleImg((reponse) => {
                //     this.sampleDataUrl = reponse.data.data_url;
                //     this.loadSampleSuccess = true;
                //     this.sampleSize.width = size.fitW + 'px';
                //     this.sampleSize.height = size.fitH + 'px';
                // }, item.sample);
            },
            loadError(event) {
                event.target.src = errorImage;
                event.target.style.objectFit = 'contain';
            },
            clickActive(event) {
                let target = event.target;
                let parent = target.parentNode;
                let ancestor = parent.parentNode;;
                this.samplePosition = parent.getBoundingClientRect();
                console.log(this.samplePosition);
                let dimmer = document.querySelector('.bgDimmer');
                dimmer.classList.toggle('active');
                ancestor.classList.toggle('active');
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
<style lang="sass" scoped>
    @import "../assets/sass/components/_icon";
    $transitionTime: 0.2s;
    $transitionDelay:0.1s;
    $itemSize:150px;
    $itemMargin:2px;
    $itemNum:4;
    #list {
        margin-left: 0px;
        width: ($itemSize + $itemMargin * 2) * $itemNum;
        height:($itemSize + $itemMargin * 2) * $itemNum;
        margin-left:500px;
        transform-origin:left top;
        // transform:rotate(45deg);
        // background: repeating-linear-gradient(-55deg,#222,#222 10px,#333 10px,#333 20px);
        position: relative;
    }
    .listCon {
        position:relative;
        font-size: 0px;
        font-family:'Aldo-SemiBold';
        width:100%;
        height:100%;
        transform-style:preserve-3d;
        perspective:1000px;

        li {
            border-radius: 5px;
            margin-bottom: $itemMargin * 2;
            margin: $itemMargin;
            width:150px;
            display:inline-block;
            height: 150px;
            position: relative;
            transition:all 0.2s ease;
            background:white;
            cursor:pointer;
            transform-origin:center center;
            transition:all $transitionTime ease;
            font-size: 16px;
            &.active {
                transform:translateZ(10px) scale(1.1);
                z-index: 2;
                .infoW {
                    transform:translateX(-100%);
                    transition-delay: $transitionDelay;
                }
                .infoH {
                    transform:translateY(-100%);
                    transition-delay: $transitionDelay * 2;
                }
                >a {
                    &:first-of-type {
                        transform:translateY(-100%);
                        transition-delay: $transitionDelay * 3;
                    }
                    &:last-of-type {
                        transform:translateX(100%);
                        transition-delay: $transitionDelay * 4;
                    }
                }
            }
            $actionSize:35px;
            >a {
                width:$actionSize;
                height:$actionSize;
                background:teal;
                position:absolute;
                right: 0px;
                top:0px;
                transition: all $transitionTime ease;
                color:white;
                i {
                    width:100%;
                    height:100%;
                    transform:rotate(-45deg);
                    position:absolute;
                    text-align: center;
                    line-height: $actionSize;
                }
            }
        }
        img {
            display: block;
            transform:rotate(-45deg) translateY(-20.56%);
            object-fit: cover;
            width: 141%;
            height: 141%;
            min-width: 100px;
            border-radius:5px;
            transition: all $transitionTime ease;
        }
        div[class^='info'] {
            $infoSize:35px;
            span {
                width:141%;
                height:141%;
                font-family: 'ZagRegular';
                display:block;
                text-align: center;
                line-height: 1.41 * $infoSize;
                transform:rotate(-45deg) translateY(-20.56%);
            }
            font-size: 14px;
            width:$infoSize;
            height:$infoSize;
            color:white;
            background:teal;
            position:absolute;
            left: 0px;
            top:0px;
            transition:all $transitionTime ease;
        }
        .infoW {

        }
        .infoH {

        }
    }
    .bgDimmer {
        background:rgba(0,0,0,0.7);
        position:absolute;
        width:100%;
        height:100%;
        left:0px;
        top:0px;
        visibility: hidden;
        opacity:0;
        transition:all $transitionTime $transitionTime ease;
        &.active{
            visibility:visible;
            opacity:1;
        }
    }
    .imgCon {
        width:100%;
        height:100%;
        overflow:hidden;
        background: repeating-linear-gradient(-55deg,#222,#222 10px,#333 10px,#333 20px);
    }
    .staggered-transition {
        transition: all 0.5s ease;
    }
    .staggered-enter, .staggered-leave {
        opacity: 0;
    }
    .sampleCon {
        transition: all $transitionTime ease-in-out;
        font-size: 0px;
        opacity: 1;
        img {
            width:100%;
            height: 100%;
            display:block;
            object-fit:cover;
        }
        &.showOff {
            opacity: 1;
        }
    }
</style>