<template>
    <section class="list">
        <div class="lCon">
            <waterfall>
                <figure v-for="(item, index) of items" :key="index">
                    <img class="lImg" :src="item.prev_url" alt="" @error="loadError($event)" @click.stop="clickActive($event,item)" :style="item.fitSize">
                    <div class="lTool">
                        <p class="lInfo">{{ item.width }} / {{ item.height }}</p>
                        <a :href="item.url" download="123.png" class="lDown"><i class="icon-download"></i></a>
                    </div>
                </figure>
            </waterfall>
            <!-- <waterfall :line-gap="200" :watch="items">
                <waterfall-slot 
                    v-for="(item, index) in items"
                    :width="item.width"
                    :height="item.height"
                    :order="index"
                    :key="item.id">
                    
                </waterfall-slot>
            </waterfall> -->
        </div>
    </section>
</template>
<script lang="ts">
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { getPost } from 'src/service';
import { State } from 'vuex-class';
import Waterfall from './vWaterfall';

@Component({
    components: {
        Waterfall,
    },
})
export default class VList extends Vue {
    @State security!: string;
    items: any[] = [];
    @Watch('security')
    onSecurity(val: boolean) {
        console.log(this);
    }
    async created() {
        const res = await getPost.http({
            params: {
                tags: '',
                page: 1
            }
        });
        this.items = res.data.images;
    }
}

// function fitSize(width, height) {
//     /* 根据窗口大小 调整弹出框大小 */
//     const wW = window.innerWidth - 120;
//     const wH = window.innerHeight - 120;
//     let fitW;
//     let fitH;
//     if (width <= wW && height <= wH) {
//         fitW = width;
//         fitH = height;
//     }
//     if (width > wW && height <= wH) {
//         fitW = wW;
//         fitH = wW * height / width;
//     }
//     if (width <= wW && height > wH) {
//         fitW = wH * width / height;
//         fitH = wH;
//     }
//     if (width > wW && height > wH) {
//         fitW = wW;
//         fitH = wW * height / width;
//         return fitSize(fitW, fitH);
//     }
//     return { fitW, fitH };
// }
// function position(width, height, node) {
//     /* 根据图片大小，确定显示位置*/
//     const rect = node.getBoundingClientRect();
//     const wW = window.innerWidth;
//     const wH = window.innerHeight;
//     let left;
//     let top;
//     left = (wW - width) / 2 - rect.left;
//     top = (wH - height) / 2 - rect.top;
//     return { left, top };
// }
</script>
<style scoped>
:root {
    --size: 25px;
    --nsize: -25px;
    --infoBg: color(#39cccc a(50%));
    --gap: 10px;
}
.lCon {
}
.vue-waterfall-slot {
    overflow: hidden;
    padding: 5px;
}
figure {
    margin: 0;
    border: calc(var(--gap) / 2) solid transparent;
    width: 16.66667%;
    /* max-width: 250px; */
    box-sizing: border-box;
    border-radius: 2px;
    overflow: hidden;
    position: relative;
    &:hover {
        & .lImg,
        & .lTool {
            transform: translateY(var(--nsize));
        }
    }
}
.lTool {
    position: absolute;
    display: flex;
    height: var(--size);
    width: 100%;
    justify-content: flex-start;
    flex-flow: row nowrap;
    align-items: stretch;
    transition: transform 0.2s ease;
    background: var(--infoBg);
}
.lInfo {
    flex: 1 1 auto;
    font-size: 12px;
    color: white;
    line-height: var(--size);
    text-align: center;
}
.lDown {
    flex: 0 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--size);
    color: white;
    font-size: 14px;
    & i {
        flex: 0 0 auto;
    }
}
.lImg {
    display: block;
    width: 100%;
    box-sizing: border-box;
    height: 100%;
    border-radius: 2px;
    object-fit: cover;
    cursor: pointer;
    transition: transform 0.2s ease;
}
</style>
