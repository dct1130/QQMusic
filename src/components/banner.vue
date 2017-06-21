<template lang="html">
  <div class="banner">
    <div class="swiper-container" id="banner">
      <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="img in image" @click="toPage(img.linkUrl)"><img :src="img.picUrl" alt=""></div>
      </div>
      <div class="swiper-pagination"></div>
    </div>
  </div>
</template>

<script>
import Swiper from '../../static/js/swiper.min'
export default {
  name: 'banner',
  props: ['image'],
  data () {
    return {
      mySwiper: null
    }
  },
  mounted () {
    setTimeout(this.initSwiper, 500)
  },
  methods: {
    initSwiper () {
      this.mySwiper = new Swiper('#banner', {
        direction: 'horizontal',
        loop: true,
        pagination: '.swiper-pagination',
        autoplay: 4000
      })
    },
    // 跳转页面
    toPage (url) {
      window.location.href = url
    }
  }
}
</script>

<style lang="less">
@import url("../assets/css/swiper.min.css");
div.banner {
    width: 100%;
    div.swiper-wrapper {
        div.swiper-slide {
            width: 100%;
            img {
                display: block;
                width: 100%;
            }
        }
    }
    span.swiper-pagination-bullet{
      background: rgba(144,144,144,.8);
      opacity: 1;
      width: 6px;
      height: 6px;
    }
    span.swiper-pagination-bullet-active{
      background: #fff
    }
}
</style>
