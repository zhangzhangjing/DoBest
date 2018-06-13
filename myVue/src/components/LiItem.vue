<template>
    <li @click="deleteItem" class="li_item"> {{content}}</li>
</template>

<script>
export default {
  name: 'LiItem',
  props: ['content', 'index'],
  data () {
    return {
      item: 'item'
    }
  },
  methods: {
    deleteItem () {
      this.$emit('delete', this.index)
    }
  }
}
</script>

<style scoped>
.li_item {
  display: block;
  text-align: left;
  padding-left: 45%;
}
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
