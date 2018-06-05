<template>
  <div class="hello">
    <p>这个页面有很多动画效果展示模块、组件的应用、v-for的应用、computed函数等知识点。</p>
    <input type="text" v-model="content" >
    <button @click = addList>添加</button>
    <ul>
      <li
        v-for='(item,index) in todoList'
        :key="index"
        @click = deleteitem
      >{{item}}</li>
    </ul>
    <button v-on:click="show = !show">
      Toggle
    </button>
    <transition name="bounce">
      <p v-if="show">hello</p>
    </transition>
    <transition  name="fade" mode="out-in">
      <button v-bind:key="docState">
        {{ buttonMessage }}
      </button>
    </transition>
    <input type="radio" id="one" value="v-a" v-model="view">
    <label for="one">A</label>
    <input type="radio" id="two" value="v-b" v-model="view">
    <label for="two">B</label>
    <transition name="fade" mode="out-in">
      <component v-bind:is="view"></component>
    </transition>

    <button v-on:click="add">Add</button>
    <button v-on:click="remove">Remove</button>
    <transition-group name="list" tag="p">
    <span v-for="item in items" v-bind:key="item" class="list-item">
      {{ item }}
    </span>
    </transition-group>
    <input v-model="query" placeholder="请输入要搜索的选项"><br/>
    <transition-group>
      <li
        v-for="(item, index) in computedList"
        v-bind:key="item.msg"
        v-bind:data-index="index"
      >{{ item.msg }}</li>
    </transition-group>
  </div>
</template>

<script>

export default {
  name: 'TodoList',
  data () {
    return {
      content: '',
      todoList: [],
      show: true,
      docState: 'Cancel',
      view: 'v-a',
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      nextNum: 10,
      query: '',
      list: [
        { msg: 'Bruce Lee' },
        { msg: 'Jackie Chan' },
        { msg: 'Chuck Norris' },
        { msg: 'Jet Li' },
        { msg: 'Kung Fury' }
      ]
    }
  },
  components: {
    'v-a': {
      template: '<div>Component A</div>'
    },
    'v-b': {
      template: '<div>Component B</div>'
    }
  },
  methods: {
    addList: function () {
      if (this.content) {
        this.todoList.push(this.content)
        this.content = ''
      }
    },
    deleteitem: function () {
      this.todoList.splice(this.item, 1)
    },
    randomIndex: function () {
      return Math.floor(Math.random() * this.items.length)
    },
    add: function () {
      this.items.splice(this.randomIndex(), 0, this.nextNum++)
    },
    remove: function () {
      this.items.splice(this.randomIndex(), 1)
    }
  },
  computed: {
    buttonMessage: function () {
      switch (this.docState) {
        case 'Cancel': return 'Edit'
        case 'Edit': return 'Save'
        case 'Save': return 'Cancel'
      }
    },
    computedList: function () {
      var vm = this
      return this.list.filter(function (item) {
        return item.msg.toLowerCase().indexOf(vm.query.toLowerCase()) !== -1
      })
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
.fade-enter-active, .fade-leave-active{
  transition: opacity 1s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
.bounce-enter-active {
  animation: bounce-in .5s;
}
.bounce-leave-active {
  animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to
  /* .list-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
</style>
