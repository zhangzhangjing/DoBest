<template>
    <div class="list">
      <main-header message="TodoList" returnbtn="true"></main-header>
      <worklist-content></worklist-content>
    </div>
</template>

<script>
import MainHeader from './header.vue'
import MainFooter from './footer.vue'
import WorklistContent from './WorklistContent.vue'
export default {
  name: 'WorkList',
  data () {
    return {
      msg: '工作计划列表'
    }
  },
  components: {
    MainHeader,
    MainFooter,
    WorklistContent
  }
}
</script>

<style scoped>

</style>
