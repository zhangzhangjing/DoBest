import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import MyPath from '@/components/MyPath'
import TodoList from '@/components/TodoList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
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
    }
  ]
})
