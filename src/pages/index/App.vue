<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>|
      <router-link to="/about">About</router-link>
    </div>

    <a href="pageA.html">ToPageA</a> |
    <a href="pageB.html">ToPageB</a>
    <br />
    <br />
    <router-view />
    <button @click="numAdd({ count: 50 })">numAdd</button>
    <button @click="$store.dispatch('numAddSync', { count: 100 })">
      numAdd
    </button>
    <button @click="$store.dispatch({ type: 'numAddSync', count: 1000 })">
      numAddSync
    </button>
    <button @click="numAddSync({ count: 10000 })">
      numAddSync
    </button>
    <button @click="numAddSync1({ count: 10000 })">
      numAddSync1
    </button>
    {{ num }}
    {{ baseUrl }}
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  name: 'index',
  data () {
    return {
      baseUrl: serverConfig.baseUrl
    }
  },
  computed: {
    ...mapState(['num'])
  },
  methods: {
    ...mapMutations(['numAdd']),
    numAdd1 () {
      this.$store.commit('numAdd')
    },
    ...mapActions(['numAddSync']),

    numAddSync (payload) {
      this.$store.dispatch('numAddSync', payload)
    },

    numAddSync1 (payload) {
      this.$store.dispatch('numAddSync1', payload).then(() => {
        console.log(1)
      })
    }

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
