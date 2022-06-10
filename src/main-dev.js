import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";
import "../src/assets/css/global.css";
import axios from "axios";
import TreeTable from "vue-table-with-tree-grid";

// 引入并注册富文本编辑器
import VueQuillEditor from "vue-quill-editor";

import "quill/dist/quill.core.css"; // import styles
import "quill/dist/quill.snow.css"; // for snow theme
import "quill/dist/quill.bubble.css"; // for bubble theme

// 导入进度条的包
import Nprogress from "nprogress";
import "nprogress/nprogress.css";

Vue.use(VueQuillEditor /* { default global options } */);

Vue.prototype.$http = axios;

// 配置请求的根路径
axios.defaults.baseURL = "http://www.ysqorz.top:8888/api/private/v1/";
// axios.defaults.baseURL = "http://127.0.0.1:8888/";

// 设置axios拦截器
// 在request拦截器中展示进度条
axios.interceptors.request.use(config => {
  // 立刻展示对应的进度条
  Nprogress.start();

  config.headers.Authorization = window.sessionStorage.getItem("token");
  return config;
});

axios.interceptors.response.use(config => {
  // 立刻隐藏进度条
  Nprogress.done();
  return config;
});

Vue.component("tree-table", TreeTable);

// 做一个时间过滤器
Vue.filter("dateFormat", function(originval) {
  const dt = new Date(originval);

  const y = dt.getFullYear();
  const m = (dt.getMonth() + 1 + "").padStart(2, "0");
  const d = (dt.getDate() + "").padStart(2, "0");

  const hh = (dt.getHours() + "").padStart(2, "0");
  const mm = (dt.getMinutes() + "").padStart(2, "0");
  const ss = (dt.getSeconds() + "").padStart(2, "0");

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
});

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
