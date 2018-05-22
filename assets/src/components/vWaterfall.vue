<template>
    <transition-group tag="div" :style="style" class="waterfall" >
        <slot v-on:test="test"></slot>
    </transition-group>
</template>

<style scoped>
    .waterfall {
        position:relative;
    }
</style>

<script>
    export default {
        data(){
            return {
            }
        },
        props: {
            style: {
                default: {}
            },
            gap: {
                type: Number,
                default: 0
            },
            gapStyle: {
                type: String,
                default: 'between'
            }
        },
        methods: {
            test(){
                console.log('test event triggered')
            }
        },
        mounted(){
            this.$on('test', ()=>{
                console.log('test event triggered')
            })
        }
    }
</script>
