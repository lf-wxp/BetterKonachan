<template>
    <section id="search">
        <form action="" novalidate>
            <input type="search" placeholder="search">
            <button>search</button>
        </form>
    </section>
</template>
<script>
    import Vue from 'vue';
    import VueValidator from 'vue-validator';
    Vue.use(VueValidator);
</script>
<style lang="sass">
    #search {
        height: 230px;
    }
</style>