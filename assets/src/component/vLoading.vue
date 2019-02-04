<!-- <v-loading:show=''></v-loading> -->
<template>
    <div class="loadingDimmer">
        <fingerprint-spinner
            :animation-duration="1500"
            :size="64"
            color="#39cccc"
            class="lLoading"
            :noFadeIn="true"
        />
    </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { FingerprintSpinner } from 'epic-spinners';

@Component({
    components: {
        FingerprintSpinner
    }
})
export default class VLoading extends Vue {}
</script>
<style lang="postcss" scoped>
.loadingDimmer {
    position: absolute;
    height: 100%;
    width: 100%;
    min-height: 100px;
    top: 0;
    left: 0;
    background: rgba(255, 255, 255, 0);
}
.lLoading {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
}
</style>
