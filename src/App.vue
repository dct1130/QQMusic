<template>
  <div id="app">
    <v-welcome :count="count" v-show="showWelcome"></v-welcome>
    <v-loading v-show="showLoading"></v-loading>
    <v-toast v-show="showToast"></v-toast>
    <div class="containers" v-show="!showWelcome">
      <transition name="fade-in">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
import Welcome from '@/components/welcome'
import Loading from '@/components/loading'
import Toast from '@/components/toast'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      count: 5
    }
  },
  created () {
    let welcomeStatus = Boolean(!sessionStorage.getItem('SHOW_WELCOME'))
    this.$store.dispatch('setShowWelcome', welcomeStatus)
    if (this.showWelcome) {
      let oTime = setInterval(() => {
        this.count--
        if (this.count === 0) {
          clearInterval(oTime)
          this.$store.dispatch('setShowWelcome', false)
          sessionStorage.setItem('SHOW_WELCOME', this.showWelcome)
        }
      }, 1000)
    }
  },
  components: {
    'v-welcome': Welcome,
    'v-loading': Loading,
    'v-toast': Toast
  },
  computed: {
    ...mapGetters(['showWelcome', 'showLoading', 'showPlayer', 'showToast'])
  }
  // watch: {
  //   '$route' (to, from) {
  //     const toDepth = to.path.split('/').length
  //     const fromDepth = from.path.split('/').length
  //     this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
  //   }
  // }
}
</script>

<style lang="less">
#app{
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  margin: auto;
  div.containers{
    height: 100%
  }
}
.fade-in-enter-active {
  animation: fadeIn .2s;
}
// .slide-up-enter-active {
//   animation: slideUp .3s;
// }
// .fold-enter-active,
// .fold-leave-active {
//   transition: transform .2s linear;
// }
// .fold-enter,
// .fold-leave-active {
//   transform: translate3d(0, 100%, 0);
// }
@keyframes fadeIn {
  from {opacity: 0}
  to {opacity: 1}
}
</style>
