import test from './test.vue'
import Vue from 'vue'
import '../static/webuploader.min'

const a = new Vue({
  template: '<test></test>',
  components: { test }
}).$mount('#app')