// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import HighchartsVue from 'highcharts-vue'
import highcharts from 'highcharts'
import ElementUI from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css';

Vue.use(HighchartsVue)
Vue.use(ElementUI)

Vue.prototype.Hightcharts = highcharts
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
