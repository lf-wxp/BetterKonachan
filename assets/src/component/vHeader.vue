<template>
    <section class="header">
        <h1 class="hTitle">BetterKonachan</h1>
    </section>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class VHeader extends Vue {}
</script>
<style  lang="postcss">
.header {
    position: absolute;
    inline-size: 100%;
    display: flex;
    justify-content: center;
}
.hTitle {
    flex: 0 0 auto;
    block-size: 100%;
    inline-size: 100%;
    line-height: 100px;
    font-size: 40px;
    color: #c0cddc;
    text-align: center;
    font-family: 'diner-regularregular';
    letter-spacing: 4px;
    &:after {
        color: white;
    }
}
</style>
