<template>
    <div id="wrap">
        <v-background/>
        <article class="top">
            <v-search/>
            <v-music/>
            <v-header/>
        </article>
        <article/>
        <article/>
        <!-- <v-list></v-list> -->
        <!-- <v-footer/> -->
        <!-- <v-pager/> -->
        <!-- <v-setting></v-setting> -->
    </div>
</template>

<script lang="ts">
import 'css/_base.css';
import "normalize.css";
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import vHeader from 'src/components/vHeader.vue';
import vMusic from 'src/components/vMusic.vue';
import vBackground from 'src/components/vBackground.vue';
// import vPager from 'src/components/vPager.vue';
// import vList from 'components/vList.vue';
// import vSetting from 'components/vSetting.vue';
// import vFooter from 'src/components/vFooter.vue';
import vSearch from 'components/vSearch.vue';
@Component({
    components: {
        vSearch,
        vHeader,
        // vPager,
        vMusic,
        vBackground,
        // vList,
        // vSetting,
        // vFooter
    }
})
export default class App extends Vue {}
</script>
<style>
#wrap {
    font-size: 20px;
    min-height: 100vh;
    min-width: 460px;
    padding: 1px;
    overflow: hidden;
    box-sizing: border-box;
    background-repeat: no-repeat;
    background-size: cover;
    background-color: #252323;
    background-blend-mode: multiply;
    > article {
        display: flex;
        flex-flow: row nowrap;
        width: 100%;
    }
    section {
        position: relative;
        box-sizing: border-box;
        background-repeat: no-repeat;
        margin-bottom: 0px;
    }
}
.top {
    position: relative;
}
@media screen and (max-width: 745px) {
    article {
        flex-wrap: wrap !important;
    }
    #footer {
        margin-left: 10px !important;
    }
    #pager {
        flex: 1 1 auto !important;
    }
}
@media screen and (max-width: 745px) {
    article {
        &:nth-of-type(3) {
            flex-wrap: wrap !important;
        }
    }
    #footer {
        margin-left: 10px !important;
    }
    #Mmusic {
        flex: 1 0 360px !important;
        margin-right: 10px !important;
    }
}
@media screen and (max-width: 705px) {
    #Mmusic {
        margin-right: 10px !important;
        margin-left: 10px !important;
    }
}
::-webkit-scrollbar {
    width: 10px;
    height: 10px;
    background-color: #f5f5f5;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
    background-color: #f5f5f5;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
    -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
    background-color: #555;
}
</style>

