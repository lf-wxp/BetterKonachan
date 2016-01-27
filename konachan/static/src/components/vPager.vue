<template>
    <section id="pager">
        <div class="pagerCon">
            <i class="icon-keyboard_arrow_up" @click="invoke(page - 1)" v-if="page - 1"></i>
            <ul>
                <li @click="invoke(item)" v-for="item in pageArray" transition="staggered" stagger="50" :class="[ page == item ? 'current' : '']" >{{item}}</li>
            </ul>
            <i class="icon-keyboard_arrow_down" @click="invoke(page + 1)" v-if="total - page > 0"></i>
        </div>
        <validator name="goToValidation">
            <form class="pagerGoto">
                <span>{{total}}</span>
                <input type="text" placeholder="page" v-model='goToPage' v-validate:goToPage="['required', 'numeric']">
                <button :disabled="$goToValidation.invalid" @click.prevent="goTo">Go</button>
            </form>
        </validator>
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
                goToPage: ''
            };
        },
        methods: {
            invoke(page) {
                this.$dispatch('invoke', { currentPage: Number(page) });
            },
            goTo() {
                this.$dispatch('invoke', { currentPage: Number(this.goToPage) });
            }
        },
        ready() {
            this.$on('listReady', (data) => {
                this.page = data.currentPage;
                this.pageArray = creatNavPage(data.currentPage, data.pages, 5);
                this.total = data.pages;
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
<style lang="sass">
    #pager {
        width: 120px;
        flex:0 0 auto!important;
        background-image:url('../assets/images/pagerBg.jpg');
        &:before {
            content:'';
            position: absolute;
            background-color:rgba(#2e3b4b,0.8);
            width: 100%;
            height: 100%;
            z-index: 0;
            border-radius:5px;
        }
        &:after {
            content:"\e41d"!important;
            color: white;
        }
    }
    .pagerCon {
        margin:auto;
        width: 100%;
        height: 100%;
        padding-top: 40px;
        position: relative;
        i,li {
            display: block;
            color:white;
            font-family: 'diner-regularregular';
            font-size: 30px;
            width: 40px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            background-color:rgba(255,255,255,0.2);
            border-radius: 2px;
            margin:auto;
            margin-bottom:5px;
            cursor: pointer;
            transition:all 0.2s ease;
            &:hover,&.current {
                background-color:rgba(57, 204, 204,0.5);
            }
            &.current {
                cursor: not-allowed;
                ponter-evnets:none;
            }
        }
        li {
            line-height: 46px;
            letter-spacing: 2px;
        }
    }
    .pagerGoto {
        width:100%;
        padding-bottom:40px;
        position: relative;
        span,input,button {
            width: 40px;
            height: 40px;
            box-sizing:border-box;
            border:none;
            border-radius:2px;
            display: block;
            margin:auto;
            font-family: 'diner-regularregular';
            text-transform:uppercase;
            letter-spacing: 2px;
            background-color:rgba(255,255,255,0.2);
            color:white;
            text-align: center;
            line-height: 45px;
            margin-bottom: 5px;
        }
        button {
            font-size: 30px;
            margin-bottom: 0px;
            cursor: pointer;
            transition:all 0.2s ease;
            &:hover {
                background-color:rgba(57, 204, 204,0.5);
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
</style>