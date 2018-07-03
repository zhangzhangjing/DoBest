<template>
<div  class="list">
  <main-header message="React学习" returnbtn="true"></main-header>
  <div class="main-content">

  </div>
</div>
</template>

<script>
  import MainHeader from '@/components/header.vue'
  import React from 'react'
    export default {
      name: "index",
      components: {
        MainHeader,
      },
    }
</script>

<style scoped>

</style>
