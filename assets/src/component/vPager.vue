<template>
    <section class="pager" :class="[ isActive ? 'active':'']" v-draggable>
        <span class="pNav" @click="invoke(cPage - 1)" :class="[cPage - 1 ? '':'disabled']">
            <i></i>
        </span>
        <span class="pNav" @click="invoke(cPage + 1)" :class="[tPage - cPage > 0 ? '':'disabled']">
            <i></i>
        </span>
        <div class="pCon">
            <transition-group tag="ul" name="page" class="pBox">
                <li class="pItem" @click="invoke(item)" v-for="item of pageArray" :key="item" :class="[ cPage == item ? 'current' : '', fontClass]">
                    <span class="pItemText">{{item}}</span>
                </li>
            </transition-group>
        </div>
        <form class="pGoto" novalidate>
            <em class="pGotoEm"></em>
            <div class="pGotoDiv">
                <span class="pGotoSpan">{{tPage}}</span>
            </div>
            <div class="pGotoDiv">
                <input class="pGotoInput" type="text" placeholder="page" name="pager" autocomplete="off" @input="filterInput($event)">
            </div>
            <button class="pBtn" @click.prevent="goTo">
                <span></span>
            </button>
        </form>
        <div class="pHolder"></div>
    </section>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';
import { Draggable } from 'draggable-vue-directive';

@Component({
    directives: {
        Draggable
    }
})
export default class VPager extends Vue {
    public toPage: number = 0;
    public size: number = 4;
    @State public page!: number;
    @State('totalPage') public tPage!: number;
    @Mutation('SETPAGE') public setCPage!: Function;

    get fontClass(): { middle: boolean } {
        const data: { middle: boolean } = { middle: false };
        if (`${this.page}`.length > 2) {
            data.middle = true;
        }

        return data;
    }

    get cPage(): number {
        return this.page;
    }

    set cPage(val: number) {
        this.setCPage(val);
    }

    get isActive(): boolean {
        return !!this.tPage;
    }

    get pageArray(): number[] {
        const half: number = Math.floor(this.size / 2);
        const navpage: number[] = [];
        if (this.cPage > half && this.cPage < this.tPage - half) {
            let i: number = this.cPage - half;
            let j: number = 0;
            while (j < this.size) {
                navpage.push(i);
                i += 1;
                j += 1;
            }
        }
        if (this.cPage <= half) {
            let i: number = 1;
            let j: number = 0;
            while (j < this.size) {
                navpage.push(i);
                j += 1;
                i += 1;
            }
        }
        if (this.cPage >= this.tPage - half) {
            let i: number = this.tPage - this.size + 1;
            let j: number = 0;
            while (j < this.size) {
                navpage.push(i);
                j += 1;
                i += 1;
            }
        }

        return navpage;
    }
    public invoke(page: number): void {
        if (page > 0 && page < this.tPage) {
            this.cPage = page;
        }
    }

    public goTo(): void {
        this.invoke(<number>this.toPage);
    }

    public filterInput(e: Event): void {
        const target: HTMLInputElement = <HTMLInputElement>e.target;
        const val: string = target.value;
        target.value = val.replace(/[^0-9]/g, '');
        let num: number = Number.parseInt(target.value, 10);
        if (num > this.tPage) {
            num = this.tPage;
        }
        if (num < 0) {
            num = 1;
        }
        target.value = num ? `${num}` : '';
        this.toPage = num || 1;
    }
}
</script>
<style lang="postcss">
.pager {
    width: calc(3 * var(--themePageItemSize));
    height: calc(3 * var(--themePageItemSize));
    position: absolute;
    right: 40px;
    top: 40px;
    z-index: 2;
    &.active {
        animation: none;
        & .pNav {
            &:first-of-type {
                transform: translate(-100%, 100%);
            }
            &:last-of-type {
                transform: translate(100%, -100%);
            }
        }
        & .pGoto {
            & .pGotoDiv {
                &:first-of-type {
                    left: var(--themePageItemSize);
                    top: 0px;
                }
                &:last-of-type {
                    top: var(--themePageItemSize);
                    left: 0px;
                    transition-delay: 0.1s;
                }
            }
            & .pBtn {
                top: var(--themePageItemSize);
                left: var(--themePageItemSize);
                transition-delay: 0.2s;
            }
        }
        & .pHolder {
            visibility: hidden;
            opacity: 0;
        }
        & .pItem {
            &:nth-child(1) {
                left: 0px;
                top: 0px;
            }
            &:nth-child(2) {
                left: var(--themePageItemSize);
                top: 0px;
                transition-delay: 0.1s;
            }
            &:nth-child(3) {
                left: 0px;
                top: var(--themePageItemSize);
                transition-delay: 0.2s;
            }
        }
    }
}

