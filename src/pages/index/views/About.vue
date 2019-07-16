<template>
  <div class="about">
    <h1>This is an about page</h1>
    <input type="text" v-model.lazy="msg" />
    <p>msg: {{ msg }}</p>
    <svg class="icon"><use xlink:href="#icon-form_ic_at" /></svg>
  </div>
</template>
<script>
import loadjsAsync from '../../../assets/js/loadjs'
export default {
  data () {
    return {
      msg: ''
    }
  },
  beforeCreate () {
    loadjsAsync('static/somejs.js').then(() => {
      // somejs.js loaded
      // do something
    }).catch((err) => {
      // err
      console.log(err)
    })
  },
  methods: {

  }
}
</script>
<style lang="less">
.icon {
  color: #ccc;
  /deep/svg {
    fill: currentColor;
  }
}
</style>
