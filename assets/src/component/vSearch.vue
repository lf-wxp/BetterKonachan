<template>
    <section class="search">
        <form novalidate class="sForm">
            <input type="search" v-model="searchText" name="search" class="sInput" :class="[ isCollpase ? 'collpase': '']">
            <button @click.prevent="submit" class="sButton">search</button>
        </form>
    </section>
</template>
<script lang="ts">
import * as Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';

@Component
export default class VSearch extends Vue {
    searchText: string = '';
    isCollpase: boolean = true;
    tempPage: number = 1;
    @State tags!: string;
    @State page!: number;
    @Mutation('SETPAGE') setPage!: Function;
    @Mutation('SETTAGS') setTags!: Function;

    @Watch('searchText')
    onSearchText(val: string) {
        if (!val && !this.isCollpase) {
            this.setTags('');
            this.setPage(this.tempPage);
        }
    }
    @Watch('page')
    onPage(val: number) {
        if (!this.searchText) {
            this.tempPage = val;
        }
    }

    submit() {
        if (this.isCollpase) {
            this.isCollpase = false;
        } else {
            if (this.searchText) {
                this.setTags(this.searchText);
                this.setPage(1);
            } else {
                this.isCollpase = true;
            }
        }
    }
    created() {
        this.tempPage = this.page;
    }
}
</script>
<style scoped>
:root {
    --teal: #39cccc;
}
.search {
    overflow: hidden;
    position: absolute;
    z-index: 1;
    left: 40px;
}
.sForm {
    box-sizing: border-box;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-content: center;
    align-items: space-between;
}
.sInput {
    flex: 1 1 auto;
    font-size: 16px;
    background-color: rgba(255, 255, 255, 0.7);
    display: block;
    box-sizing: border-box;
    color: #747474;
    border: none;
    padding: 5px 10px;
    transition: all 0.2s ease;
    margin-left: auto;
    font-family: 'Aldo-SemiBold';
    margin-right: auto;
    outline: none;
    width: 190px;
    transition: width 0.2s ease-in;
    &:focus {
        background-color: color(var(--teal) a(30%));
        color: white;
    }
    &.collpase {
        width: 0;
        padding: 0;
    }
}
.sButton {
    flex: 0 0 auto;
    display: block;
    background-color: color(var(--teal) a(50%));
    border: none;
    border-radius: 2px;
    color: white;
    cursor: pointer;
    padding: 10px 20px;
    box-sizing: border-box;
    font-size: 16px;
    transition: all 0.2s ease;
    margin: auto;
    outline: none;
    &:hover {
        background-color: color(var(--teal) a(80%));
    }
    &[disabled] {
        background-color: color(gray a(30%));
    }
}
</style>
