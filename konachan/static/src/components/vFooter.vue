<template>
    <section id="footer" class="active1">
        <div class="content">
            <p><span>Any Question,Contact me!</span><a href="mailto:franciscowxp@outlook.com" title="">franciscowxp@outlook.com</a></p>
        </div>
    </section>
</template>
<script>

</script>
<style lang="sass" scoped >
    $size:400px;
    $percentWidth:80%;
    $offsetLeft:(100% - $percentWidth) / 2;
    $outlineWidth:10px;
    $offsetTop:$outlineWidth * 3 / 2;
    #footer {
        margin: 200px;
        width:$size;
        height:$size;
        transform:rotate(45deg);
        overflow: hidden;
        box-sizing:border-box;
        // background:repeating-linear-gradient(130deg,teal 0%,teal 5% ,#252323 5%,#252323 10%);
        &:before,&:after{
            content:"";
            width:$percentWidth;
            height:50%;
            position: absolute;
            left: $offsetLeft;
            top: $offsetTop;
            box-sizing: border-box;
            background: rgba(#252323,1);
            outline:$outlineWidth solid #39CCCC;
            outline-offset:-$outlineWidth * 2;
            transition: all 0.2s ease-in-out;
        }
        &:after {
            top: calc(50% - #{$offsetTop});
        }
        &.active {
            &:before  {
                transform:translateX(-$size * ($offsetLeft / 100%));
            }
            &:after {
                transform:translateX($size * ($offsetLeft / 100%));
            }
            p {
                visibility:visible;
                opacity:1;
            }
            .content {
                width:calc(#{$percentWidth} - #{$outlineWidth} * 4 - #{$offsetLeft} * 2);
                left:calc(#{$offsetLeft} * 2 + #{$outlineWidth} * 2);
            }
        }
        p {
            font-family: 'ZnikomitNo24';
            text-align: center;
            position: relative;
            display:block;
            width:100%;
            transform:rotate(-45deg);
            display:table-cell;
            vertical-align: middle;
            z-index: 1;
            visibility: hidden;
            opacity: 0;
            transition:all 0.2s ease-in-out;
        }
        a,span {
            color:white;
            display:block;
            font-family: inherit;
            font-weight: bold;
            line-height: normal;
        }
        a {
            word-break: break-all;
        }
        $tempParam:$outlineWidth * 2 + $offsetTop;
        .content {
            position: absolute;
            display:table;
            table-layout: fixed;
            overflow:hidden;
            left:calc(#{$outlineWidth} * 2 + #{$offsetLeft});
            top:$tempParam;
            z-index: 2;
            transition:all 0.2s ease-in-out;
            background:#252323;
            width:calc(#{$percentWidth} - #{$outlineWidth} * 4);
            height:calc(100% - #{$tempParam} * 2);
        }
    }
</style>