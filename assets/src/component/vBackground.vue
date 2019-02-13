<template>
    <figure class="background" :style="{ height: listHeight }">
        <img :src="ablumImg" class="bgImage" @load="onLoadBackground($event)">
    </figure>
</template>
<script lang="ts">
import { State, Mutation } from 'vuex-class';
import { Component, Vue } from 'vue-property-decorator';
import { TBinding } from '~cModel/util';
import CSSVariable from '~cModule/cssVariable';
import * as Color from 'color';

// @ts-ignore: 类型错误
import * as Vibrant from 'node-vibrant';
import { Palette, Swatch } from '@vibrant/color';

@Component({
    // @ts-ignore: 类型错误
    directives: {
        fade: {
            // bind(el: HTMLElement): void {
            //     el.style.opacity = '0';
            //     el.addEventListener(
            //         'load',
            //         () => {
            //             el.style.opacity = '1';
            //         },
            //         { once: true }
            //     );
            // },
            update(el: HTMLElement, bingding: TBinding): void {
                const { oldValue } = bingding;
                const parent: HTMLElement = <HTMLElement>el.parentNode;
                const previousImg: HTMLElement = <HTMLElement>parent.querySelector('.fadeImage');
                if (previousImg) {
                    parent.removeChild(previousImg);
                    debugger;
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
    @State('listHeight') public listHeight!: string;
    @Mutation('SETTHEMECOLOR') public setThemeColor!: Function;

    public buildAllColor(color: string): void {
        this.setThemeColor(color);
        const baseColor: string = color;
        const colorObj: Color = Color(baseColor);
        const baseColorAlpha30: string = colorObj.fade(0.7)
            .string();
        const baseColorAlpha50: string = colorObj.fade(0.5)
            .string();
        const baseColorAlpha80: string = colorObj.fade(0.2)
            .string();
        const baseColorTint20: string = colorObj.lighten(0.2)
            .string();
        const baseColorTint10: string = colorObj.lighten(0.1)
            .string();
        const listToolBgColorTint: string = colorObj.fade(0.5)
            .string();
        const pageItemHoverColor: string = colorObj.fade(0.8)
            .string();
        const pageItemBreathColor1: string = colorObj.darken(0.05)
            .string();
        const pageItemBreathColor2: string = colorObj.darken(0.1)
            .string();
        CSSVariable.setValue('--themeBaseColor', baseColor);
        CSSVariable.setValue('--themeBaseColorAlpha30', baseColorAlpha30);
        CSSVariable.setValue('--themeBaseColorAlpha50', baseColorAlpha50);
        CSSVariable.setValue('--themeBaseColorAlpha80', baseColorAlpha80);
        CSSVariable.setValue('--themeBaseColorTint20', baseColorTint20);
        CSSVariable.setValue('--themeBaseColorTint10', baseColorTint10);
        CSSVariable.setValue('--themeListToolBgColorTint', listToolBgColorTint);
        CSSVariable.setValue('--themePageItemHoverColor', pageItemHoverColor);
        CSSVariable.setValue('--themePageItemBreathColor1', pageItemBreathColor1);
        CSSVariable.setValue('--themePageItemBreathColor2', pageItemBreathColor2);
    }

    public async onLoadBackground(e: Event): Promise<void> {
        const { target } = e;
        const v: Vibrant = new Vibrant((<HTMLImageElement>target).src);
        const palette: Palette = await v.getPalette();
        const color: string = (<Swatch>(<Palette>palette).Vibrant).hex;
        this.buildAllColor(color);
    }
}
</script>
<style lang="postcss">
.background {
    position: absolute;
    margin: 0;
    padding: 0;
    inline-size: 100%;
    min-block-size: 100vh;
    inset-inline-start: 0;
    inset-block-start: 0;
    filter: blur(5px);
}
.bgImage {
    display: block;
    inline-size: 100%;
    block-size: 100%;
    object-fit: cover;
    object-position: top center;
    transition: opacity 0.5s;
}
</style>
