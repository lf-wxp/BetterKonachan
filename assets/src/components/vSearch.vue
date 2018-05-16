<template>
    <section id="search">
        <form novalidate class="sForm">
            <input type="search" v-model="searchText" name="search" placeholder="search" class="sInput">
            <button :disabled="!searchText" @click.prevent="submit" class="sButton">search</button>
        </form>
    </section>
</template>
<script lang="ts">
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { getSession, setSession } from 'src/service';

@Component
export default class vSearch extends Vue {
    searchText: string = '';
    @State tags!: string;

    submit() {
        this.tags = this.searchText;
    }
    // @Watch()
    // searchText(val) {
    //     setSession('tags', val);
    //     if (getSession('backCurrentPage') && !val) {/* 当搜索清楚时，恢复此前浏览的具体页面*/
    //         const backPage = getSession('backCurrentPage');
    //         setSession('currentPage', backPage);
    //         this.$dispatch('invoke', { currentPage: backPage });
    //     }
    // }
}
</script>
<style scoped>
:root {
    --teal: #39cccc;
}
#search {
    max-width: 600px;
    overflow: hidden;
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
    font-size: 30px;
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
    &:focus {
        background-color: rgba(var(--teal), 0.3);
        color: white;
    }
}
.sButton {
    flex: 0 0 auto;
    display: block;
    background-color: rgba(var(--teal), 0.5);
    border: none;
    border-radius: 2px;
    color: white;
    cursor: pointer;
    font-family: 'Aldo-SemiBold';
    padding: 10px 20px;
    box-sizing: border-box;
    font-size: 30px;
    font-weight: bold;
    letter-spacing: 5px;
    transition: all 0.2s ease;
    margin: auto;
    &:hover {
        background-color: rgba(var(--teal), 0.8);
    }
}
</style>
