<template>
    <div class="waterfall" :style="secStyle">
        <transition-group name="flip-list" tag="div" >
            <div v-for="(l, i) of items" :key='i'  :style="l.style" class="waterfallItem">
                <slot :item="l"></slot>
            </div>
        </transition-group>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component
export default class Waterfall extends Vue {
    parentWidth: number = 0;
    column: number = 0;
    width: number = 0;
    columnArray: number[] = [];

    @Prop() list!: any[];

    @Prop({ required: true })
    maxWidth!: number;

    @Prop({ required: true })
    minWidth!: number;

    @Prop({ default: { width: 'width', height: 'height' } })
    options!: { width: string; height: string };

    get secStyle() {
        const max = Math.max(...this.columnArray);
        return {
            height: `${max}px`
        };
    }
    get items() {
        if (this.parentWidth && this.list.length) {
            this.init();
            return this.list.map((item, i) => {
                const h =
                    item[this.options.height] /
                    item[this.options.width] *
                    this.width;
                const l = (i + 1) % this.column;
                item.w = this.width;
                item.h = h;
                const { x, y } = this.position(l, this.width, h);
                this.calculateColumnArray(h);
                item.style = {
                    width: `${this.width}px`,
                    height: `${h}px`,
                    transform: `translate(${x}px, ${y}px)`
                };
                return item;
            });
        }
    }

    position(l: number, w: number, h: number) {
        const min = Math.min(...this.columnArray);
        const index = this.columnArray.indexOf(min);
        const offsetX = index * this.width;
        const offsetY = min;
        return {
            x: offsetX,
            y: offsetY
        };
    }

    calculateColumnArray(h: number) {
        const min = Math.min(...this.columnArray);
        const index = this.columnArray.indexOf(min);
        this.columnArray.splice(index, 1, min + h);
    }

    calculateColumn() {
        const l = this.parentWidth % this.maxWidth;
        let column;
        let width;
        if (l) {
            column = Math.ceil(this.parentWidth / this.maxWidth);
            width = this.parentWidth / column;
        } else {
            column = this.parentWidth / this.maxWidth;
            width = this.maxWidth;
        }
        this.width = width;
        this.column = column;
    }

    init() {
        this.parentWidth = (<HTMLElement>this.$el.parentElement).clientWidth;
        alert(this.parentWidth);
        this.calculateColumn();
        this.initColumnArray();
    }

    initColumnArray() {
        let n = this.column;
        const ar = [];
        do {
            ar.push(0);
            n--;
        } while (n > 0);
        this.columnArray = ar;
    }
    mounted() {
        this.init();
        let handler: any;
        window.addEventListener('resize', () => {
            if (handler) {
                clearTimeout(handler);
            }
            handler = setTimeout(() => {
                this.init();
                console.log('init');
            }, 500);
        });
    }
}
</script>

<style scoped>
.waterfall {
    position: relative;
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

