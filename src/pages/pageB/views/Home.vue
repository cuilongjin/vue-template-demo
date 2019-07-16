<template>
  <div class="home">
    <HelloWorld msg="This is an pageB Home page" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  components: {
    HelloWorld
  },
  data () {
    return {
      a: ''
    }
  }

}
</script>
