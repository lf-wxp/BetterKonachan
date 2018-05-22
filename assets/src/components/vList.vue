<template>
    <section class="list">
        <div class="lCon">
            <waterfall :line-gap="200" :watch="items">
                <waterfall-slot 
                    v-for="(item, index) in items"
                    :width="item.width"
                    :height="item.height"
                    :order="index"
                    :key="item.id">
                    <figure>
                        <a :href="item.url" download="123.png"><i class="icon-download"></i></a>
                        <img class="lImg" :src="item.prev_url" alt="" @error="loadError($event)" @click.stop="clickActive($event,item)" :style="item.fitSize">
                        <figcaption>{{ item.width }} / {{ item.height }}</figcaption>
                    </figure>
                </waterfall-slot>
            </waterfall>
        </div>
    </section>
</template>
<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { getPost } from 'src/service';
import Waterfall from 'vue-waterfall/lib/waterfall.vue';
import WaterfallSlot from 'vue-waterfall/lib/waterfall-slot.vue';

@Component({
    components: {
        Waterfall,
        WaterfallSlot
    }
})
export default class VList extends Vue {
    items: any[] = [];

    async created() {
        const res = await getPost.http({
            params: {
                tags: '',
                page: 1,
                isSafe: false
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
figure {
    margin: 0;
}
.lImg {
    width: 100%;
    box-sizing: border-box;
    padding: 10px;
    height: auto;
    object-fit: contain;
}
</style>
