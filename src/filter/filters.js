
import Vue from 'vue'

Vue.filter('total', (num) => {
  return num && num > 10000 ? parseFloat(num / 10000).toFixed(1) + '万' : num
})
