<template>
    <section class="setting" :class="[ security ? 'active': '']">
        <label class="sToggle">
            <input type="checkbox" class="sSecurity" v-model="security">
            <span class="sFake"></span>
        </label>
    </section>
</template>
<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Getter, Mutation } from 'vuex-class';

@Component
export default class VSetting extends Vue {
    rememberPage: boolean = false;
    isOptionShow: boolean = false;
    @Getter('GETSECURITY') securityMode!: boolean;
    @Mutation SETSECURITY!: Function;

    set security(val: boolean){
        this.SETSECURITY(val);
    }
    get security() {
        return this.securityMode;
    }
    showOption(){
        this.isOptionShow = !this.isOptionShow;
    }
};
</script>
<style scoped>
:root {
    --teal: #39cccc;
}
.setting {
    width: 24px;
    height: 24px;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    border: 4px solid var(--teal);
    animation: breathSet 2s ease-in-out 0.5s infinite alternate-reverse both;
    &.active {
        & .sFake {
            transform: translate(100%, 100%);
        }
    }
}
.sToggle {
    display: block;
    height: 100%;
    cursor: pointer;
}
.sFake {
    position: absolute;
    width: 50%;
    height: 50%;
    transition: transform .2s ease;
    animation: breathItem 2s ease-in-out infinite alternate-reverse both; 
}
.sSecurity {
    position: absolute;
    opacity: 0; 
}
@keyframes breathSet {
    0% {
        border-color: transparent;
    }
    100% {
        border-color: color(var(--teal) tint(20%));
    }
}
@keyframes breathItem {
    0% {
        background: transparent;
    }
    100% {
        background: color(var(--teal) tint(20%));
    }
}
</style>
