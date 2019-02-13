<!-- <v-loading:show=''></v-loading> -->
<template>
    <div class="loadingDimmer">
        <fingerprint-spinner
            :animation-duration="1500"
            :size="64"
            :color="themeColor"
            class="lLoading"
            :noFadeIn="true"
        />
    </div>
</template>
<script lang="ts">
import { State } from 'vuex-class';
import { Component, Vue } from 'vue-property-decorator';
import { FingerprintSpinner } from 'epic-spinners';

@Component({
    components: {
        FingerprintSpinner
    }
})
export default class VLoading extends Vue {
    @State('themeColor') public themeColor: string;
}
</script>
<style lang="postcss">
.loadingDimmer {
    position: absolute;
    block-size: 100%;
    inline-size: 100%;
    min-block-size: 100px;
    inset-block-start: 0;
    inset-inline-start: 0;
}
.lLoading {
    position: absolute;
    inset: 0 0 0 0;
    margin: auto;
}
</style>
