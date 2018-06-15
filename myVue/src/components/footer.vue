<template>
    <div class="footer-main">
      <div class="footer-content">
        <span id="help" style="float:left;">
          <a href="" >帮助</a>
          <a href="" >举报</a>
          <a href="" >用户反馈</a>
        </span>
          {{content}}
      </div>
    </div>
</template>

<script>
export default {
  name: 'MainFooter',
  data () {
  	return {
  		content: '@written by zjingjing'
  	}
  }
}
</script>

<style scoped lang="stylus">
.footer-main
  width 100%
  height 42px
  position absolute
  background #f5f6f5
  bottom 0
  font-size 18px
  color #666
  border-top 1px solid #ebebeb;
.footer-content
  width 80%
  margin 0 auto
  text-align right
  height 42px
  line-height 42px
  color #777
  font-size 12px
#help a
  color #777
  text-decoration none
  margin-right 15px
</style>
