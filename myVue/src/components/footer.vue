<template>
    <div class="footer-main">
    {{content}}
    </div>
</template>

<script>
export default {
  name: 'MainFooter',
  data () {
  	return {
  		content: 'written by zjingjing'
  	}
  }
}
</script>

<style scoped lang="stylus">
.footer-main
  text-align right
  padding-right 10%
  margin-top 20px
  font-size 18px
  color #666
</style>
