<template>
  <div class="hello">
    <input type="text" v-model="content" >
    <button @click = addList>添加</button>
    <ul>
      <li
        v-for='(item,index) in todoList'
        :key="index"
        @click = deleteitem
      >{{item}}</li>
    </ul>
  </div>
</template>

<script>

export default {
  name: 'TodoList',
  data () {
    return {
      content: '',
      todoList: []
    }
  },
  methods: {
    addList: function () {
      this.todoList.push(this.content)
      this.content = ''
    },
    deleteitem: function () {
      this.todoList.splice(this.item, 1)
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
