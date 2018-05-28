<template>
    <article class="fileUpload">
        <header>
            <h4>上传新文件</h4>
        </header>
        <div class="dragDrop">
            <form enctype="multipart/form-data" method="post" id="file-form">
                <input type="file" name="files[]" multiple="">
                <p>将文件拖到这里</p>
                <p>或</p>
                <div class="btns">
                    <button class="btn sliver add flat">选择文件</button>
                    <button class="btn sliver upload flat">上传</button>
                </div>
            </form>
        </div>
        <div class="processbar process1"><span></span></div>
            <div class="preview"></div>
    </article>
</template>
<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

export default class VUploader extends Vue {}
</script>
<style scoped>
</style>


