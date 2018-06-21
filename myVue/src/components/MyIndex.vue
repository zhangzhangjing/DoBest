<template>
  <div class="hello">
    <main-header message="首页"></main-header>
    <ul class="content">
      <li>
        <a href="#/MyPath">登录页面</a>
      </li>
      <li>
        <a href="#" @click= 'routerIn'>todoList</a>
      </li>
      <li>
        <a href="#/CountNum">点击累加效果</a>
      </li>
      <li>
        <a href="#/WorkList">工作计划列表</a>
      </li>
      <li>
        <a href="#/MacDetail">Mac</a>
      </li>
    </ul>
  </div>
</template>

<script>
import MainHeader from './header.vue'
export default {
  name: 'MyIndex',
  data () {
    return {
    }
  },
  components: {
    MainHeader
  },
  methods: {
    routerIn: function () {
      if (sessionStorage.getItem('userInfo')) {
        this.$router.push({path: '/TodoList'})
      } else {
        this.$router.push({path: '/MyPath'})
      }
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
