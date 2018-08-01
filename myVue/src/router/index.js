import Vue from 'vue'
import Router from 'vue-router'
import MyIndex from '@/components/MyIndex'
import TodoList from '@/components/TodoList'
import CountNum from '@/components/CountNum'
import WorkList from '@/components/WorkList'
import ProductDetail from '@/view/mac/index'
import PersonalCenter from '@/view/person/index'
import ReactStudy from '@/view/react/index'
import Product from '@/view/product/index'
import Login from '@/view/login/index'
import Register from '@/view/register/index'
import Cart from '@/view/cart/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MyIndex',
      component: MyIndex
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/todolist',
      name: 'TodoList',
      component: TodoList
    },
    {
      path: '/countnum',
      name: 'CountNum',
      component: CountNum
    },
    {
      path: '/worklist',
      name: 'WorkList',
      component: WorkList
    },
    {
      path: '/productdetail',
      name: 'ProductDetail',
      component: ProductDetail
    },
    {
      path: '/personalcenter',
      name: 'PersonalCenter',
      component: PersonalCenter
    },
    {
      path: '/reactstudy',
      name: 'ReactStudy',
      component: ReactStudy
    },
    {
      path: '/product',
      name: 'Product',
      component: Product
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/cart',
      name: 'Cart',
      component: Cart
    }
  ]
})
