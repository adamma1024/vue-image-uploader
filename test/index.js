import test from './test.vue'
import Vue from 'vue'

const a = new Vue({
  template: '<test></test>',
  components: { test }
}).$mount('#app')