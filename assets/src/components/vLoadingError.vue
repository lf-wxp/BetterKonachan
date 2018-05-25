<!-- <v-loading:show=''></v-loading> -->
<template>
    <div class="loadingDimmerError" :class="[ show ? '' : 'hide']">
        <div class="loadingError">
            <p>load error </p>
            <button type="" @click="reload()">reloading</button>
        </div>
    </div>
</template>
<script>
    export default {
        methods: {
            reload() {
                this.$dispatch('reload');
            }
        }
    };
</script>
<style lang="sass">
    .loadingDimmerError {
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
        display:flex;
        flex-flow:row nowrap;
        justify-content:center;
        align-items:center;
        &.hide {
            opacity: 0;
            visibility: hidden;
        }
    }
    .loadingError {
        flex: 0 0 auto;
        text-align: center;
        button {
            display: block;
            background-color: rgba(57, 204, 204, 0.5);
            border: none;
            border-radius: 2px;
            color: white;
            cursor: pointer;
            font-family: 'diner-regularregular';
            padding: 10px 15px 5px 15px;
            box-sizing: border-box;
            font-size: 20px;
            font-weight: bold;
            letter-spacing: 3px;
            transition: all 0.2s ease;
            margin: auto;
            &:hover {
                background-color: rgba(57, 204, 204, 0.8);
            }
        }
        p {
            text-transform: capitalize;
            color:red;
            display:inline-block;
            font-size:14px;

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
