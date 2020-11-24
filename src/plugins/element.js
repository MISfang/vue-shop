import Vue from 'vue'
import {
  Button
} from 'element-ui'
import {
  Form,
  FormItem
} from 'element-ui'
import {
  Input
} from 'element-ui'
import {
  Message
} from 'element-ui'

// 全局注册成为可用的组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

// 提示消息需要全局挂载
Vue.prototype.$message = Message
