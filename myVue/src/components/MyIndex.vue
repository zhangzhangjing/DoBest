<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <ul>
      <li>
        <a href="#/MyPath">进入一个子页面</a>
      </li>
      <li>
        <a href="#/TodoList">todoList</a>
      </li>
      <li>
        <a href="#/CountNum">点击+1的效果</a>
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
