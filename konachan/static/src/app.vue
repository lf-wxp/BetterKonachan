<template>
  <div id="wrap">
    <article>
        <v-header></v-header>
        <v-music></v-music>
        <v-search></v-search>
    </article>
    <article>
        <v-pager></v-pager>
        <v-list></v-list>
    </article>
    <article>
        <v-setting></v-setting>
        <v-footer></v-footer>
    </article>
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
        height: 100%;
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
            margin:10px;
            flex:1 1 auto;
            border-radius: 5px;
            box-sizing:border-box;
            background-size:cover;
            background-repeat:no-repeat;
            margin-bottom: 0px;
            &:after {
                position: absolute;
                right: 10px;
                top: 10px;
                content:"\e1ad";
                font-family: 'icomoon' !important;
                speak: none;
                font-style: normal;
                font-weight: normal;
                font-variant: normal;
                text-transform: none;
                line-height: 1;
                -webkit-font-smoothing: antialiased;
            }
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

