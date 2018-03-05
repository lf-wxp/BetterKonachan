<template>
    <section class="vPager" :class="[ isActive ? 'active':'']">
        <span  class="vPager_nav"  @click="invoke(cPage - 1)" :class="[cPage - 1 ? '':'disabled']">
            <i></i>
        </span>
        <span class="vPager_nav" @click="invoke(cPage + 1)" :class="[tPage - cPage > 0 ? '':'disabled']">
            <i></i>
        </span>
        <div class="vPager_con">
            <transition-group tag="ul" name="page" class="vPager_box">
                <li class="vPager_item" @click="invoke(item)" v-for="item in pageArray" :key="item" :class="[ cPage == item ? 'current' : '']" ><span class="vPager_itemText">{{item}}</span></li>
            </transition-group>
        </div>
            <form class="vPager_goto" novalidate>
                <em class="vPager_gotoEm"></em>
                <div class="vPager_gotoDiv"><span class="vPager_gotoSpan">{{tPage}}</span></div>
                <div class="vPager_gotoDiv">
                    <input class="vPager_gotoInput" type="text"  placeholder="page" name="pager" v-model='goToPage' >
                </div>
                <button class="vPager_btn" @click.prevent="goTo"><span></span></button>
            </form>
        <div class="vPager_placeholder" @click="expand"></div>
    </section>
</template>
<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component
export default class vPager extends Vue {
    goToPage: string = '';
    size: number = 4;
    isActive: boolean = false;
    cPage: number = 4;
    tPage: number = 10;

