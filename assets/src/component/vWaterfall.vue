<template>
    <div class="waterfall" :style="secStyle">
        <transition-group name="flip-list" tag="div" >
            <div v-for="l of items" :key='l.name'  :style="l.style" class="waterfallItem">
                <slot :item="l"></slot>
            </div>
        </transition-group>
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { IImageDom } from '~cModel/imageDom';
import { IImage } from '~model/image';

@Component
export default class VWaterfall extends Vue {
    public parentWidth: number = 0;
    public column: number = 0;
    public width: number = 0;
    public columnArray: number[] = [];

    @Prop() public list!: IImage[];

    @Prop({ required: true })
    public maxWidth!: number;

    @Prop({ required: true })
    public minWidth!: number;

    @Prop({ default: { width: 'width', height: 'height' } })
    public options!: { width: string; height: string };

    get secStyle(): { height: string } {
        const max: number = Math.max(...this.columnArray);

        return {
            height: `${max}px`
        };
    }
    get items(): IImageDom[] | void {
        if (this.parentWidth && this.list.length) {
            this.init();

            return this.list.map((item: IImage, i: number) => {
                const newItem: IImageDom = { ...item };
                const h: number =
                    newItem[this.options.height] /
                    newItem[this.options.width] *
                    this.width;
                const l: number = (i + 1) % this.column;
                newItem.styleW = this.width;
                newItem.styleH = h;
                const { x, y } = this.position(l, this.width, h);
                this.calculateColumnArray(h);
                newItem.style = {
                    width: `${this.width}px`,
                    height: `${h}px`,
                    transform: `translate(${x}px, ${y}px)`
                };

                return newItem;
            });
        }
    }

    public position(l: number, w: number, h: number): { x: number; y: number } {
        const min: number = Math.min(...this.columnArray);
        const index: number = this.columnArray.indexOf(min);
        const offsetX: number = index * this.width;
        const offsetY: number = min;

        return {
            x: offsetX,
            y: offsetY
        };
    }

    public calculateColumnArray(h: number): void {
        const min: number = Math.min(...this.columnArray);
        const index: number = this.columnArray.indexOf(min);
        this.columnArray.splice(index, 1, min + h);
    }

    public calculateColumn(): void {
        const l: number = this.parentWidth % this.maxWidth;
        let column: number;
        let width: number;
        if (l) {
            column = Math.ceil(this.parentWidth / this.maxWidth);
            width = this.parentWidth / column;
        } else {
            column = this.parentWidth / this.maxWidth;
            width = this.maxWidth;
        }
        this.width = width;
        this.column = column;
        if (width < this.minWidth) {
            this.column -= this.column;
            this.width = this.parentWidth;
        }
    }

    public init(): void {
        this.parentWidth = (<HTMLElement>this.$el.parentElement).clientWidth;
        this.calculateColumn();
        this.initColumnArray();
    }

    public initColumnArray(): void {
        let n: number = this.column;
        const ar: number[] = [];
        do {
            ar.push(0);
            n -= 1;
        } while (n > 0);
        this.columnArray = ar;
    }
    public mounted(): void {
        this.init();
        let handler: number;
        window.addEventListener('resize', () => {
            if (handler) {
                clearTimeout(handler);
            }
            handler = window.setTimeout(() => {
                this.init();
            }, 500);
        });
    }
}
</script>

<style lang="postcss" scoped>
.waterfall {
    position: relative;
    background: none;
    min-height: calc(100vh - 843px);
}
.waterfallItem {
    position: absolute;
    transition: transform 0.5s ease-in-out;
    left: 0;
    top: 0;
}
.flip-list-move {
    transition: transform 0.5s ease-in-out;
}
.flip-list-enter-active,
.flip-list-leave-active {
    transition: all 0.5s ease-in-out;
}
.flip-list-enter,
.flip-list-leave-to {
    opacity: 0;
}
</style>

