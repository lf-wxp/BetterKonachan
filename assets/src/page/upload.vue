<template>
    <article class="fileUpload">
        <v-notice :is-notice.sync="isNotice" :message.sync="notice" v-if="isNotice"/>
        <div class="dragDrop">
            <form enctype="multipart/form-data" method="post" class="fileForm">
                <input type="file" name="files[]" multiple="" class="fileInput" @change="selectFile($event)">
                <div class="fileBtns">
                    <button class="fileBtn" @click.prevent="emulateInput">选择文件</button>
                    <button class="fileBtn" @click.prevent="uploadQueue">上传</button>
                </div>
            </form>
        </div>
        <div class="fileProcessbar"><span class="fileInBar" :style="totalBar"> {{ totalBar.width }}</span></div>
            <transition-group name="fade" tag="div" class="filePreview">
                <div class="filePreviewItem" v-for="file of files" :key="file.file.name">
                    <i class="icon-close filePreviewIcon" @click="remove(file)"></i>
                    <div class="fileProcessbar tiny filePreivewBar" v-if="file.isStart">
                        <span class="fileInBar" :style="file.processBar"></span>
                    </div>

                    <img v-if="file.file.type.match('image')" :src="file.file | fileRead" class="filePreviewImg">

                    <div v-else class="filePreviewCon">
                        <i class="icon-file-zip"></i>
                    </div>
                    <div class="filePreviewInfo">
                        <span>Type:{{ file.file.type }}</span><span>Size: {{ file.file.size | fileSize }}</span>
                    </div>
                    <span class="filePreviewName">{{ file.file.name }}</span>
                </div>
            </transition-group>
    </article>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import vNotice from '~component/vNotice.vue';
import { EventEmitter } from 'events';

import { IResponse } from '~model/response';
import { EStateType } from '~model/message';

@Component({
    components: {
        vNotice
    },
    filters: {
        fileRead(val: File): string {
            return window.URL.createObjectURL(val);
        },
        fileSize(val: number): string {
            let num: number = val;
            let i: number = -1;
            const unit: string[] = ['K', 'M', 'G'];
            while (num >= 1024) {
                num = num / 1024;
                i += 1;
            }

            return `${Math.trunc(num)}${unit[i]}`;
        }
    }
})
export default class Upload extends Vue {
    public notice: string = '';
    public isNotice: boolean = false;
    public fileInput!: HTMLInputElement;
    public totalSize: number = 0;
    public uploadedSize: number = 0;
    public splitSize: number = 1;
    public ws!: WebSocket;
    public files: uploadFile[] = [];
    public ee: EventEmitter = new EventEmitter();

    get totalBar(): { width: string } {
        const percent: number = this.uploadedSize / this.totalSize * 100;

        return {
            width: `${Math.trunc(percent)}%`
        };
    }

    public emulateInput(): void {
        this.fileInput.click();
    }
    public selectFile(e: Event): void {
        const files: FileList = <FileList>(<HTMLInputElement>e.target).files;
        Array.from(<FileList>files)
        .forEach((item: File) => {
            this.totalSize += item.size;
            this.files.push({
                file: item,
                isSuccess: false,
                isStart: false,
                available: true,
                processBar: {
                    width: '0%'
                }
            });
        });
    }

    public remove(file: uploadFile): uploadFile[] | void {
        this.files = this.files.filter((item: uploadFile) => {
            if (item.file.name === file.file.name) {
                this.totalSize -= file.file.size;
            }

            return item.file.name !== file.file.name;
        });
    }

    public uploadQueue(): void {
        this.files.forEach((item: uploadFile) => {
            item.available && this.upload(item);
        });
    }

    public pendding(): Promise<boolean> {
        return new Promise((resolve: (value?: boolean | PromiseLike<boolean> | undefined) => void): void => {
            this.ee.on('notice', () => {
                resolve(true);
            });
        });
    }

    public async upload(file: uploadFile): Promise<void> {
        const size: number = this.splitSize * 1024 * 1024;
        const length: number = file.file.size;
        let left: number = length;
        let start: number = 0;
        let end: number = size > length ? length : size;
        this.ws.send(file.file.name);
        file.isStart = true;
        while (left > 0 && await this.pendding()) {
            const s: Blob = file.file.slice(start, end);
            this.ws.send(s);
            left = left - (end - start);
            file.processBar.width = `${(length - left) / length * 100}%`;
            this.uploadedSize += end - start;
            start = end;
            end = size > left ? end + left : end + size;
        }
        file.available = false;
        this.ws.send('');
    }

