<template>
    <section id="list">
        <div class="listCon" :class="[isPopUp ? 'popUp' : '']">
            <waterfall :line-gap="300" :min-line-gap="300" :max-line-gap="300" :single-max-width="300" :watch="listData" :auto-resize="true" align="center">
              <waterfall-slot v-for="(item,index) in listData" :width="item.preview_width" :height="item.preview_height" :order="index" move-class="item-move"
>
                    <figure :style="item.position" transition="stagger" stagger="100">
                        <figcaption>{{ item.width }} / {{ item.height }}</figcaption>
                        <a :href="item.url" download="123.png"><i class="icon-download"></i></a>
                        <img :src="item.current_url" alt="" @error="loadError($event)" @click.stop="clickActive($event,item)" :style="item.fitSize">
                    </figure>
              </waterfall-slot>
            </waterfall>
        </div>
        <v-loading :show='showLoading'></v-loading>
    </section>
</template>
<script>
    import { setSession, getSession, getLocal, setLocal, getPost, getSampleImg } from 'servers/servers.js';
    import { mapActions } from 'vuex';
    import vDialog from 'components/vDialog.vue';
    import vLoading from 'components/vLoading4.vue';
    import Waterfall from 'vue-waterfall/lib/waterfall.vue';
    import WaterfallSlot from 'vue-waterfall/lib/waterfall-slot.vue';
    import errorImage from 'images/loaderror.png';

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
    function position(width, height, node) { /* 根据图片大小，确定显示位置*/
        const rect = node.getBoundingClientRect();
        const wW = window.innerWidth;
        const wH = window.innerHeight;
        let left;
        let top;
        left = (wW - width) / 2 - rect.left;
        top = (wH - height) / 2 - rect.top;
        return {left, top};

    }
    export default {
        data() {
            return {
                listData: [],
                pages: 0,
                currentPage: 1,
                showLoading: true,
                isDialog: false,
                isPopUp: false,
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
        methods: {
            ...mapActions(['setTPage']),
            loadError(event) {
                event.target.src = errorImage;
                event.target.style.objectFit = 'contain';
            },
            async clickActive(event,item) {
                if (this.isPopUp) {
                    item.fitSize = {
                        width: item.preview_width + 'px',
                        height: item.preview_height + 'px'
                    };
                    item.position = {
                        width: item.preview_width + 'px',
                        height: item.preview_height + 'px'
                    }
                } else {
                    const size = fitSize(item.sample_width, item.sample_height);
                    const pos = position(size.fitW, size.fitH, event.target);
                    item.fitSize = {
                        width: size.fitW + 'px',
                        height: size.fitH + 'px'
                    };
                    item.position = {
                        width: size.fitW + 'px',
                        height: size.fitH + 'px',
                        transform: `translate(${pos.left}px,${pos.top}px)`,
                        position: 'fixed',
                        zIndex: 10
                    }
                    if (!item.loadedSample) {
                        const response = await getSampleImg('http:' + item.sample);
                        item.current_url = reponse.data.data_url;
                        item.loadedSample = true;
                    }
                }
                this.isPopUp =!this.isPopUp;
                // parent.classList.toggle('active');
            }
        },
        mounted() {
            const getData = async (currentPage, isSafe, tags) => {
                let response = await getPost(currentPage, isSafe, tags);
                response.data.images.forEach((val) => {
                    val.current_url = val.prev_url;
                    val.fitSize = {
                        width: val.preview_width + 'px',
                        height: val.preview_height + 'px'
                    }
                    val.position = {
                        width: val.preview_width + 'px',
                        height: val.preview_height + 'px'
                    }
                })
                // this.listData = response.data.images;
                this.setTPage(response.data.pages);
                this.pages = response.data.pages;
                this.showLoading = false;
            };
            getData();
        }
    };
</script>
<style lang="sass" scoped>
    @import "../assets/sass/components/_icon";
    $transitionTime: 0.4s;
    $transitionDelay:0.1s;
    $itemSize:305px;
    $itemMargin:2px;
    $itemColumn:4;
    $gap : 10px;
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
        figcaption {
            position: absolute;
        }
        figure {
            display:inline-block;
            background:white;
            cursor:pointer;
            transform-origin:center center;
            transition:all 0.4s ease;
            font-size: 16px;
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
            transition: all $transitionTime ease;
        }
        &.popUp {
            figure {
                transform:translateX(-100vw);
            }
        }
    }
    .item-move {
        transition: all .5s cubic-bezier(.55,0,.1,1);
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