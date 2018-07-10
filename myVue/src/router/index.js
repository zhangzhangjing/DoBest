import Vue from 'vue'
import Router from 'vue-router'
import MyIndex from '@/components/MyIndex'
import MyPath from '@/components/MyPath'
import TodoList from '@/components/TodoList'
import CountNum from '@/components/CountNum'
import WorkList from '@/components/WorkList'
import MacDetail from '@/view/mac/index'
import PersonalCenter from '@/view/person/index'
import ReactStudy from '@/view/react/index'
import Product from '@/view/product/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MyIndex',
      component: MyIndex
    },
    {
      path: '/mypath',
      name: 'MyPath',
      component: MyPath
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
      path: '/macdetail',
      name: 'MacDetail',
      component: MacDetail
    },
    {
      path: '/PersonalCenter',
      name: 'PersonalCenter',
      component: PersonalCenter
    },
    {
      path: '/ReactStudy',
      name: 'ReactStudy',
      component: ReactStudy
    },
    {
      path: '/Product',
      name: 'Product',
      component: Product
    }
  ]
})
