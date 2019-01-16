<template>
    <figure class="background">
        <img :src="ablumImg" class="bgImage" v-fade="ablumImg">
    </figure>
</template>
<script lang="ts">
import { State } from 'vuex-class';
import { Component, Vue } from 'vue-property-decorator';
import { TBinding } from '~cModel/util';

@Component({
    // @ts-ignore: 类型错误
    directives: {
        fade: {
            bind(el: HTMLElement): void {
                el.style.opacity = '0';
                el.addEventListener(
                    'load',
                    () => {
                        el.style.opacity = '1';
                    },
                    { once: true }
                );
            },
            update(el: HTMLElement, bingding: TBinding): void {
                const { oldValue } = bingding;
                const parent: HTMLElement = <HTMLElement>el.parentNode;
                const previousImg: HTMLElement = <HTMLElement>parent.querySelector('.fadeImage');
                if (previousImg) {
                    parent.removeChild(previousImg);
                }
                if (oldValue) {
                    el.addEventListener(
                        'load',
                        () => {
                            img.style.opacity = '0';
                        },
                        { once: true }
                    );
                    const img: HTMLImageElement = new Image();
                    img.src = <string>oldValue;
                    if (img.complete) {
                        img.style.opacity = '0';
                    }
                    img.className = 'bgImage fadeImage';
                    img.style.cssText = `
                            position: absolute;
                            top: 0;
                            left: 0;
                        `;
                    img.addEventListener(
                        'transitionend',
                        () => {
                            parent.removeChild(img);
                        },
                        { once: true }
                    );
                    parent.appendChild(img);
                }
            }
        }
    }
})
export default class VBackground extends Vue {
    @State('bgUrl') public ablumImg!: string;
}
</script>
<style>
.background {
    position: absolute;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100vh;
    left: 0;
    top: 0;
    filter: blur(5px);
    /* &:after {
        display: block;
        position: relative;
        background-image: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0) 0,
            #252323 100%
        );
        margin-top: -150px;
        height: 150px;
        width: 100%;
        content: '';
    } */
}
.bgImage {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top center;
    transition: opacity 0.5s;
}
</style>
