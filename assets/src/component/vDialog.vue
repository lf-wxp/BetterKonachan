<!-- <v-dialog :show.sync='isDialog' :message='message' :loadSuccess></v-dialog> -->
<template>
    <div id="dialog" :class="[show ? 'show' : '']" >
        <div class="dialogWrap" :class="[loadSuccess ? 'completed' : '']" :style="position">
            <div class="dialogCon" :class="[show ? 'show' : '']">
                <div class="dialogCustom">
                    <slot name="message">
                    </slot>
                    <slot name="image">
                    </slot>
                    <v-loading :show='showLoading'></v-loading>
                </div>
                <button class="dialogClear" @click.prevent="hideOff"><i class="icon-cross"></i></button>
            </div>
        </div>
    </div>
</template>
<script>
import vLoading from '@component/vLoading.vue';
export default {
    data() {
        return {
            showLoading: false,
            position: {},
        };
    },
    props: ['loadSuccess', 'show', 'message', 'sampleSize', 'samplePosition'],
    watch: {
        show(val) {
            if (val) {
                this.showLoading = true;
            }
        },
        loadSuccess(val) {
            if (val) {
                this.showLoading = false;
            }
        },
    },
    components: {
        vLoading,
    },
    computed: {
        position() {
            return {
                top: this.samplePosition.top + 'px',
                left: this.samplePosition.left + 'px',
            };
        },
    },
    methods: {
        hideOff() {
            this.showLoading = false;
            this.show = !this.show;
        },
    },
};
</script>
<style>
@import '../assets/sass/components/_icon';
#dialog {
    position: fixed;
    background: rgba(25, 41, 62, 0.5);
    z-index: 10;
    width: 100%;
    height: 100%;
    left: 0px;
    top: 0px;
    visibility: hidden;
    opacity: 0;
    transform-origin: left top;
    transition: all 0.2s ease;
    &.show {
        visibility: visible;
        opacity: 1;
    }
}
.dialogWrap {
    vertical-align: middle;
    text-align: center;
    box-sizing: content-box;
    width: 150px;
    height: 150px;
    position: absolute;
    transform-origin: center center;
    transition: all 0.2s ease;
    // transform:rotate(45deg) scale(1.1) ;
    &.completed {
        transform: rotate(-45deg) translate(-106.25px, -118px);
    }
}
.dialogCon {
    opacity: 1;
    box-sizing: border-box;
    transform: scale(2);
    transition: all 0.2s ease;
    border-radius: 2px;
    // background-color:rgba(#39CCCC,0.9);
    position: relative;
    min-height: 150px;
    min-width: 150px;
    color: white;
    &.show {
        transform: scale(1);
        opacity: 1;
    }
    &.completed {
        transform: scale(1) rotate(-45deg);
    }
    p {
        font-size: 16px;
        color: white;
        text-transform: capitalize;
        margin-bottom: 20px;
    }
}
.dialogCustom {
    // padding:20px;
    box-sizing: border-box;
    position: relative;
    display: inline-block;
}
.dialogClear {
    display: block;
    width: 100%;
    background-color: darken(#39cccc, 10%);
    border: none;
    border-radius: 2px;
    color: white;
    cursor: pointer;
    box-sizing: border-box;
    font-size: 20px;
    transition: all 0.2s ease;
    margin: auto;
    width: 35px;
    height: 35px;
    right: 0px;
    top: 0px;
    transform: translate(100%);
    position: absolute;
    i {
        display: block;
        width: 100%;
        height: 100%;
        text-align: center;
        line-height: 35px;
        transform: rotate(-45deg);
    }
    &:hover {
        background-color: darken(#39cccc, 15%);
    }
}
.loadingDimmer2 {
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
}
</style>
