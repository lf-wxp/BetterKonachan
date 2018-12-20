<template>
    <div class="notice">
        {{ message }}
    </div>
</template>
<script lang="ts">
import * as Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component
export default class VNotice extends Vue {
    @Prop() isNotice!: boolean;

    @Prop() message!: string;

    mounted() {
        this.$el.addEventListener('animationend', () => {
            this.$emit('update:isNotice', false);
            this.$emit('update:message', '');
        });
    }
}
</script>
<style scoped>
:root {
    --baseC: #99ccff;
}
@keyframes slide {
    0% {
        transform: translate(-50%, -100%);
    }
    15% {
        transform: translate(-50%, 0);
    }
    85% {
        transform: translate(-50%, 0);
    }
    100% {
        transform: translate(-50%, -100%);
    }
}
.notice {
    position: fixed;
    background: var(--baseC);
    color: white;
    padding: 5px 20px;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    top: 0px;
    left: 50%;
    box-sizing: border-box;
    transition: transform 0.2s ease-in-out;
    transform: translate(-50%, -100%);
    animation: slide 2s ease both;
}
</style>

