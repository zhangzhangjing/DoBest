import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
//import { Button, Card, Form, Input, FormItem, Pagination, Dialog, } from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
// import Vuex from 'vuex'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import router from './route/router'
import store from './store'
//import routes from './routes_general'
import Mock from './mock'
import yiya from './api/yiya';
import 'font-awesome/css/font-awesome.min.css'
//import routes from './routes'
// import generalRoutes from './route/routes_general.js'
import freelanceRoutes from './route/routes_freelance.js'
import Role from 'common/js/role.js'
import RouteUtil from 'common/js/RouteUtil.js'
import Raven from 'raven-js';
Raven.config('https://0d8533fe415749ea98015f620eb271e9@sentry.io/175984').install();

Mock.bootstrap();


Vue.use(ElementUI)


//Vue.use(VueRouter)
// Vue.use(Vuex)

NProgress.configure({ showSpinner: false });

router.beforeEach((to, from, next) => {
    if (to.path == '/login') {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('ticket');
        sessionStorage.removeItem('identity');
    }
    let user = JSON.parse(sessionStorage.getItem('user'));
    if (!user)
    {
        if (to.path == '/login' || to.path == '/password_reset')
        {
            next()
        }
        else
        {
            next({ path: '/login' , query: { redirect: to.fullPath }})
        }
    }
    else {
        next()
    }
})

yiya.init(YConfig);
Vue.prototype.target = YConfig.target;

RouteUtil.routes = YConfig.routes || [];


var identity = parseInt(sessionStorage.getItem('identity'));
if(identity)
{
    if(identity == Role.Freelance)
    {
        RouteUtil.addRoutes(router, freelanceRoutes);
    }
    else
    {
        // RouteUtil.addRoutes(router, generalRoutes);
        RouteUtil.addRoutes(router, YConfig.routes);
    }
    RouteUtil.addRoutes(router, [{ path: '*', hidden: true, privileges:0, redirect: { path: '/404' } }]);
}

var vue = new Vue({
  router,
  store,
  //components: { App }
  render: h => h(App)
}).$mount('#app')
