import Vue from 'vue'
import test from './test.vue'

const a = new Vue({
  template: '<test></test>',
  components: { test }
}).$mount('#app')
