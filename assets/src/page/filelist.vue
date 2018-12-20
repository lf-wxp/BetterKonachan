<template>
    <article class="fileList">
        <v-notice :is-notice.sync="isNotice" :message.sync="notice" v-if="isNotice"/>
        <ul class="fileContain">
            <li v-for="item of items" :key="item" class="fileItem">
                <span class="fileIcon">
                    <i class="icon-file-zip"></i>
                </span>
                <span class="fileName">{{ item }}</span>
                <div class="fileAction">
                    <span class="fileBtn" @click="extractFile(item)">Extract</span>
                </div>
            </li>
        </ul>
    </article> 
</template>
<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { getFileList, extract } from '~service';
import vNotice from '~component/vNotice.vue';

@Component({
    components: {
        vNotice,
    }
})
export default class Filelist extends Vue{
    items: string[] = [];
    isNotice: boolean = false;
    notice: string = '';

    async beforeCreate(){
        const res = await getFileList.http();
        this.items = res.data;
    }

    async extractFile(item: string) {
        const res = await extract.http({
            data: {
                name: item,
            },
        });
        this.notice = res.data.msg;
        this.isNotice = true;
    }
}
</script>
<style scoped>
:root {
    --btnC: #3399ff;
    --h: 30px;
}
.fileList {
    padding: 50px;
}
.fileContain {
    margin: 0;
    padding: 0;
}
.fileItem {
    font-size: 14px;
    display:flex;
    justify-content: space-between;
    align-items: stretch;
    height: var(--h);
    padding:5px 0;
    border-bottom: 1px solid #dcdcdc;
}
.fileIcon {
    font-size: 20px;
    flex: 0 0 auto;
}
.fileName {
    flex: 0 0 auto;
    line-height: var(--h);
}
.fileAction {
    flex: 0 0 auto;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: stretch;
}
.fileBtn {
    flex: 0 0 auto;
    padding: 0 20px;
    border-radius: 2px;
    border: none;
    background: var(--btnC);
    cursor: pointer;
    color:white;
    line-height: var(--h);
}
</style>

