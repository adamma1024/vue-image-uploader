import Vue from 'vue'
import test from './test.vue'
import '../static/Uploader.swf'

const a = new Vue({
  template: '<test></test>',
  components: { test }
}).$mount('#app')