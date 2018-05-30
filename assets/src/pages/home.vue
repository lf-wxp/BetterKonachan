<template>
    <div id="wrap">
        <v-background/>
        <v-header/>
        <v-pager/>
        <v-search/>
        <v-setting/>
        <v-music/>
        <v-list/>
    </div>
</template>

<script lang="ts">
import 'css/_base.css';
import 'normalize.css';
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import vHeader from 'src/components/vHeader.vue';
import vMusic from 'src/components/vMusic.vue';
import vBackground from 'src/components/vBackground.vue';
import vPager from 'src/components/vPager.vue';
import vList from 'components/vList.vue';
import vSetting from 'components/vSetting.vue';
import vSearch from 'components/vSearch.vue';
@Component({
    components: {
        vSearch,
        vHeader,
        vPager,
        vMusic,
        vBackground,
        vList,
        vSetting,
    },
})
export default class Home extends Vue {}
</script>
<style>
#wrap {
    font-size: 20px;
    overflow: hidden;
    box-sizing: border-box;
    background-repeat: no-repeat;
    background-size: cover;
    background-color: #252323;
    min-height: 100vh;
    background-blend-mode: multiply;
    section {
        position: relative;
        box-sizing: border-box;
        background-repeat: no-repeat;
        margin-bottom: 0px;
    }
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

