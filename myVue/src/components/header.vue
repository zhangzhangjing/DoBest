<template>
    <div class="main-header">
      {{title}}
    </div>
</template>

<script>
export default {
  name: 'MainHeader',
  data () {
    return {
      title: 'TodoList'
    }
  }
}
</script>

<style scoped lang="stylus">
.main-header
  text-align center
  font-size 55px
  color #D03438
</style>
