<template>
    <transition name="slide">
        <router-view></router-view>
    </transition>
</template>

<script lang="ts">
import '~css/_base.css';
import '~css/_icon.css';
import 'normalize.css';
import * as Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component
export default class App extends Vue {}
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
	opacity: 0;
}
</style>

