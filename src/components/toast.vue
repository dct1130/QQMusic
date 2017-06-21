<template lang="html">
  <div class="toast" :class="{'show':showToast}" v-text="ToastMsg"></div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
export default {
  data () {
    return {
      time: null
    }
  },
  mounted () {
  },
  computed: {
    ...mapGetters(['showToast', 'ToastMsg', 'toastHash'])
  },
  watch: {
    'toastHash' (newVal, oldVal) {
      clearTimeout(this.time)
      this.time = setTimeout(() => {
        this.$store.dispatch('setShowToast', false)
      }, 2000)
    }
  }
}
</script>

<style lang="less">
div.toast{
  position: fixed;
  z-index: 40;
  background: rgba(0,0,0,.8);
  padding: 10px 20px;
  color: #fff;
  border-radius: 999px;
  font-size: 14px;
  max-width: 160px;
  text-align: left;
  line-height: 16px;
  left: 50%;
  bottom: 30%;
  &.show{
    animation: showtoast .2s ease both
  }
}
@keyframes showtoast {
  from{transform: translate3d(-50%,0%,0); opacity: 0}
    to{transform: translate3d(-50%,-30%,0); opacity: 1}
}
</style>
