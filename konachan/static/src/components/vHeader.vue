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
            new Bubble(document.querySelector('#header canvas'));
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