    get pageArray() {
        const half: number = Math.floor(this.size / 2);
        const navpage: number[] = [];
        if (this.cPage > half && this.cPage < this.tPage - half) {
            for (let i:number = this.cPage - half, j:number = 0; j < this.size; j++, i++) {
                navpage.push(i);
            }
        }
        if (this.cPage <= half) {
            for (let i = 1, j = 0; j < this.size; j++, i++) {
                navpage.push(i);
            }
        }
        if (this.cPage >= this.tPage - half) {
            for (let i = this.tPage - this.size + 1, j = 0; j < this.size; j++, i++) {
                navpage.push(i);
            }
        }
        return navpage;
    }
    expand() {
        this.isActive = true;
    }
    invoke(page:number): void {
        this.cPage = page;
    }

};
</script>
<style lang="postcss">
    :root {
        --itemSize:40px;
        --commonBg:rgba(0,0,0,1);
        --base:#39CCCC;
        --hoverBg:rgba(#39CCCC,0.5);
        --darkBg1:darken(#39CCCC,5%);
        --darkBg2:darken(#39CCCC,10%);
    }
    
    .vPager {
        width: calc(3 * var(--itemSize));
        height:calc(3 * var(--itemSize));
        transform:rotate(45deg);
        margin:200px;
        position: relative;
        animation:spin 2s linear infinite;
        &.active {
            animation:none;
            & .vPager_nav {
                &:first-of-type{
                    transform:translate(-100%,100%);
                }
                &:last-of-type{
                    transform:translate(100%,-100%);
                }
            }
            & .vPager_goto {
                & .vPager_gotoDiv {
                    &:first-of-type {
                        left:var(--itemSize);
                        top: 0px;
                    }
                    &:last-of-type {
                        top: var(--itemSize);
                        left:0px;
                        transition-delay: 0.1s;
                    }
                }
                & .vPager_btn {
                    top:var(--itemSize);
                    left:var(--itemSize);
                    transition-delay: 0.2s;
                }
            }
            & .vPager_placeholder {
                visibility: hidden;
                opacity:0;
            }
            & .vPager_item {
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
                    left:0px;
                    top: var(--itemSize);
                    transition-delay: 0.2s;
                }
            }
        }
    } 
            
    .vPager_nav {
        width:var(--itemSize);
        height:var(--itemSize);
        position:absolute;
        display: inline-block;
        color:white;
        font-size: 30px;
        line-height: 40px;
        text-align: center;
        background-color:var(--commonBg);
        border-radius: 2px;
        cursor: pointer;
        transition:all 0.3s ease;
        bottom:var(--itemSize);
        left: var(--itemSize);
        &:hover {
            background:teal;
            &:after,&:before {
                background:black!important;
            }
        }
        & svg {
            width:100%;
            height:100%;
            display:block;
            transform:rotate(-45deg);
        }
        &:after,&:before {
            transition:all 0.2s ease;
        }
        &:nth-of-type(1) {
            &:after {
                content: '';
                position:absolute;
                left:5px;
                bottom:0;
                height:5px;
                width:calc( 100% - 5px);
                background:teal;
            }
            &:before {
                content:'';
                position:absolute;
                left: 0;
                bottom:0;
                height:100%;
                width:5px;
                background:teal;
            }
        }
        &:nth-of-type(2){
            &:after {
                content: '';
                position:absolute;
                right:5px;
                top:0;
                height:5px;
                width:calc( 100% - 5px);
                background:teal;
            }
            &:before {
                content:'';
                position:absolute;
                right: 0;
                top:0;
                height:100%;
                width:5px;
                background:teal;
            }
        }
    }
    .vPager_placeholder {
        width:var(--itemSize);
        height:var(--itemSize);
        position:absolute;
        background-color:var(--base);
        z-index: 3;
        left:var(--itemSize);
        top:var(--itemSize);
        cursor:pointer;
        transition:all 0.2s 0.5s ease-in-out;
        animation: breathPage 2s 4s ease-in-out alternate infinite;
        &:after,&:before {
            content:"";
            left: 0px;
            top:0px;
            right:0px;
            bottom:0px;
            margin:auto;
            position:absolute;
        }
        &:after {
            width:40%;
            height:40%;
            background-color:var(--darkBg2);
            animation: breathPage2 2s ease-in-out alternate infinite;
        }
        &:before {
            width:70%;
            height:70%;
            background-color:var(--darkBg1);
            animation: breathPage1 2s 2s ease-in-out alternate infinite;
        }
    }
    .vPager_con {
        width: 2 * var(--itemSize);
        height: 2 * var(--itemSize);
        position:absolute;
        left: 0px;
        top: 0px;
        z-index: 2;
    }
    .vPager_box {
        width:100%;
        height:100%;
        font-size: 0px;
        position:relative;
    }
    .vPager_itemText {
        display: block;
        width:100%;
        height:100%;
        font-family: ZagRegular;
        transform:rotate(-45deg);
        line-height: 46px;
        letter-spacing: 2px;
    }
    .vPager_item {
        position:absolute;
        color:white;
        font-size: 20px;
        width: var(--itemSize);
        height: var(--itemSize);
        left:var(--itemSize);
        top: var(--itemSize);
        line-height: 40px;
        text-align: center;
        background-color:var(--commonBg);
        border-radius: 2px;
        cursor: pointer;
        transition:all 0.2s ease;
        &:hover,&.current {
            background-color:var(--hoverBg);
        }
        &.current {
            cursor: not-allowed;
            pointer-events:none;
        }
    }
    .vPager_goto {
        width:2 * var(--itemSize);
        height:2 * var(--itemSize);
        position:absolute;
        font-size: 0px;
        left:var(--itemSize);
        top:var(--itemSize);
        z-index: 1;
    }
    .vPager_gotoSpan,.vPager_gotoInput {
        line-height: 45px;
        text-align: center;
        font-size:20px;
        font-family: ZagRegular;
        display:block;
        color:white;
        width:100%;
        height:100%;
        text-transform:uppercase;
        letter-spacing: 2px;
        border:none;
        background:none;
        transform:rotate(-45deg);
    }
    .vPager_gotoInput {
        color:white;
        font-size: 14px;
        outline: none;
    }
    .vPager_gotoEm,.vPager_gotoDiv,.vPager_btn {
        width: var(--itemSize);
        height: var(--itemSize);
        box-sizing:border-box;
        border-radius:2px;
        display: inline-block;
        position:absolute;
        margin:auto;
        border:none;
        left:0px;
        top: 0px;
        vertical-align: top;
        background-color:var(--commonBg);
        transition:all 0.2s ease;
    }
    .vPager_gotoEm {
        background:none;
    }
    .vPager_btn {
        margin: 0;
        padding: 0;
        cursor: pointer;
        &:hover {
            background-color:var(--hoverBg);
        }
        & span {
            width: 40%;
            height: 40%;
            display: block;
            background: var(--base);
            position: absolute;
            right: 0;
            bottom: 0;
        }
    }
    .staggered-transition {
        transition: opacity .5s ease;
        opacity: 1;
    }
    .staggered-enter, .staggered-leave {
        opacity: 0;
        will-change:opacity;
    }
    @keyframes breathPage {
        0% {
            background-color:var(--base);
        }
        100% {
            background-color:var(--darkBg2);
        }
    }
    @keyframes breathPage1 {
        0% {
            background-color:var(--darkBg1);
        }
        50% {
            background-color:var(--darkBg2);
        }
        100% {
            background-color:var(--base);
        }
    }
    @keyframes breathPage2 {
        0% {
            background-color:var(--darkBg2);
        }
        100% {
            background-color:var(--base);
        }
    }
    @keyframes spin {
        0% {
            transform:rotate(0deg);
        }
        100% {
            transform:rotate(360deg);
        }
    }
</style>
