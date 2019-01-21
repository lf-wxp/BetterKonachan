<template>
    <transition name="slide">
        <router-view></router-view>
    </transition>
</template>

<script lang="ts">
import '~css/_base.css';
import '~css/_icon.css';
import 'normalize.css';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class App extends Vue {}

</script>
<style lang="postcss">
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
	opacity: 0;
}
</style>


