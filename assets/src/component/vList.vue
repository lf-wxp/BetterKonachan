<template>
    <section class="list">
        <div class="lCon">
            <v-waterfall :list="items" :options="options" :max-width="300" :min-width="200">
                <figure slot-scope="{ item }">
                    <img class="lImg" v-load="item.prev_url"  alt="" @error="loadError($event)" @click.stop="clickActive($event,item)" >
                    <div class="lTool">
                        <p class="lInfo">{{ item.width }} / {{ item.height }}</p>
                        <a :href="item.url" download class="lDown" target="_blank"><i class="icon-download"></i></a>
                    </div>
                </figure>
            </v-waterfall>
            <v-loading v-if="isLoading"/>
        </div>
    </section>
</template>
<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';
import { getPost } from '~service';
import { State, Mutation } from 'vuex-class';
import vWaterfall from '~component/vWaterfall.vue';
import vLoading from '~component/vLoading.vue';
import loadErrorImage from '~image/loaderror.png';

import { IImageList, IImage } from '~model/image';
import { IServiceHttpRes, isValidRes } from '~cModel/service';
import { IResponse } from '~model/response';
import { TBinding } from '~cModel/util';


const load: {
    bind(el: HTMLElement, binding: TBinding): void;
} = {
    bind(el: HTMLImageElement, binding: TBinding): void {
        el.style.cssText = `
            opacity: 0;
        `;
        el.addEventListener('load', () => {
            el.style.cssText = `
                opacity: 1;
                transition: opacity .2s ease;
            `;
        }, { once: true });
        el.src = binding.value;
        el.addEventListener('transitionend', () => {
            el.style.cssText = '';
        }, { once: true });
    }
};

@Component({
    // @ts-ignore: 类型错误
    directives: {
        load
    },
    components: {
        vWaterfall,
        vLoading
    }
})
export default class VList extends Vue {
    @State public security!: string;
    @State public page!: number;
    @State public tags!: string;
    @Mutation('SETTOTALPAGE') public setTotalPage!: Function;
    public rawItems: IImage[] = [];
    public isLoading: boolean = true;
    public options: object = {
        width: 'preview_width',
        height: 'preview_height'
    };

    get items(): IImage[] {
        return this.rawItems.filter((item: IImage) => {
            if (this.security) {
                return item.security;
            } else {
                return true;
            }
        });
    }

    @Watch('page')
    public onPage(): void {
        this.getData();
    }

    @Watch('tags')
    public onTags(): void {
        this.getData();
    }

    public async getData(): Promise<void> {
        getPost.cancel();
        this.isLoading = true;
        const res: IServiceHttpRes<IResponse<IImageList>> = await getPost.http({
            params: {
                tags: this.tags,
                page: this.page
            }
        });
        if (isValidRes<IImageList>(res) && res.status === 200) {
            this.isLoading = false;
            this.rawItems = res.data.data.images;
            this.setTotalPage(res.data.data.pages);
        }
    }

    public loadError(e: Event): void {
        const target: HTMLImageElement = <HTMLImageElement>e.currentTarget;
        target.src = loadErrorImage;
    }

    public async created(): Promise<void> {
        this.getData();
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
.list {
    background: none;
}
.lCon {
    position: relative;
    background: none;
    min-height: calc(100vh - 843px);
}
.vue-waterfall-slot {
    overflow: hidden;
    padding: 5px;
}
figure {
    margin: 0;
    border: calc(var(--gap) / 2) solid transparent;
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
