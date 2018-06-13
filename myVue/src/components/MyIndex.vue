<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <ul>
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
    </ul>
  </div>
</template>

<script>
export default {
  name: 'MyIndex',
  data () {
    return {
      msg: 'vue.js学习'
    }
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

<style scoped>
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
</style>
