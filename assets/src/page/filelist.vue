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
import { Component, Vue } from 'vue-property-decorator';
import { getFileList, extract } from '~service';
import vNotice from '~component/vNotice.vue';

import { IZipFile } from '~model/zipFile';
import { IResponse } from '~model/response';
import { IServiceHttpRes, isValidRes } from '~cModel/service';

@Component({
    components: {
        vNotice
    }
})
export default class Filelist extends Vue {
    public items: IZipFile[] = [];
    public isNotice: boolean = false;
    public notice: string = '';

    public async beforeCreate(): Promise<void> {
        const res: IServiceHttpRes<IResponse<IZipFile[]>> = await getFileList.http({});
        if (isValidRes<IZipFile[]>(res)) {
            this.items = res.data.data;
        }
    }

    public async extractFile(item: string): Promise<void> {
        const res: IServiceHttpRes<IResponse> = await extract.http({
            data: {
                name: item
            }
        });
        if (isValidRes(res)) {
            this.notice = res.data.msg;
        }
        this.isNotice = true;
    }
}
</script>
<style  lang="postcss">
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
    height: 30px;
    padding:5px 0;
    border-bottom: 1px solid #dcdcdc;
}
.fileIcon {
    font-size: 20px;
    flex: 0 0 auto;
}
.fileName {
    flex: 0 0 auto;
    line-height: 30px;
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
    background: var(--themeBaseColor);
    cursor: pointer;
    color:white;
    line-height: 30px;
}
</style>

