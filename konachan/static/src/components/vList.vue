<template>
    <section id="list">
        <div class="listCon">
            <waterfall :line-gap="200" :min-line-gap="100" :max-line-gap="300" :single-max-width="300" :watch="listData" :auto-resize="true">
              <waterfall-slot v-for="item in listData" :width="item.preview_width" :height="item.preview_height" :order="$index"  >
                    <figure v-origin-style="item">
                        <!-- <figcaption>{{ item.width }} / {{ item.height }}</figcaption>
                        <!-- <a href="" @click.prevent="viewSampleImg(item)" ><i class="icon-eye"></i></a> -->
                        <!-- <a href="{{ item.url }}" download="123.png"><i class="icon-download"></i></a> -->
                        <img :src="item.prev_url" alt="" @error="loadError($event)" @click.stop="clickActive($event,item)" v-origin-style="item">
                    </figure>
              </waterfall-slot>
            </waterfall>
        </div>
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
    import Waterfall from 'vue-waterfall/lib/waterfall.vue';
    import WaterfallSlot from 'vue-waterfall/lib/waterfall-slot.vue';
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
                test:"hahah",
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
            Waterfall,
            WaterfallSlot,
            vDialog,
            vLoading
        },
        directives: {
            originStyle(value) {
                this.el.style.width = value.preview_width + 'px';
                this.el.style.height = value.preview_height + 'px';
            }
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
            clickActive(event,item) {
                const target = event.target;
                const parent = target.parentNode;
                const ancestor = parent.parentNode;
                const size = fitSize(item.sample_width, item.sample_height);
                parent.style.width = size.fitW + "px";
                parent.style.height = size.fitH + "px";
                parent.style.position = 'fixed';
                target.style.width = size.fitW + "px";
                target.style.height = size.fitH + "px";
                parent.classList.toggle('active');
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
    $transitionTime: 0.4s;
    $transitionDelay:0.1s;
    $itemSize:300px;
    $itemMargin:2px;
    $itemColumn:4;
    $gap : 10px;
    .vue-waterfall-slot {
        background: pink;
    }
    #list {
        margin: auto;
        // background: repeating-linear-gradient(-55deg,#222,#222 10px,#333 10px,#333 20px);
        position: relative;
        width:($itemColumn - 1) * $gap + $itemColumn * $itemSize;
    }
    .listCon {
        position:relative;
        font-size: 0px;
        font-family:'Aldo-SemiBold';
        width:100%;
        transform-style:preserve-3d;
        perspective:1000px;
        figure {
            border-radius: 5px;
            display:inline-block;
            background:white;
            cursor:pointer;
            transform-origin:center center;
            transition:all 0.4s ease-in-out;
            font-size: 16px;
            margin:5px;
            position: absolute;
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
                display:none;
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
            object-fit: cover;
            border-radius:5px;
            opacity: 0.2;
            transition: all $transitionTime ease;
        }
    }
    .staggered-transition {
        transform:rotateY(0deg);
    }
    .staggered-enter, .staggered-leave {
        opacity: 0;
        transform:rotateY(90deg);
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