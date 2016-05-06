<template>
    <section id="list">
        <!-- <div class="listCon">
            <waterfall :line-gap="200" :min-line-gap="100" :max-line-gap="300" :single-max-width="300" :watch="listData" :auto-resize="true">
              <waterfall-slot v-for="item in listData" :width="item.preview_width" :height="item.preview_height" :order="$index"  >
                    <div>
                        <img :src="item.prev_url" >
                    </div>
              </waterfall-slot>
            </waterfall>
        </div> -->
              <waterfall
        :align="align"
        :line-gap="200"
        :min-line-gap="100"
        :max-line-gap="220"
        :single-max-width="300"
        :watch="listData"
      >
        <!-- each component is wrapped by a waterfall slot -->
        <waterfall-slot
          v-for="item in listData"
          :width="item.preview_width"
          :height="item.preview_height"
          :order="$index"
          move-class="item-move"
          transition="wf"
        >
          <div class="item"  :index="item.index" :width="item.preview_width" :height="item.preview_height">
              <!-- <img :src="item.prev_url"> -->
          </div>
        </waterfall-slot>

    </section>
</template>
<script>

var ItemFactory = (function () {

  var lastIndex = 0

  function generateRandomItems (count) {
    var items = [], i
    for (i = 0; i < count; i++) {
      items[i] = {
        index: lastIndex++,
        style: {
          background: getRandomColor()
        },
        width: 100 + ~~(Math.random() * 50),
        height: 100 + ~~(Math.random() * 50)
      }
    }
    return items
  }

  function getRandomColor () {
    var colors = [
      'rgba(21,174,103,.5)',
      'rgba(245,163,59,.5)',
      'rgba(255,230,135,.5)',
      'rgba(194,217,78,.5)',
      'rgba(195,123,177,.5)',
      'rgba(125,205,244,.5)'
    ]
    return colors[~~(Math.random() * colors.length)]
  }

  return {
    get: generateRandomItems
  }

})()

    import { setSession, getSession, getLocal, setLocal, getPost, getSampleImg } from '../servers/servers.js';
    import Waterfall from 'vue-waterfall/lib/waterfall.vue';
    import WaterfallSlot from 'vue-waterfall/lib/waterfall-slot.vue';

    export default {
        data() {
            return {
                listData: [],
                items: ItemFactory.get(100),
                test:"hahah",
                pages: 0,
                currentPage: 1,
                showLoading: true,
                isDialog: false,
                loadSampleSuccess: false,
                align: 'center'

            };
        },
        components: {
            Waterfall,
            WaterfallSlot
        },
        directives: {
            originStyle(value) {
                this.el.style.width = value.preview_width + 'px';
                this.el.style.height = value.preview_height + 'px';
            }
        },
        watch: {
            pages(val) {
                setSession.pages = val;
            }
        },
        ready() {
            const getData = (currentPage, isSafe, tags) => {
                getPost((response) => {
                    this.listData = response.data.images;
                    this.pages = response.data.pages;
                    this.showLoading = false;
                    /* storage the page info */
                    setSession('currentPage', currentPage);
                    if (getLocal('rememberPage')) {
                        setLocal('currentPage', currentPage);
                    }
                    this.$dispatch('listReady', { pages: this.pages, currentPage });
                }, currentPage, isSafe, tags);
            };
            setSession('tags', '');
            let initPage = 1;
            let isSafe = true;
            if (getLocal('rememberPage')) {
                initPage = getLocal('currentPage') ? getLocal('currentPage') : 1;
            } else {
                initPage = getSession('currentPage') ? getSession('currentPage') : 1;
            }
            if (getLocal('securityMode') !== undefined) {
                isSafe = getLocal('securityMode');
            } else {
                setLocal('securityMode', true);
            }
            getData(Number(initPage), isSafe, '');
            this.$on('invoke', (data) => {
                const tags = getSession('tags');
                const isSafe = getLocal('securityMode');
                this.showLoading = true;
                getData(data.currentPage, isSafe, tags);
            });
        }
    };
</script>
<style lang="sass" scoped>
    @import "../assets/sass/components/_icon";
    $transitionTime: 0.4s;
    $transitionDelay:0.1s;
    $itemSize:300px;
    $itemMargin:2px;
    $itemColumn:4;
    $gap : 10px;
    #list {
        margin: auto;
        // background: repeating-linear-gradient(-55deg,#222,#222 10px,#333 10px,#333 20px);
        position: relative;
        // width:($itemColumn - 1) * $gap + $itemColumn * $itemSize;
    }
    .listCon {
        position:relative;
        font-size: 0px;
        font-family:'Aldo-SemiBold';
        width:100%;
        transform-style:preserve-3d;
        perspective:1000px;
        div {
            border-radius: 5px;
            cursor:pointer;
            transition:all 0.4s ease-in-out;
            margin:10px;
            background:pink;
            position: absolute;
        }
    }
    .item {
  position: absolute;
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 5px;
  font-size: 1.2em;
  color: rgb(0,158,107);
  background:pink;
}
.item:after {
  content: attr(index);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
}
.wf-transition {
  transition: opacity .3s ease;
  -webkit-transition: opacity .3s ease;
}
.wf-enter {
  opacity: 0;
}
</style>