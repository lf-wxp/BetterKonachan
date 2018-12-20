<!-- <v-loading:show=''></v-loading> -->
<template>
    <div class="loadingDimmer">
        <Spinner name="cube-grid" color="#39cccc" class="lLoading" :noFadeIn="true"/>
    </div>
</template>
<script lang="ts">
import * as Vue from 'vue';
import { Component } from 'vue-property-decorator';
import Spinner from 'vue-spinkit';

@Component({
    components: {
        Spinner,
    },
})
export default class VLoading extends Vue {}
</script>
<style scoped>
.loadingDimmer {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background: rgba(255, 255, 255, 0);
}
.lLoading {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
}
</style>