.pNav {
    width: var(--themePageItemSize);
    height: var(--themePageItemSize);
    position: absolute;
    display: inline-block;
    color: white;
    font-size: 30px;
    line-height: 40px;
    text-align: center;
    background-color: var(--themePageNavBgColor);
    cursor: pointer;
    transition: all 0.3s ease;
    bottom: var(--themePageItemSize);
    left: var(--themePageItemSize);
    &:hover {
        &:after,
        &:before {
            background: var(--themePageItemHoverColor) !important;
        }
    }
    & svg {
        width: 100%;
        height: 100%;
        display: block;
    }
    &:after,
    &:before {
        transition: all 0.2s ease;
    }
    &:nth-of-type(1) {
        &:after {
            content: '';
            position: absolute;
            left: 5px;
            bottom: 0;
            height: 5px;
            width: calc(100% - 5px);
            background: var(--themePageItemHoverColor);
        }
        &:before {
            content: '';
            position: absolute;
            left: 0;
            bottom: 0;
            height: 100%;
            width: 5px;
            background: var(--themePageItemHoverColor);
        }
    }
    &:nth-of-type(2) {
        &:after {
            content: '';
            position: absolute;
            right: 5px;
            top: 0;
            height: 5px;
            width: calc(100% - 5px);
            background: var(--themePageItemHoverColor);
        }
        &:before {
            content: '';
            position: absolute;
            right: 0;
            top: 0;
            height: 100%;
            width: 5px;
            background: var(--themePageItemHoverColor);
        }
    }
    &.disabled {
        pointer-events: none;
        cursor: not-allowed;
    }
}
.pHolder {
    width: var(--themePageItemSize);
    height: var(--themePageItemSize);
    position: absolute;
    background-color: var(--themeBaseColor);
    z-index: 3;
    left: var(--themePageItemSize);
    top: var(--themePageItemSize);
    cursor: pointer;
    transition: all 0.2s 0.5s ease-in-out;
    animation: breathPage 2s 4s ease-in-out alternate infinite;
    &:after,
    &:before {
        content: '';
        left: 0px;
        top: 0px;
        right: 0px;
        bottom: 0px;
        margin: auto;
        position: absolute;
    }
    &:after {
        width: 40%;
        height: 40%;
        background-color: var(--themePageItemBreathColor2);
        animation: breathPage2 2s ease-in-out alternate infinite;
    }
    &:before {
        width: 70%;
        height: 70%;
        background-color: var(--themePageItemBreathColor1);
        animation: breathPage1 2s 2s ease-in-out alternate infinite;
    }
}
.pCon {
    width: 2 * var(--themePageItemSize);
    height: 2 * var(--themePageItemSize);
    position: absolute;
    left: 0px;
    top: 0px;
    z-index: 2;
}
.pBox {
    width: 100%;
    height: 100%;
    font-size: 0px;
    position: relative;
}
.pItemText {
    display: block;
    width: 100%;
    height: 100%;
    font-family: ZagRegular;
    line-height: 46px;
    letter-spacing: 2px;
}
.pItem {
    position: absolute;
    color: white;
    font-size: 20px;
    width: var(--themePageItemSize);
    height: var(--themePageItemSize);
    left: var(--themePageItemSize);
    top: var(--themePageItemSize);
    line-height: 40px;
    text-align: center;
    background-color: var(--themePageNavBgColor);
    cursor: pointer;
    transition: all 0.2s ease;
    &:hover,
    &.current {
        background-color: var(--themePageItemHoverColor);
    }
    &.current {
        cursor: not-allowed;
        pointer-events: none;
    }
    &.middle {
        font-size: 14px;
    }
}
.pGoto {
    width: 2 * var(--themePageItemSize);
    height: 2 * var(--themePageItemSize);
    position: absolute;
    font-size: 0px;
    left: var(--themePageItemSize);
    top: var(--themePageItemSize);
    z-index: 1;
}

.pGotoSpan,
.pGotoInput {
    line-height: 45px;
    text-align: center;
    font-size: 20px;
    font-family: ZagRegular;
    display: block;
    color: white;
    width: 100%;
    height: 100%;
    text-transform: uppercase;
    letter-spacing: 2px;
    border: none;
    background: none;
}
.pGotoSpan {
    font-size: 14px;
}
.pGotoInput {
    color: white;
    font-size: 14px;
    outline: none;
    box-sizing: border-box;
    border-bottom: 4px solid var(--themeBaseColor);
    animation: blink 1s ease-in-out infinite alternate-reverse both;
}
.pGotoEm,
.pGotoDiv,
.pBtn {
    width: var(--themePageItemSize);
    height: var(--themePageItemSize);
    box-sizing: border-box;
    display: inline-block;
    position: absolute;
    margin: auto;
    border: none;
    left: 0px;
    top: 0px;
    vertical-align: top;
    background-color: var(--themePageNavBgColor);
    transition: all 0.2s ease;
}
.pGotoEm {
    background: none;
}
.pBtn {
    margin: 0;
    padding: 0;
    cursor: pointer;
    &:hover {
        background-color: var(--themePageItemHoverColor);
    }
    & span {
        width: 40%;
        height: 40%;
        display: block;
        background: var(--themeBaseColor);
        position: absolute;
        right: 0;
        bottom: 0;
    }
}
.staggered-transition {
    transition: opacity 0.5s ease;
    opacity: 1;
}
.staggered-enter,
.staggered-leave {
    opacity: 0;
    will-change: opacity;
}
@keyframes breathPage {
    0% {
        background-color: var(--themeBaseColor);
    }
    100% {
        background-color: var(--themePageItemBreathColor2);
    }
}
@keyframes breathPage1 {
    0% {
        background-color: var(--themePageItemBreathColor1);
    }
    50% {
        background-color: var(--themePageItemBreathColor2);
    }
    100% {
        background-color: var(--themeBaseColor);
    }
}
@keyframes breathPage2 {
    0% {
        background-color: var(--themePageItemBreathColor2);
    }
    100% {
        background-color: var(--themeBaseColor);
    }
}
@keyframes blink {
    0% {
        border-color: transparent;
    }
    100% {
        border-color: var(--themeBaseColor);
    }
}
</style>
