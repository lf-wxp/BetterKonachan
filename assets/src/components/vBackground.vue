<template>
    <figure>
        <img :src="ablumImg" class="bgImage" v-fade="ablumImg">
    </figure>
</template>
<script lang="ts">
    import Vue from 'vue';
    import { State } from 'vuex-class';
    import { Component } from 'vue-property-decorator';
    @Component({
        directives: {
            fade: {
                bind(el: HTMLElement) {
                    el.style.opacity = '0';
                    el.addEventListener('load', () => {
                        el.style.opacity = '1';
                    }, { once: true });
                },
                update(el, bingding) {
                    const { value, oldValue } = bingding;
                    const parent = el.parentNode as HTMLElement;
                    const previousImg = parent.querySelector('.fadeImage');
                    if (previousImg) {
                        parent.removeChild(previousImg);
                    }
                    if (oldValue) {
                        el.addEventListener('load', () => {
                            img.style.opacity = '0';
                        }, { once: true });
                        const img = new Image();
                        img.src = oldValue;
                        if (img.complete) {
                            img.style.opacity = '0';
                        }
                        img.className = 'bgImage fadeImage';
                        img.style.cssText = `
                            position: absolute;
                            top: 0;
                            left: 0;
                        `;
                        img.addEventListener('transitionend', () => {
                            parent.removeChild(img);
                            console.log('transitionend');
                        }, { once: true });
                        parent.appendChild(img);
                    }
                }
            }
        }
    })
    export default class vBackground extends Vue {
        @State('bgUrl') ablumImg!: string

    }
</script>
<style>
figure {
    position: absolute;
    margin: 0;
    padding:0;
    width: 100%;
    height: 70vh;
    left: 0;
    top: 0;
    filter: blur(5px);
    &:after {
        display: block;
        position: relative;
        background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0, #252323 100%);
        margin-top: -150px;
        height: 150px;
        width: 100%;
        content: '';
    }
}
.bgImage {
    display: block;
    width:100%;
    height: 100%;
    object-fit: cover;
    object-position: top center;
    transition: opacity .5s;
}
</style>
