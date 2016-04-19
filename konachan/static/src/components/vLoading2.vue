<!-- <v-loading:show=''></v-loading> -->
<template>
    <div class="loadingDimmer2" :class="[ show ? '' : 'hide']">
        <div class="loading2"></div>
    </div>
</template>
<script>
    export default {
        props: ['show']
    };
</script>
<style lang="sass">
    .loadingDimmer2 {
        position: absolute;
        left: 0px;
        top: 0px;
        width:100%;
        height: 100%;
        background-color:rgba(25, 41, 62, 0.8);
        border-radius: 5px;
        visibility: visible;
        opacity: 1;
        transition: all 0.2s ease;
        &.hide {
            opacity: 0;
            visibility: hidden;
        }
    }
    .loading2 {
        position:absolute;
        left: 0px;
        top: 0px;
        bottom:0px;
        right:0px;
        margin:auto;
        width:20px;
        height: 20px;
        transform:rotate(-45deg);
        &:after {
            width:20px;
            height:20px;
            border-radius:20px;
            background:blue;
            content:'';
            left: 0px;
            position:absolute;
            background:#2ecc71;
            animation: loadingAfter 1.5s infinite ease-in-out;
        }
        &:before {
            width:20px;
            height:20px;
            border-radius:20px;
            background:blue;
            content:'';
            left: 0px;
            position:absolute;
            background:#9b59b6;
            animation: loadingBefore 1.5s infinite ease-in-out;
        }
    }
    @keyframes loadingBefore {
        0% {transform: translateX(0px) rotate(0deg)}
        50% {transform: translateX(50px) scale(1.2) rotate(260deg); background:#2ecc71;border-radius:0px;}
        100% {transform: translateX(0px) rotate(0deg)}
    }
    @keyframes loadingAfter {
        0% {transform: translateX(0px)}
        50% {transform: translateX(-50px) scale(1.2) rotate(-260deg);background:#9b59b6;border-radius:0px;}
        100% {transform: translateX(0px)}
    }
</style>
