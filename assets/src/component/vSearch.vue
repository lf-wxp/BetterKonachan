<template>
    <section class="search">
        <form novalidate class="sForm">
            <input type="search" v-model="searchText" name="search" class="sInput" :class="[ isCollpase ? 'collpase': '']">
            <button @click.prevent="submit" class="sButton">search</button>
        </form>
    </section>
</template>
<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';

@Component
export default class VSearch extends Vue {
    public searchText: string = '';
    public isCollpase: boolean = true;
    public tempPage: number = 1;
    @State public tags!: string;
    @State public page!: number;
    @Mutation('SETPAGE') public setPage!: Function;
    @Mutation('SETTAGS') public setTags!: Function;

    @Watch('searchText')
    public onSearchText(val: string): void {
        if (!val && !this.isCollpase) {
            this.setTags('');
            this.setPage(this.tempPage);
        }
    }
    @Watch('page')
    public onPage(val: number): void {
        if (!this.searchText) {
            this.tempPage = val;
        }
    }

    public submit(): void {
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
    public created(): void {
        this.tempPage = this.page;
    }
}
</script>
<style lang="postcss" scoped>
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
        background-color: color(var(--teal) alpha(30%));
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
    background-color: color(var(--teal) alpha(50%));
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
        background-color: color(var(--teal) alpha(80%));
    }
    &[disabled] {
        background-color: color(gray alpha(30%));
    }
}
</style>
