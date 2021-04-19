<template>
  <div id="app">
    <main-view />
  </div>
</template>

<script>
import MainView from './frame/MainView'

export default {
  name: 'App',
  components: {
    MainView
  }
}
</script>

<style>
#app {
  padding: 30px;
}
</style>
