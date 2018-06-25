<template>
<div class="flex">
  <li v-for="(item) in items" @click="tabClick(item)" :key="item">
    <a href="#" :key="item" :class="{ active: currentIndex === item }">{{item}}</a>
  </li>
</div>
</template>

<script>
export default {
  name: "tab",
  props: ['items'],
  data(){
    return{
      currentIndex: 0
    }
  },
  created () {
    this.currentIndex = this.index
  },
  methods: {
    tabClick (index) {
      this.currentIndex = index
      this.$emit('on-click', index)
    }
  }
}
</script>

<style scoped lang="stylus">
.flex
  display inline-block
  text-align left
  vertical-align top
  width 200px
.flex li
  display block
.flex .active
  color white
  background black
</style>
