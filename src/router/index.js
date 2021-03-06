import Vue from "vue";
import Router from "vue-router";
import Login from "../components/login.vue";
import Home from "../components/home.vue";
import Welcome from "../components/welcome.vue";
import User from "../components/user/users.vue";
import Rights from "../components/power/rights.vue";
import Roles from "../components/power/roles.vue";
import Cate from "../components/goods/cate.vue";
import Goods from "../components/goods/goods.vue";
import Params from "../components/goods/params.vue";
import GoodsAdd from "../components/goods/add.vue";
import Order from "../components/order/order.vue";
import Report from "../components/report/report.vue";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      redirect: "/login"
    },
    {
      path: "/login",
      component: Login
    },
    {
      path: "/home",
      redirect: "/welcome",
      component: Home,
      children: [
        {
          path: "/welcome",
          component: Welcome
        },
        {
          path: "/users",
          component: User
        },
        {
          path: "/rights",
          component: Rights
        },
        {
          path: "/roles",
          component: Roles
        },
        {
          path: "/categories",
          component: Cate
        },
        {
          path: "/goods",
          component: Goods
        },
        {
          path: "/params",
          component: Params
        },
        {
          path: "/goods/add",
          component: GoodsAdd
        },
        {
          path: "/orders",
          component: Order
        },
        {
          path: "/reports",
          component: Report
        }
      ]
    }
  ]
});

// 加一个路由导航守卫，把控用户访问权限
router.beforeEach((to, from, next) => {
  // to代表将要访问的路径
  // from代表从哪个路径跳转而来
  // next可以直接放行这个页面，也可以设置参数跳转其他页面

  // 如果是登录页面就直接放行
  if (to.path === "/login") return next();

  // 不是登录页面,执行下面代码
  const tokenStr = window.sessionStorage.getItem("token");
  // 如果没有token值，则强制跳转到登录页面，让用户登录
  if (!tokenStr) return next("/login");
  next();
});

export default router;
