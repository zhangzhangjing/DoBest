<template>
    <div class="list">
      <main-header></main-header>
      <worklist-content></worklist-content>
      <main-footer></main-footer>
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
