<!-- <v-loading:show=''></v-loading> -->
<template>
    <div class="loadingDimmer4" :class="[ show ? '' : 'hide']">
        <div class="loading4">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
    </div>
</template>
<script>
    export default {
        props: ['show']
    };
</script>
<style lang="sass">
    .loadingDimmer4 {
        position: absolute;
        width:100%;
        height: 100%;
        background-color:rgba(25, 41, 62, 0.8);
        border-radius: 5px;
        left: 0px;
        top: 0px;
        visibility: visible;
        opacity: 1;
        transition: all 0.2s ease;
        &.hide {
            opacity: 0;
            visibility: hidden;
        }
    }
    .loading4 {
        position: absolute;
        width:40px;
        height: 40px;
        left: 0px;
        top: 0px;
        bottom:0px;
        right: 0px;
        margin:auto;
        transform:rotate(-45deg);
        span {
            display:block;
            bottom:0px;
            width: 20px;
            height: 20px;
            background:#9b59b6;
            position:absolute;
            &:nth-child(1) {
                animation: preloader_2_1 1.5s infinite ease-in-out;
            }
            &:nth-child(2) {
                left: 20px;
                animation: preloader_2_2 1.5s infinite ease-in-out;
            }
            &:nth-child(3) {
                top: 0px;
                animation: preloader_2_3 1.5s infinite ease-in-out;
            }
            &:nth-child(4) {
                top: 0px;
                left: 20px;
                animation: preloader_2_4 1.5s infinite ease-in-out;
            }
        }
    }
    @keyframes preloader_2_1 {
        0% {transform: translateX(0px) translateY(0px)  rotate(0deg); border-radius:0px;}
        50% {transform: translateX(-20px) translateY(-10px) rotate(-180deg); border-radius:20px;background:#3498db;}
        80% {transform: translateX(0px) translateY(0px) rotate(-360deg); border-radius:0px;}
         100% {transform: translateX(0px) translateY(0px) rotate(-360deg); border-radius:0px;}
    }
    @keyframes preloader_2_2 {
        0% {transform: translateX(0px) translateY(0px)  rotate(0deg);border-radius:0px;}
        50% {transform: translateX(20px) translateY(-10px) rotate(180deg);border-radius:20px;background:#f1c40f;}
        80% {transform: translateX(0px) translateY(0px) rotate(360deg);border-radius:0px;}
        100% {transform: translateX(0px) translateY(0px) rotate(360deg);border-radius:0px;}
    }
    @keyframes preloader_2_3 {
        0% {transform: translateX(0px) translateY(0px)  rotate(0deg);border-radius:0px;}
        50% {transform: translateX(-20px) translateY(10px) rotate(-180deg); border-radius:20px;background:#2ecc71;}
        80% {transform: translateX(0px) translateY(0px) rotate(-360deg);border-radius:0px;}
         100% {transform: translateX(0px) translateY(0px) rotate(-360deg); border-radius:0px;}
    }
    @keyframes preloader_2_4 {
        0% {transform: translateX(0px) translateY(0px)  rotate(0deg); border-radius:0px;}
        50% {transform: translateX(20px) translateY(10px) rotate(180deg); border-radius:20px;background:#e74c3c;}
        80% {transform: translateX(0px) translateY(0px) rotate(360deg); border-radius:0px;}
         100% {transform: translateX(0px) translateY(0px) rotate(360deg);border-radius:0px;}
    }
</style>