import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";
import "../src/assets/css/global.css";
import axios from 'axios';

Vue.prototype.$http = axios;

// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';

// 设置axios拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
