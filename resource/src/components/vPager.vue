<template>
    <section id="pager" :class="[ isActive ? 'active':'']">
        <span @click="invoke(cPage - 1)" :class="[cPage - 1 ? '':'disabled']">
            <i></i>
        </span>
        <span @click="invoke(cPage + 1)" :class="[tPage - cPage > 0 ? '':'disabled']">
            <i></i>
        </span>
        <div class="pagerCon">
            <transition-group tag="ul" name="page">
                <li @click="invoke(item)" v-for="item in pageArray" :key="item" :class="[ cPage == item ? 'current' : '']" ><span>{{item}}</span></li>
            </transition-group>
        </div>
            <form class="pagerGoto" novalidate>
                <em></em>
                <div><span>{{tPage}}</span></div>
                <div>
                    <input type="text"  placeholder="page" name="pager" v-model='goToPage' >
                </div>
                <button @click.prevent="goTo"><span>Go</span></button>
            </form>
        <div class="placeholder" ></div>
    </section>
</template>
<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component
export default class vPager extends Vue {
    goToPage: string = '';
    size: number = 4;
    isActive: boolean = true;
    cPage: number = 4;
    tPage: number = 10;

    get pageArray() {
        const half: number = Math.floor(this.size / 2);
        const navpage: number[] = [];
        const cPage: number = 4;
        const tPage: number = 10;
        if (cPage > half && cPage < tPage - half) {
            for (let i:number = cPage - half, j = 0; j < this.size; j++, i++) {
                navpage.push(i);
            }
        }
        if (cPage <= half) {
            for (let i = 1, j = 0; j < this.size; j++, i++) {
                navpage.push(i);
            }
        }
        if (cPage >= tPage - half) {
            for (let i = tPage - this.size + 1, j = 0; j < this.size; j++, i++) {
                navpage.push(i);
            }
        }
        return navpage;
    }

    invoke(page:number): void {
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
    
    #pager {
        width: calc(3 * var(--itemSize));
        height:calc(3 * var(--itemSize));
        transform:rotate(45deg);
        margin:200px;
        position: relative;
        animation:spin 2s linear infinite;
        &.active {
            animation:none;
            >span {
                &:first-of-type{
                    transform:translate(-100%,100%);
                }
                &:last-of-type{
                    transform:translate(100%,-100%);
                }
            }
            .pagerCon {
                & li {
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
            &.pagerGoto {
                div {
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
                button {
                    top:var(--itemSize);
                    left:var(--itemSize);
                    transition-delay: 0.2s;
                }
            }
            .placeholder {
                visibility: hidden;
                opacity:0;
            }
        }
        & >span {
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
            svg {
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
    }
    .placeholder {
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
    .pagerCon {
        width: 2 * var(--itemSize);
        height: 2 * var(--itemSize);
        position:absolute;
        left: 0px;
        top: 0px;
        z-index: 2;
        ul {
            width:100%;
            height:100%;
            font-size: 0px;
            position:relative;
        }
        span {
            display: block;
            width:100%;
            height:100%;
            font-family: "diner-regularregular";
            transform:rotate(-45deg);
            line-height: 46px;
            letter-spacing: 2px;
        }
        li {
            position:absolute;
            color:white;
            font-size: 30px;
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
    }
    .pagerGoto {
        width:2 * var(--itemSize);
        height:2 * var(--itemSize);
        position:absolute;
        font-size: 0px;
        left:var(--itemSize);
        top:var(--itemSize);
        z-index: 1;
        div,button,em {
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
        em {
            background:none;
        }

        span,input {
            line-height: 45px;
            text-align: center;
            font-size:30px;
            font-family: 'diner-regularregular';
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
        button {
            font-size: 30px;
            margin-bottom: 0px;
            cursor: pointer;
            &:hover {
                background-color:var(--hoverBg);
            }
        }
        input {
            color:white;
            font-size: 20px;
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
