<template>
  <div id="wrap">
<!--     <article>
        <v-search></v-search>
    </article>
    <article>
        <v-list></v-list>
    </article>
    <article>
    </article> -->
        <!-- <v-header></v-header> -->
        <v-footer></v-footer>
        <!-- <v-pager></v-pager> -->
        <!-- <v-music></v-music> -->
        <!-- <v-setting></v-setting> -->
  </div>
</template>

<script>
    import vHeader from './components/vHeader.vue';
    import vMusic from './components/vMusic.vue';
    import vSearch from './components/vSearch.vue';
    import vPager from './components/vPager.vue';
    import vList from './components/vList.vue';
    import vSetting from './components/vSetting.vue';
    import vFooter from './components/vFooter.vue';
    export default {
        components: {
            vHeader,
            vMusic,
            vSearch,
            vPager,
            vList,
            vSetting,
            vFooter
        },
        ready() {
            this.$on('listReady', (data) => {
                this.$broadcast('listReady', data);
            });
            this.$on('invoke', (data) => {
                this.$broadcast('invoke', data);
            });
        }
    };

</script>

<style lang="sass">
    @import "./assets/sass/base/_normalize";
    @import "./assets/sass/help/_helper";
    @import "./assets/sass/components/_font";
    #wrap {
        font-size: 20px;
        background: #282828;
        min-height: 100vh;
        min-width: 460px;
        padding:1px;
        overflow: hidden;
        box-sizing: border-box;
        background-image: url('./assets/images/b3.jpg');
        background-repeat: no-repeat;
        background-size:cover; 
        background-color:#252323;
        background-blend-mode:multiply;
        >article {
            display: flex;
            flex-flow: row nowrap;
            justify-content:space-between;
            align-items: stretch;
            width: 100%;
            &:nth-of-type(2) {
                min-height:calc(100vh - 364px);
            }
        }
        section {
            position: relative;
            box-sizing:border-box;
            background-size:cover;
            background-repeat:no-repeat;
            margin-bottom: 0px;

        }
    }
    @media screen and (max-width:745px) {
        article {
            flex-wrap:wrap!important;
        }
        #footer {
            margin-left: 10px!important;
        }
        #pager {
            flex:1 1 auto!important;
        }
    }
    @media screen and (max-width:745px) {
        article {
            &:nth-of-type(3)  {
                flex-wrap:wrap!important;
            }
        }
        #footer {
            margin-left: 10px!important;
        }
        #Mmusic {
            flex:1 0 360px!important;
            margin-right: 10px!important;
        }
    }
    @media screen and (max-width:705px) {
        #Mmusic {
            margin-right:10px!important;
            margin-left: 10px!important; 
        }
    }
    ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
        background-color: #F5F5F5;
    }

    /*定义滚动条轨道 内阴影+圆角*/
    ::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
        background-color: #F5F5F5;
    }

    /*定义滑块 内阴影+圆角*/
    ::-webkit-scrollbar-thumb {
        -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
        background-color: #555;
    }
</style>

