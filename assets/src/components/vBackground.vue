<template>
    <figure>
        <img :src="ablumImg" class="bgImage">
    </figure>
</template>
<script lang="ts">
    import Vue from 'vue';
    import { State } from 'vuex-class';
    import { Component } from 'vue-property-decorator';
    @Component
    export default class vBackground extends Vue {
        @State('bgUrl') ablumImg!: string
    }
</script>
<style>
figure {
    position: absolute;
    margin: 0;
    padding:0;
    width: 100%;
    height: 70vh;
    left: 0;
    top: 0;
    filter: blur(5px);
    &:after {
        display: block;
        position: relative;
        background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0, #252323 100%);
        margin-top: -150px;
        height: 150px;
        width: 100%;
        content: '';
    }
}
.bgImage {
    display: block;
    width:100%;
    height: 100%;
    object-fit: cover;
    object-position: top center;
}
</style>
