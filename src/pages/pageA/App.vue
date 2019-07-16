<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">pageA</router-link>
    </div>
    <a href="/">ToIndex</a> |
    <a href="pageB.html">ToPageB</a>
    <br />
    <br />
    <router-view />
    {{ num }}
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {

  name: 'pageA',
  data () {
    return {

    }
  },
  computed: {
    ...mapState(['num'])
  }
}
</script>

<style lang="less">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
