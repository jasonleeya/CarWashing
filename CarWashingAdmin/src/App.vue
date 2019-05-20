<template>
  <div id="app">
    <router-view/>
    <template><span v-loading.fullscreen.lock="Loading"></span></template>
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    Loading() {
      return this.$store.state.login.Loading
    },
  },
}
</script>

<style>
  body,html {
    width: 100%;
    height: 100%;
  }
  #app {
    height: 100%;
  }
</style>
