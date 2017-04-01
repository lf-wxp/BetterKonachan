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
                    <input type="text"  placeholder="page" name="pager" v-model='goToPage' v-validate="'required|numeric'">
                </div>
                <button :disabled="errors.has('pager')" @click.prevent="goTo"><span>Go</span></button>
            </form>
        <div class="placeholder" @click='isActiveFun'></div>
    </section>
</template>
<script>
    import { mapGetters, mapActions } from 'vuex';
    export default {
        data() {
            return {
                goToPage: '',
                size: 4,
                isActive: false
            };
        },
        computed: {
            ...mapGetters(['cPage','tPage']),
            pageArray(){
                const half = Math.floor(this.size / 2);
                const navpage = [];
                const cPage = this.$store.getters.cPage;
                const tPage = this.$store.getters.tPage;
                if (cPage > half && cPage < tPage - half) {
                    for (let i = cPage - half, j = 0; j < this.size; j++, i++) {
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
        },
        methods: {
            ...mapActions(['setCPage']),
            invoke(page) {
                this.setCPage(page);
            },
            goTo() {
                this.setCPage(Number.parseInt(this.goToPage, 10));
            },
            isActiveFun() {
                this.isActive = !this.isActive;
            }
        },
        mounted() {
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
        }
    };
</script>
<style lang="sass" scoped>
    $itemSize:40px;
    $commonBg:rgba(0,0,0,1);
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
            >span {
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
        >span {
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