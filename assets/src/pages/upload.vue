<template>
    <article class="fileUpload">
        <div class="dragDrop">
            <form enctype="multipart/form-data" method="post" id="file-form" class="fileForm">
                <input type="file" name="files[]" multiple="" class="fileInput">
                <div class="fileBtns">
                    <button class="fileBtn">选择文件</button>
                    <button class="fileBtn">上传</button>
                </div>
            </form>
        </div>
        <div class="fileProcessbar"><span class="fileInBar" style="width: 30%"></span></div>
        <div class="filePreview">
            <div class="file1">
            <i class="fa-check fa"></i>
            <p class="processbar process1 tiny">
                <span style="width: 100%;"></span>
                </p>
                <p>
                    <span>Type:jpg</span><span>Size:375K</span></p><img src="">
                    <span class="name">[www.win8mi.com]5 (2).jpg</span></div>
        </div>
    </article>
</template>
<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component
export default class Upload extends Vue {}
</script>

<style scoped>
:root {
    --baseC: #39cccc;
    --barC: #3399ff;
    --barFinalC: #5bbd72;
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
    background: color(var(--baseC) a(50%));
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
&.active {
    border-color: darken(#dcdcdc, 10%);
}
.filePreview {
    border: none;
    font-size: 0px;
    & > div {
        display: inline-block;
        margin: 5px;
        width: 200px;
        text-align: center;
        overflow: hidden;
        position: relative;
        height: 220px;
        animation: show 0.5s ease-in-out both;
        .fa-file {
            font-size: pxToRem(70px);
            width: 100%;
            height: 180px;
            text-align: center;
            line-height: 180px;
        }
        & > span {
            text-align: center;
            display: inline-block;
            vertical-align: middle;
            font-size: pxToRem(14px);
            color: $textcol;
            width: 100%;
            box-sizing: border-box;
        }
        & > p {
            position: absolute;
            top: 0px;
            margin: 0px;
        }
        i:nth-child(1) {
            position: absolute;
            right: 0px;
            top: 5px;
            font-size: pxToRem(18px);
            margin: 0px;
        }
        .fa-remove {
            color: $blue;
            cursor: pointer;
            &:before {
                transition: all 0.2s ease-in-out;
                opacity: 0.1;
            }
        }
        .fa-warning {
            color: $red;
        }
        .fa-check {
            color: #5bbd72;
        }
        &:hover {
            i.fa-remove:before,
            i.resume:before {
                opacity: 0.8;
            }
        }
        .resume {
            position: absolute;
            left: 50%;
            top: 50%;
            color: $blue;
            width: pxToRem(50px);
            height: pxToRem(50px);
            margin: pxToRem(-25px) 0 0 pxToRem(-25px);
            font-size: pxToRem(50px);
            cursor: pointer;
            transform: translate(0, -50%);
            &:before {
                transition: all 0.2s ease-in-out;
                opacity: 0.3;
            }
        }
    }
    img {
        max-width: 200px;
        display: inline-block;
        vertical-align: middle;
    }
    p:last-of-type {
        top: 200px;
        width: 100%;
        height: 20px;
        font-size: pxToRem(12px);
        color: $textcol;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        background: white;
        span {
            flex: auto 0 0;
        }
    }
    .name {
        position: absolute;
        background: white;
        top: 182px;
        left: 0px;
        height: 20px;
        overflow: hidden;
        border-top: 1px solid $teal;
        font-size: pxToRem(12px);
    }
}
.exist {
    font-size: pxToRem(12px);
    background: rgba(255, 0, 0, 0.5);
    color: white;
    padding: 5px;
    border-radius: 4px;
    position: absolute;
    right: 20px;
    top: 20px;
    transform: rotate(30deg);
}
.fileUpload {
}

.upload.notice {
    position: fixed;
    background: rgba(102, 180, 255, 1);
    color: white;
    padding: 5px 10px;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    top: 0px;
    left: 50%;
    height: 30px;
    margin-top: -30px;
    box-sizing: border-box;
    transform: translate(-50%, 0);
}
.fileProcessbar {
    width: 100%;
    height: 20px;
    margin: 10px 0px;
    border: none;
    position: relative;
    background: color(#dcdcdc tint(10%));
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
    &[style*='width'] {
        padding-right: 10px;
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
@for $i from 1 through 9 {
    span[style*='width: #{$i}%'] {
        background: lighten(#3399ff, 20%);
    }
}
</style>

