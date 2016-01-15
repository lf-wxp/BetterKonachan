<template>
    <section id="header">
        <h1>BetterKonachan</h1>
        <p></p>
    </section>
</template>
<script>
    export default {
        data() {
            return {
                title: 'BetterKonachan'
            };
        }
    };
</script>
<style lang="sass">
    #header {
        background-image: url('../assets/images/headerBg.jpg');
        height: 220px;
        h1 {
            font-size: 40px;
            color:white;
            text-align: center;
            margin-top: 20px;
        }
        &:after {
            color: white;
        }
    }

</style>