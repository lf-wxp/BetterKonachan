<template>
    <section id="setting" :class="[isOptionShow ? 'active' : '']">
        <div class="mask" @click="showOption">
        </div>
        <div class="toggle">
            <input type="checkbox" id="security" v-model='securityMode' :checked="securityMode">
            <label for="security" data-title="Security mode"><span></span> </label>
        </div>
        <div class="toggle">
            <input type="checkbox" id="page" v-model="rememberPage" :checked="rememberPage">
            <label for="page" data-title="Remember page"><span></span> </label>
        </div>
    </section>
</template>
<script>
    import { getLocal, setLocal, getSession } from '../servers/servers.js';
    export default {
        data() {
            return {
                securityMode: getLocal('securityMode') === undefined ? true : getLocal('securityMode'),
                rememberPage: getLocal('rememberPage'),
                isOptionShow: false
            };
        },
        watch: {
            securityMode(val) {
                setLocal('securityMode', val);
                /* 更改模式后 刷新列表 */
                this.$dispatch('invoke', { currentPage: getSession('currentPage') });
            },
            rememberPage(val) {
                setLocal('rememberPage', val);
            }
        },
        methods: {
            showOption() {
                this.isOptionShow = !this.isOptionShow;
            }
        }
    };
</script>
<style lang="sass">
    #setting {
        width:40px;
        height:40px;
        transform:rotate(45deg);
        margin:200px;
        position:relative;
        &.active {
            div {
                &:nth-of-type(2) {
                    left:100%;
                }
                &:nth-of-type(3) {
                    top:-100%;
                }
            }
            .mask {
                &:after {
                    background:lighten(teal,10%);
                }
            }
            span {
                &:after,&:before {
                    opacity: 1;
                    visibility:visible;

                }
            }
            label {
                &:after {
                    opacity:1;
                    visibility: visible;
                }
            }
        }
    }
    .mask {
        position: absolute;
        left:0px;
        top:0px;
        background:#252323;
        width:100%;
        height:100%;
        border: 5px solid teal;
        z-index: 2;
        cursor: pointer;
        box-sizing: border-box;
        &:after {
            content:'';
            position:absolute;
            background:darken(teal,10%);
            width:30%;
            height:30%;
            left: 0px;
            right:0px;
            top: 0px;
            bottom:0px;
            margin: auto;
            transition:all 0.2s ease-in-out;
            animation: breathSet 2s ease-in-out alternate infinite;
        }
        &:before {
            content:'';
            position:absolute;
            background:black;
            width:70%;
            height:70%;
            left: 0px;
            right:0px;
            top: 0px;
            bottom:0px;
            margin: auto;
        }
    }
    .toggle {
        position: absolute;
        width:100%;
        height:100%;
        left: 0px;
        top: 0px;
        box-sizing: border-box;
        background:#252323;
        z-index: 1;
        border: 5px solid black;
        font-size: 0px;
        cursor:pointer;
        transition:all 0.2s ease-in-out;
        &:nth-of-type(2) {
            transition-delay: 0.1s;
        }
        input {
            display: none;
            &:not(:checked) + label {
                span:after {
                    content:"off";
                    color:#7F8C9A;
                    position: absolute;
                    left: 180%;
                    font-size: 16px;
                }
            }
            &:checked + label {
                background:teal;
                span:before {
                    content:"on";
                    color:#39D2B4;
                    position: absolute;
                    left: 180%;
                    font-size: 16px;
                }
            }
        }
        label {
            color:#C0CDDC;
            cursor: pointer;
            font-family:"NanoCore","Open sans", "Segoe UI", "Segoe WP", Helvetica, Arial, sans-serif;
            width:60%;
            height:60%;
            background:darken(teal,50%);
            position:absolute;
            left:0px;
            top:0px;
            right:0px;
            bottom:0px;
            margin:auto;
            transition:all 0.2s ease;
            &:after {
                position: absolute;
                content:attr(data-title);
                font-size: 16px;
                width:140px;
                opacity:0;
                visibility: hidden;
                transition:all 0.2s ease-in-out 0.2s;
            }
            &[for='page']{
                &:after {
                    bottom: 100%;
                    transform:rotate(-90deg);
                    transform-origin: left top;
                }
            }
             &[for='security']{
                &:after {
                    top: 180%;
                    transform:rotate(-90deg) translate(-100%);
                    transform-origin: left top;
                    text-align: right;
                }
            }
            span {
                font-family: inherit;
                width:100%;
                height:100%;
                display:block;
                &:after,&:before {
                    opacity:0;
                    visibility:hidden;
                    transition:all 0.2s ease-in-out 0.2s;
                }
            }
        }
    }
    @keyframes breathSet {
        0% {
            background:#004d4d;
        }
        100% {
            background:lighten(teal,20%);
        }
    }
</style>