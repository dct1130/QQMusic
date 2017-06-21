<template lang="html">
  <div id="index">
    <v-header></v-header>
    <article id="content_wrapper">
      <transition :name="transitionName" appear>
        <router-view></router-view>
      </transition>
    </article>
  </div>
</template>

<script>
import header from '@/components/header'
export default {
  name: 'index',
  components: {
    'v-header': header
  },
  data () {
    return {
      transitionName: 'slide-right'
    }
  },
  watch: {
    '$route' (to, from) {
      const path = to.path + '' + from.path
      switch (path) {
        case '/recom/rank':
          this.transitionName = 'slide-right'
          break
        case '/recom/search':
          this.transitionName = 'slide-right'
          break
        case '/rank/search':
          this.transitionName = 'slide-right'
          break
        case '/rank/recom':
          this.transitionName = 'slide-left'
          break
        case '/search/recom':
          this.transitionName = 'slide-left'
          break
        case '/search/rank':
          this.transitionName = 'slide-left'
          break
        default:
          this.transitionName = 'slide-left'
      }
    }
  },
  mounted () {
    document.getElementById('content_wrapper').style.height = document.body.clientHeight - document.getElementById('header').offsetHeight + 'px'
  }
}
</script>

<style lang="less">
#index{
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  margin: auto;
}
#content_wrapper{
  overflow-y: scroll;
  overflow-x: hidden
}
.slide-left-enter-active {
  // animation: slideLeft .3s cubic-bezier(.23,.43,.25,.94);
  animation: slideLeft .3s ease;
}
.slide-right-enter-active {
  // animation: slideRight .3s cubic-bezier(.23,.43,.25,.94);
  animation: slideRight .3s ease;
}
@keyframes slideLeft {
  0% {
    transform: translate3d(100%, 0, 0);
    opacity: 0
  }
  50% {
    transform: translate3d(50%, 0, 0);
    opacity: 0.5
  }
  100% {
    transform: translate3d(0, 0, 0);
    opacity: 1
  }
}
@keyframes slideRight {
  0% {
    transform: translate3d(-100%, 0, 0);
    opacity: 0
  }
  50% {
    transform: translate3d(-50%, 0, 0);
    opacity: 0.5
  }
  100% {
    transform: translate3d(0, 0, 0);
    opacity: 1
  }
}
</style>
