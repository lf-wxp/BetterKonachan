<template>
    <section id="pager" :class="[ isActive ? 'active':'']">
        <i class="icon-keyboard_arrow_up" @click="invoke(page - 1)" v-if="page - 1"></i>
        <i class="icon-keyboard_arrow_down" @click="invoke(page + 1)" v-if="total - page > 0"></i>
        <div class="pagerCon">
            <ul>
                <li @click="invoke(item)" v-for="item in pageArray" transition="staggered" stagger="50" :class="[ page == item ? 'current' : '']" ><span>{{item}}</span></li>
            </ul>
        </div>
        <validator name="goToValidation">
            <form class="pagerGoto">
                <em></em>
                <div><span>{{total}}</span></div>
                <div>
                    <input type="text"  placeholder="page" v-model='goToPage' v-validate:goToPage="['required', 'numeric']">
                </div>
                <button :disabled="$goToValidation.invalid" @click.prevent="goTo"><span>Go</span></button>
            </form>
        </validator>
        <div class="placeholder" @click='isActiveFun'></div>
    </section>
</template>
<script>
    import Vue from 'vue';
    import VueValidator from 'vue-validator';
    Vue.use(VueValidator);
    function creatNavPage(current, total, size) { // 创建分页的导航页
        const half = Math.floor(size / 2);
        const navpage = [];
        if (current > half && current < total - half) {
            for (let i = current - half, j = 0; j < size; j++, i++) {
                navpage.push(i);
            }
        }
        if (current <= half) {
            for (let i = 1, j = 0; j < size; j++, i++) {
                navpage.push(i);
            }
        }
        if (current >= total - half) {
            for (let i = total - size + 1, j = 0; j < size; j++, i++) {
                navpage.push(i);
            }
        }
        return navpage;
    }
    export default {
        data() {
            return {
                pageArray: [],
                page: 1,
                total: 1,
                goToPage: '',
                isActive: false
            };
        },
        methods: {
            invoke(page) {
                this.$dispatch('invoke', { currentPage: Number(page) });
            },
            goTo() {
                this.$dispatch('invoke', { currentPage: Number(this.goToPage) });
            },
            isActiveFun() {
                this.isActive = !this.isActive;
            }
        },
        ready() {
            this.$on('listReady', (data) => {
                this.page = data.currentPage;
                this.pageArray = creatNavPage(data.currentPage, data.pages, 4);
                this.total = data.pages;
            });
            var vuethis = this;
            // use arrow left and arrow right key to navigate the page
            document.addEventListener("keydown",function(event){
                var keyPager;
                switch (event.keyCode) {
                    case 37:
                        if (vuethis.page - 1 > 0) {
                            keyPager = vuethis.page - 1;
                        } else {
                            return false;
                        }
                    case 39:
                        if (vuethis.page + 1 < vuethis.total) {
                            keyPager = vuethis.page + 1;
                        } else {
                            return false;
                        }
                    case null:
                        event.preventDefault();
                        vuethis.invoke(keyPager);
                        break;
                }
            });
        },
        validators: {
            /* 自定义 验证规则 */
            numeric(val) {
                return /^[-+]?[0-9]+$/.test(val) && val > 0 && val <= this.total;
            }
        }
    };
</script>
<style lang="sass" scoped>
    @import "../assets/sass/components/_icon";
    $itemSize:40px;
    $commonBg:rgba(255,255,255,0.2);
    $base:#39CCCC;
    $hoverBg:rgba(#39CCCC,0.5);
    $darkBg1:darken(#39CCCC,5%);
    $darkBg2:darken(#39CCCC,10%);
    #pager {
        width: 3 * $itemSize;
        height:3 * $itemSize;
        transform:rotate(45deg);
        margin:200px;
        position: relative;
        animation:spin 2s linear infinite;
        &.active {
            animation:none;
            >i {
                &:first-of-type{
                    transform:translate(-100%,100%);
                }
                &:last-of-type{
                    transform:translate(100%,-100%);
                }
            }
            .pagerCon {
                li {
                    &:nth-child(1) {
                        left: 0px;
                        top: 0px;
                    }
                    &:nth-child(2) {
                        left: $itemSize;
                        top: 0px;
                        transition-delay: 0.1s;
                    }
                    &:nth-child(3) {
                        left:0px;
                        top: $itemSize;
                        transition-delay: 0.2s;
                    }
                }
            }
            .pagerGoto {
                div {
                    &:first-of-type {
                        left:$itemSize;
                        top: 0px;
                    }
                    &:last-of-type {
                        top: $itemSize;
                        left:0px;
                        transition-delay: 0.1s;
                    }
                }
                button {
                    top:$itemSize;
                    left:$itemSize;
                    transition-delay: 0.2s;
                }
            }
            .placeholder {
                visibility: hidden;
                opacity:0;
            }
        }
        >i {
            width:$itemSize;
            height:$itemSize;
            position:absolute;
            display: inline-block;
            color:white;
            font-size: 30px;
            line-height: 40px;
            text-align: center;
            background-color:$commonBg;
            border-radius: 2px;
            cursor: pointer;
            transition:all 0.3s ease;
            bottom:$itemSize;
            left: $itemSize;
            &:before {
                width:100%;
                height:100%;
                display:block;
                transform:rotate(-135deg);
            }
            &:last-of-type {
                &:before {
                    transform:rotate(225deg);
                }
            }
        }
    }
    .placeholder {
        width:$itemSize;
        height:$itemSize;
        position:absolute;
        background-color:$base;
        z-index: 3;
        left:$itemSize;
        top:$itemSize;
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
            background-color:$darkBg2;
            animation: breathPage2 2s ease-in-out alternate infinite;
        }
        &:before {
            width:70%;
            height:70%;
            background-color:$darkBg1;
            animation: breathPage1 2s 2s ease-in-out alternate infinite;
        }
    }
    .pagerCon {
        width: 2 * $itemSize;
        height: 2 * $itemSize;
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
            width: $itemSize;
            height: $itemSize;
            left:$itemSize;
            top: $itemSize;
            line-height: 40px;
            text-align: center;
            background-color:$commonBg;
            border-radius: 2px;
            cursor: pointer;
            transition:all 0.2s ease;
            &:hover,&.current {
                background-color:$hoverBg;
            }
            &.current {
                cursor: not-allowed;
                pointer-events:none;
            }
        }
    }
    .pagerGoto {
        width:2 * $itemSize;
        height:2 * $itemSize;
        position:absolute;
        font-size: 0px;
        left:$itemSize;
        top:$itemSize;
        z-index: 1;
        div,button,em {
            width: $itemSize;
            height: $itemSize;
            box-sizing:border-box;
            border-radius:2px;
            display: inline-block;
            position:absolute;
            margin:auto;
            border:none;
            left:0px;
            top: 0px;
            vertical-align: top;
            background-color:$commonBg;
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
                background-color:$hoverBg;
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
            background-color:$base;
        }
        100% {
            background-color:$darkBg2;
        }
    }
    @keyframes breathPage1 {
        0% {
            background-color:$darkBg1;
        }
        50% {
            background-color:$darkBg2;
        }
        100% {
            background-color:$base;
        }
    }
    @keyframes breathPage2 {
        0% {
            background-color:$darkBg2;
        }
        100% {
            background-color:$base;
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