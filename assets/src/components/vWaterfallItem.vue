<template>
    <div class="waterfall-item" v-show="isShow">
        <slot></slot>
    </div>
</template>

<style scoped>
    .waterfall-item {
        position: absolute;
        box-sizing:border-box;
    }
</style>

<script>
    export default {
        data() {
            return {
                isShow: true,
                conWidth: 0,
                gap: 0,
                grow: true,
                shrink: true,
            }
        },
        props: {
            width: {
                type: Number,
                required: true
            },
            height: {
                type: Number,
                required: true
            }
        },
        created() {
            const w = /(\d+)/.exec(window.getComputedStyle(this.$parent.$el).width);
            this.conWidth = w ? Number.parseInt(w[1],10) : 0;
            this.gap = this.$parent.$parent.gap;
            this.grow = this.$parent.$parent.grow;
            this.shrink = this.$parent.$parent.shrink;
            this.$emit('test');
        },
        methods: {
            getColumn() {
                let column = Math.floor(this.conWidth / this.width);
                let left = this.conWidth % this.width;
                return {column, left};
            }
        },
        mounted() {
        }
    }
</script>
