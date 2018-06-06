<template>
    <li @click="deleteItem"> {{content}}</li>
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

</style>
