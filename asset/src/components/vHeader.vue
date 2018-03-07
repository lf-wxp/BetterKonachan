<template>
    <section id="header">
        <canvas></canvas>
        <h1>BetterKonachan</h1>
    </section>
</template>
<script>
    import Bubble from '../lib/bubbleBg.js';
    export default {
        data() {
            return {
                title: 'BetterKonachan',
                isDialog: false
            };
        },
        ready() {
            /* 由于使用flex 布局，在后面的模块没加载之前是占满整个父元素的，这样计算canvas的宽高有偏差
             * 所以放在定时器里
            */
            setTimeout(() => {
                new Bubble(document.querySelector('#header canvas'));
            }, 1000);
        }
    };
</script>
<style lang="sass">
    #header {
        background-image: url('../assets/images/headerBg.jpg');
        height: 220px;
        position: relative;
        overflow: hidden;
        canvas {
            position: absolute;
        }
        h1 {
            font-size: 80px;
            width:100%;
            height:100%;
            color:#C0CDDC;
            text-align: center;
            margin-top: 60px;
            font-family: 'diner-regularregular';
            letter-spacing: 4px;
        }
        &:after {
            color: white;
        }
    }
</style>
