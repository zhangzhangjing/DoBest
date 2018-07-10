<template>
  <div class="hello">
    <main-header message="首页"></main-header>
    <ul class="content">
      <tab :items="tabItems"  :content = 'tabItems' @on-click="clickItem"></tab>
      <li>
        <a href="#/MyPath">登录页面</a>
      </li>
      <li>
        <a href="#" @click= 'routerIn'>todoList</a>
      </li>
      <li>
        <a href="#/CountNum">点击添加记录</a>
      </li>
      <li>
        <a href="#/WorkList">工作计划列表</a>
      </li>
      <li>
        <a href="#/MacDetail">Mac</a>
      </li>
      <li>
        <a href="#/PersonalCenter">个人中心</a>
      </li>
      <li>
        <a href="#/ReactStudy">视频看点</a>
      </li>
      <li>
        <a href="#/Product">产品管理</a>
      </li>
    </ul>
  </div>
</template>

<script>
import MainHeader from './header.vue'
import Tab from '@/components/tab.vue'
export default {
  name: 'MyIndex',
  data () {
    return {
      tabItems: ['选项一', '选项二','选项三', '选项四','选项五', '选项六'],
    }
  },
  components: {
    MainHeader,
    Tab,
  },
  methods: {
    routerIn: function () {
      if (sessionStorage.getItem('userInfo')) {
        this.$router.push({path: '/TodoList'})
      } else {
        this.$router.push({path: '/MyPath'})
      }
    },
    clickItem:function (item) {
      console.log(item)
    }
  }
}
</script>

<style scoped lang="stylus">
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.content
  height 500px
  width 80%
  background #ffffff
  padding 20px
  margin 0 auto
</style>
