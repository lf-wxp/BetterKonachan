<template>
    <article class="auth">
        <v-notice v-if="isNotice" :is-notice.sync="isNotice" :message="message"/>
        <p class="aIntial" v-if="initial">Create a new user for uploading the media file</p>
        <form action="" class="aForm">
            <input class="aInput" type="text" placeholder="name" v-model="name">
            <input class="aInput" type="password" placeholder="password" v-model="password">
            <button class="aBtn" @click.prevent="submit">{{ btnText }}</button>
        </form>
    </article>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator';
import { userList, authorize, createAccount } from '@service';
import vNotice from '@component/vNotice.vue';

@Component({
    components: {
        vNotice,
    },
})
export default class Auth extends Vue { 
    name: string = '';
    password: string = '';
    initial: boolean = false;
    btnText: string = 'Submit';
    isNotice: boolean = false;
    message: string = '';

    async submit() {
        const data = {
            name: this.name,
            password: this.password,
        };
        let action = authorize;
        if (this.initial) {
            action = createAccount;
        }
        const res = await action.http({
            data
        });
        if (res.status === 200) {
            this.message = res.data.msg;
            this.isNotice = true;
            if (res.data.type === 'success') {
                window.localStorage.setItem('bk_name', res.data.data.name);
                window.localStorage.setItem('bk_password', res.data.data.password);
            }
            this.$router.push({
                name: 'upload',
            });
        }
    }

    async beforeMount() {
        const result = await userList.http();
        if (!result.data.length) {
            this.initial = true;
            this.btnText = 'Create a new account';
        } 
    }

};
</script>
<style scoped>
:root {
    --baseC: #39cccc;
    --borderC: #dcdcdc;
}
.auth {
    display: flex;
    width:100vw;
    height: 100vh;
    justify-content: center;
    align-items: center;
    flex-flow: column nowrap;
}
.aIntial {
    flex: 0 0 auto;
    font-size: 14px;
    color: gray;
    text-align: center;
    text-transform: capitalize;
    margin-bottom: 20px;
}
.aForm {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: row wrap;
    width: 300px;
}
.aInput,.aBtn {
    flex: 0 0 auto;
    height: 40px;
    border:1px solid var(--borderC);
    border-radius: 2px;
    box-sizing: border-box;
    width: 300px;
    line-height: 40px;
    padding: 0 10px;
    font-size: 14px;
    color: gray;
    outline: none;
    margin-bottom: 20px;
    transition:all .2s ease;
}
.aInput {
    &:focus {
        border-color: var(--baseC);
    }
}
.aBtn {
    color:white;
    border:none;
    background: var(--baseC);
    cursor: pointer;
    &:hover {
        background-color: color(var(--baseC) tint(10%));
    }
}
</style>

