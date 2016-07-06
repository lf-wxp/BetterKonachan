<template>
    <section id="search">
        <validator name="validation">
            <form novalidate>
                <input type="search" v-model="searchText" placeholder="search" v-validate:searchText="['required']">
                <button :disabled="$validation.invalid" @click.prevent='submit'>search
                </button>
            </form>
        </validator>
    </section>
</template>
<script>
    import Vue from 'vue';
    import VueValidator from 'vue-validator';
    import { getSession, setSession } from '../servers/servers.js';
    Vue.use(VueValidator);
    export default {
        data() {
            return {
                searchText: ''
            };
        },
        watch: {
            searchText(val) {
                /* store the search text into sessionStorage for sharing data between components*/
                setSession('tags', val);
                if (getSession('backCurrentPage') && !val) {/* 当搜索清楚时，恢复此前浏览的具体页面*/
                    const backPage = getSession('backCurrentPage');
                    setSession('currentPage', backPage);
                    this.$dispatch('invoke', { currentPage: backPage });
                }
            }
        },
        methods: {
            submit() {
                /* 当搜索时，备份此前浏览到具体的页面 */
                const page = getSession('currentPage');
                setSession('backCurrentPage', page);
                /* 每次搜索开始页面都是从1开始*/
                this.$dispatch('invoke', { currentPage: 1 });
            }
        }
    };
</script>
<style lang="sass">
    @import "../assets/sass/base/_normalize";
    @import '../assets/sass/components/_colors';
    @import '../assets/sass/components/_form';
    @import '../assets/sass/components/_buttons';
    #search {
        max-width: 600px;
        overflow: hidden;
        form {
            box-sizing:border-box;
            display: block;
            display:flex;
            flex-flow:row nowrap;
            justify-content:center;
            align-content:center;
            align-items:space-between;
        }
        input {
            @include inputfocus;
            flex: 1 1 auto;
            font-size:30px;
            background-color:rgba(255,255,255,0.7);
            display: block;
            box-sizing:border-box;
            color:#747474;
            border:none;
            padding:5px 10px;
            transition:all 0.2s ease;
            margin-left:auto;
            font-family:'Aldo-SemiBold';
            margin-right:auto;
            &:focus {
                background-color:rgba($teal,0.3);
                color:white;
            }
        }
        button {
            flex: 0 0 auto;
            display: block;
            background-color:rgba($teal,0.5);
            border:none;
            border-radius: 2px;
            color:white;
            cursor: pointer;
            font-family:'Aldo-SemiBold';
            padding:10px 20px;
            box-sizing:border-box;
            font-size:30px;
            font-weight: bold;
            letter-spacing: 5px;
            transition:all 0.2s ease;
            margin:auto;
            &:hover {
                background-color:rgba($teal,0.8);
            }
        }
    }
</style>