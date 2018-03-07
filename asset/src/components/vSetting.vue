<template>
    <section id="setting">
        <div class="toggle">
            <input type="checkbox" id="security" v-model='securityMode' :checked="securityMode">
            <label for="security">Security mode<span></span> </label>
        </div>
        <div class="toggle">
            <input type="checkbox" id="page" v-model="rememberPage" :checked="rememberPage">
            <label for="page">Remember the last page you visited <span></span> </label>
        </div>
    </section>
</template>
<script>
    import { getLocal, setLocal, getSession } from '../servers/servers.js';
    export default {
        data() {
            return {
                securityMode: getLocal('securityMode') === undefined ? true : getLocal('securityMode'),
                rememberPage: getLocal('rememberPage')
            };
        },
        watch: {
            securityMode(val) {
                setLocal('securityMode', val);
                /* 更改模式后 刷新列表 */
                this.$dispatch('invoke', { currentPage: getSession('currentPage') });
            },
            rememberPage(val) {
                setLocal('rememberPage', val);
            }
        }
    };
</script>
<style lang="sass" scoped>
    #setting {
        background-image: url('../assets/images/settingBg.jpg');
        padding:20px;
        margin-bottom: 10px;
        display:flex;
        justify-content:center;
        align-items:flex-start;
        flex-flow:column nowrap;
        &:after {
            content:"\e8b8"!important;
            color: white;
        }
        &:before {
            content:'';
            position: absolute;
            background-color:rgba(#737a8f,0.5);
            width: 100%;
            height: 100%;
            z-index: 0;
            border-radius:5px;
            left: 0px;
            top: 0px;
        }
    }
    .toggle {
        position: relative;
        margin-bottom: 10px;
        flex:1 1 auto;
        input {
            display: none;
            &:not(:checked) + label {
                span:after {
                    content:"off";
                    color:#7F8C9A;
                    position: absolute;
                    left: 38px;
                    top: 6px;
                    font-size: 16px;
                }
            }
            &:checked +label {
                &:before {
                    background:rgba(#34495E,0.5);
                }
                &:after {
                    background: #39D2B4;
                    left: 40px;
                }
                span:before {
                    content:"on";
                    color:#39D2B4;
                    position: absolute;
                    left: 8px;
                    top: 6px;
                    font-size: 16px;
                }
            }
        }
        label {
            color:#C0CDDC;
            cursor: pointer;
            position: relative;
            padding-left:75px;
            font-family:"Open sans", "Segoe UI", "Segoe WP", Helvetica, Arial, sans-serif;
            font-size: 20px;
            &:after {
                content:"";
                position:absolute;
                width: 20px;
                height: 20px;
                transition: all .2s;
                border-radius: 50%;
                top: 5px;
                left: 5px;
                background:#7F8C9A;
            }
            &:before {
                content:"";
                position:absolute;
                background: rgba(#ddd,0.5);
                width: 65px;
                height: 30px;
                left: 0px;
                border-radius:15px;
                transition: background-color 0.2s ease;
            }
        }
    }
</style>
