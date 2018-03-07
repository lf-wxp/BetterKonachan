<template>
    <section id="footer">
        <p><span>Any Question,Contact me!</span><a href="mailto:franciscowxp@outlook.com" title="">franciscowxp@outlook.com</a></p>
    </section>
</template>
<script>

</script>
<style lang="sass" scoped >
    #footer {
        background-image: url('./assets/images/footerBg.jpg');
        margin-bottom: 10px;
        margin-left: 0px;
        display:flex;
        justify-content:center;
        align-items:center;
        padding: 20px;
        &:before {
            content:'';
            position: absolute;
            background-color:rgba(#c0c59e,0.5);
            width: 100%;
            height: 100%;
            z-index: 0;
            border-radius:5px;
            left: 0px;
            top: 0px;
        }
        &:after {
            content:"\e554"!important;
            color: white;
        }
        p {
            text-align: center;
            position: relative;
            display:block;
            width:100%;
            height:100%;
            flex: 0 0 auto;
            
        }
        a,span {
            color:white;
            display:block;
        }
        span {
            margin-right: 20px;
        }
    }
</style>
