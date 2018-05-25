<template>
    <section class="pager" :class="[ isActive ? 'active':'']">
        <span class="pNav" @click="invoke(cPage - 1)" :class="[cPage - 1 ? '':'disabled']">
            <i></i>
        </span>
        <span class="pNav" @click="invoke(cPage + 1)" :class="[tPage - cPage > 0 ? '':'disabled']">
            <i></i>
        </span>
        <div class="pCon">
            <transition-group tag="ul" name="page" class="pBox">
                <li class="pItem" @click="invoke(item)" v-for="item in pageArray" :key="item" :class="[ cPage == item ? 'current' : '']">
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
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';

@Component
export default class VPager extends Vue {
    toPage: number = 0;
    size: number = 4;
    @State page!: number;
    @State('totalPage') tPage!: number;
    @Mutation('SETPAGE') setCPage!: Function;

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
            for (
                let i: number = this.cPage - half, j: number = 0;
                j < this.size;
                j++, i++
            ) {
                navpage.push(i);
            }
        }
        if (this.cPage <= half) {
            for (let i = 1, j = 0; j < this.size; j++, i++) {
                navpage.push(i);
            }
        }
        if (this.cPage >= this.tPage - half) {
            for (
                let i = this.tPage - this.size + 1, j = 0;
                j < this.size;
                j++, i++
            ) {
                navpage.push(i);
            }
        }
        return navpage;
    }
    invoke(page: number): void {
        if(page > 0 &&  page < this.tPage ){
            this.cPage = page;
        }
    }
    
    goTo(): void{
        this.invoke(<number>this.toPage);
    }

    filterInput(e: Event): void {
        const target = <HTMLInputElement>e.target;
        const val = target.value;
        target.value = val.replace(/[^0-9]/g, '');
        let num = Number.parseInt(target.value, 10);
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
<style scoped>
:root {
    --itemSize: 40px;
    --commonBg: rgba(0, 0, 0, .3);
    --teal: #39cccc;
    --hoverBg: color(var(--teal) a(20%));
    --darkBg1: darken(#39cccc, 5%);
    --darkBg2: darken(#39cccc, 10%);
}

.pager {
    width: calc(3 * var(--itemSize));
    height: calc(3 * var(--itemSize));
    position: relative;
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
                    left: var(--itemSize);
                    top: 0px;
                }
                &:last-of-type {
                    top: var(--itemSize);
                    left: 0px;
                    transition-delay: 0.1s;
                }
            }
            & .pBtn {
                top: var(--itemSize);
                left: var(--itemSize);
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
                left: var(--itemSize);
                top: 0px;
                transition-delay: 0.1s;
            }
            &:nth-child(3) {
                left: 0px;
                top: var(--itemSize);
                transition-delay: 0.2s;
            }
        }
    }
}

.pNav {
    width: var(--itemSize);
    height: var(--itemSize);
    position: absolute;
    display: inline-block;
    color: white; font-size: 30px;
    line-height: 40px;
    text-align: center;
    background-color: var(--commonBg);
    cursor: pointer;
    transition: all 0.3s ease;
    bottom: var(--itemSize);
    left: var(--itemSize);
    &:hover {
        &:after,
        &:before {
            background: var(--hoverBg)!important;
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
            background: var(--hoverBg);
        }
        &:before {
            content: '';
            position: absolute;
            left: 0;
            bottom: 0;
            height: 100%;
            width: 5px;
            background: var(--hoverBg) ;
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
            background: var(--hoverBg);
        }
        &:before {
            content: '';
            position: absolute;
            right: 0;
            top: 0;
            height: 100%;
            width: 5px;
            background: var(--hoverBg);
        }
    }
    &.disabled {
        pointer-events: none;
        cursor: not-allowed;
    }
}
.pHolder {
    width: var(--itemSize);
    height: var(--itemSize);
    position: absolute;
    background-color: var(--teal);
    z-index: 3;
    left: var(--itemSize);
    top: var(--itemSize);
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
        background-color: var(--darkBg2);
        animation: breathPage2 2s ease-in-out alternate infinite;
    }
    &:before {
        width: 70%;
        height: 70%;
        background-color: var(--darkBg1);
        animation: breathPage1 2s 2s ease-in-out alternate infinite;
    }
}
.pCon {
    width: 2 * var(--itemSize);
    height: 2 * var(--itemSize);
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
    width: var(--itemSize);
    height: var(--itemSize);
    left: var(--itemSize);
    top: var(--itemSize);
    line-height: 40px;
    text-align: center;
    background-color: var(--commonBg);
    cursor: pointer;
    transition: all 0.2s ease;
    &:hover,
    &.current {
        background-color: var(--hoverBg);
    }
    &.current {
        cursor: not-allowed;
        pointer-events: none;
    }
}
.pGoto {
    width: 2 * var(--itemSize);
    height: 2 * var(--itemSize);
    position: absolute;
    font-size: 0px;
    left: var(--itemSize);
    top: var(--itemSize);
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
    border-bottom: 4px solid  var(--teal);
    animation: blink 1s ease-in-out  infinite alternate-reverse both;
}
.pGotoEm,
.pGotoDiv,
.pBtn {
    width: var(--itemSize);
    height: var(--itemSize);
    box-sizing: border-box;
    display: inline-block;
    position: absolute;
    margin: auto;
    border: none;
    left: 0px;
    top: 0px;
    vertical-align: top;
    background-color: var(--commonBg);
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
        background-color: var(--hoverBg);
    }
    & span {
        width: 40%;
        height: 40%;
        display: block;
        background: var(--teal);
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
        background-color: var(--teal);
    }
    100% {
        background-color: var(--darkBg2);
    }
}
@keyframes breathPage1 {
    0% {
        background-color: var(--darkBg1);
    }
    50% {
        background-color: var(--darkBg2);
    }
    100% {
        background-color: var(--teal);
    }
}
@keyframes breathPage2 {
    0% {
        background-color: var(--darkBg2);
    }
    100% {
        background-color: var(--teal);
    }
}
@keyframes blink {
    0% {
        border-color: transparent;
    }
    100% {
        border-color: var(--teal);
    }
}
</style>
