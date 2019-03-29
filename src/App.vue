<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  * {
    font-size: 12px;
  }
  .el-dialog__title {
    font-size: 16px;
  }

  hr {
    color: #fafafa;
  }

  html {
    line-height: 0.5;
  }
</style>