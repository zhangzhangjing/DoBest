import Vue from 'vue'
import Router from 'vue-router'
import MyIndex from '@/components/MyIndex'
import MyPath from '@/components/MyPath'
import TodoList from '@/components/TodoList'
import CountNum from '@/components/CountNum'

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
    }
  ]
})
