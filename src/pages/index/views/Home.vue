<template>
  <div class="home">
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <h1>This is an index Home page</h1>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld'
export default {
  name: 'home',
  components: {
    HelloWorld
  },
  data () {
    return {}
  }
}
</script>
