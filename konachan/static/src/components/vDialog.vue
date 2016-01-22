<!-- <v-dialog :show.sync='isDialog' :message='message' :loadSuccess></v-dialog> -->
<template>
    <div id="dialog" :class="[show ? 'show' : '']" >
        <div class="dialogWrap">
            <div class="dialogCon" :class="[show ? 'show' : '']">
                <div class="dialogCustom">
                    <slot name="message">
                    </slot>
                    <slot name="image">
                    </slot>
                    <v-loading :show='showLoading'></v-loading>
                </div>
                <button class="dialogClear" @click.prevent="hideOff">close</button>
            </div>
        </div>
    </div>
</template>
<script>
    import vLoading from './vLoading2.vue';
    export default {
        data() {
            return {
                showLoading: false,
            };
        },
        props: ['loadSuccess', 'show', 'message'],
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
            }
        },
        components: {
            vLoading
        },
        methods: {
            hideOff() {
                this.showLoading = false;
                this.show = !this.show;
            }
        }
    };
</script>
<style lang="sass" scope>
    #dialog {
        position: fixed;
        background: rgba(25, 41, 62, 0.5);
        z-index: 10;
        width:100%;
        height: 100%;
        left: 0px;
        top: 0px;
        visibility: hidden;
        opacity: 0;
        transition: all 0.2s ease;
        display: table;
        &.show {
            visibility: visible;
            opacity: 1;
        }

    }
    .dialogWrap {
        display: table-cell;
        vertical-align: middle;
        text-align: center;

    }
    .dialogCon {
        opacity: 0;
        box-sizing:border-box;
        transform:scale(2);
        display: inline-flex;
        transition:all 0.2s ease;
        border-radius: 2px;
        background-color:rgba(#39CCCC,0.9);
        position: relative;
        min-height: 200px;
        min-width: 300px;
        color:white;
        flex-flow: column nowrap;
        justify-content: space-between;
        align-items: stretch;
        &.show {
            transform: scale(1);
            opacity: 1;
        }
        p {
            font-size: 16px;
            color:white;
            text-transform: capitalize;
            margin-bottom: 20px;
        }
    }
    .dialogCustom {
        padding:20px;
        box-sizing:border-box;
        flex:1 1 auto;
        position: relative;
    }
    .dialogClear {
        flex:0 0 auto;
        display: block;
        width:100%;
        background-color: darken(#39CCCC,10%);
        border: none;
        border-radius: 2px;
        color: white;
        cursor: pointer;
        font-family: 'diner-regularregular';
        padding: 10px 20px 5px 20px;
        box-sizing: border-box;
        font-size: 20px;
        font-weight: bold;
        letter-spacing: 5px;
        transition: all 0.2s ease;
        margin: auto;
        border-bottom-left-radius:2px;
        border-bottom-right-radius:2px;
        &:hover {
            background-color: darken(#39CCCC,15%);
        }
    }
    .loadingDimmer2 {
        border-bottom-left-radius:0px;
        border-bottom-right-radius:0px;
        border-top-left-radius:2px;
        border-top-right-radius:2px;
    }
</style>