    // readFile(file: File) {}

    public beforeCreate(): void {
        const protocol: string = location.protocol === 'https:' ? 'wss' : 'ws';
        this.ws = new WebSocket(`${protocol}://${location.host}/ws`);
        this.ws.addEventListener('message', (ms: MessageEvent) => {
            console.log('data for server', ms.data);
            const j: IResponse<string> = JSON.parse(ms.data);
            if (j.state === EStateType.Success) {
                this.isNotice = true;
                this.notice = j.data;
            } else if (j.state === EStateType.Notice) {
                console.log('onMessage', j);
                this.ee.emit('notice');
            }
        });
    }
    public mounted(): void {
        this.fileInput = <HTMLInputElement>document.querySelector('.fileInput');
    }
}
</script>

<style  lang="postcss" scoped>
:root {
    --baseC: #39cccc;
    --barC: #3399ff;
    --barFinalC: #5bbd72;
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
    opacity: 0;
}
.fade-move {
    transition: transform 1s;
}
@keyframes show {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
@keyframes process {
    0% {
        opacity: 0.3;
        width: 0;
    }
    100% {
        opacity: 0;
        width: 100%;
    }
}
.fileUpload {
    width: 100%;
}
.fileForm {
    flex: 0 0 auto;
}
.dragDrop {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    height: 300px;
    border: 6px dashed #dcdcdc;
    transition: all 0.2s ease-in-out;
}
.fileBtns {
    display: flex;
    justify-content: center;
    align-items: center;
}
.fileBtn {
    padding: 10px;
    border-radius: 2px;
    background: color(var(--baseC) alpha(50%));
    border: none;
    color: white;
    cursor: pointer;
    margin: 10px;
    outline: none;
    transition: background 0.2s ease;
    &:hover {
        background-color: var(--baseC);
    }
}
input[type='file'] {
    display: none;
}
.filePreview {
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-content: flex-start;
}
.filePreviewItem {
    height: 200px;
    width: 200px;
    flex: 0 0 auto;
    margin: 20px;
    position: relative;
}
.filePreivewBar {
    position: absolute;
    left: 0;
    top: 0;
}
.filePreviewIcon {
    position: absolute;
    right: 0;
    top: 0;
    font-size: 14px;
    color: var(--baseC);
    cursor: pointer;
}
.filePreviewImg {
    display: block;
    height: 160px;
    width: 100%;
    object-fit: contain;
    object-position: top center;
}
.filePreviewCon {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    height: 160px;
    & i {
        font-size: 80px;
    }
}
.filePreviewInfo {
    height: 20px;
    line-height: 20px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    flex-flow: row nowrap;
    align-items: stretch;
    border-top: 1px solid var(--baseC);
    font-size: 12px;
    & > span {
        flex: 0 0 auto;
    }
}
.filePreviewName {
    height: 20px;
    display: block;
    font-size: 12px;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.fileNotice {
    position: fixed;
    background: var(--baseC);
    color: white;
    padding: 5px 10px;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    top: 0px;
    left: 50%;
    box-sizing: border-box;
    transition: transform 0.2s ease-in-out;
    transform: translate(-50%, -100%);
    &.active {
        transform: translate(-50%, 0);
    }
}
.fileProcessbar {
    width: 100%;
    height: 20px;
    margin: 10px 0px;
    border: none;
    position: relative;
    background: color(#dcdcdc tint(10%));
    &.tiny {
        height: 5px;
        margin: 0;
    }
}

.fileInBar {
    width: 0%;
    height: 100%;
    position: relative;
    border-radius: 5px;
    transition: all 0.2s ease-in-out;
    box-sizing: border-box;
    display: block;
    line-height: 20px;
    text-align: right;
    color: white;
    font-size: 12px;
    background: color(var(--barC) tint(20%));
    &:after {
        content: '';
        opacity: 0;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #fff;
        animation: process 2s ease 0s infinite;
    }
    &[style*='width: 3'],
    &[style*='width: 4'] {
        background: color(var(--barC) tint(10%));
    }
    &[style*='width: 5'],
    &[style*='width: 6'],
    &[style*='width: 7'] {
        background: color(var(--barC) tint(5%));
    }
    &[style*='width: 8'],
    &[style*='width: 9'] {
        background: #66da81;
    }
    &[style*='width: 100'] {
        background: var(--barFinalC);
        &:after {
            animation: none;
        }
    }
}
</style>

