<template>
    <section id="header">
        <canvas></canvas>
        <h1>BetterKonachan</h1>
    </section>
</template>
<script lang="ts">
    import Bubble from '../modules/bubble';
    export default {
        data() {
            return {
                title: 'BetterKonachan',
                isDialog: false
            };
        },
        mounted() {
            /* 由于使用flex 布局，在后面的模块没加载之前是占满整个父元素的，这样计算canvas的宽高有偏差
             * 所以放在定时器里
            */
            setTimeout(() => {
                new Bubble(<HTMLCanvasElement>document.querySelector('#header canvas'));
            }, 1000);
        }
    };
</script>
<style>
    #header {
        background-size:cover;
        width:400px;
        height:100px;
        position:relative;
        overflow:hidden;
        canvas {
            position:absolute;
        }
        h1 {
            height:100%;
            width:100%;
            line-height: 100px;
            font-size:40px;
            color:#C0CDDC;
            text-align:center;
            font-family:'ZnikomitNo24';
            letter-spacing:4px;
        }
        &:after {
            color: white;
        }
    }
</style>
