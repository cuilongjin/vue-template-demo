import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    num: 1
  },
  mutations: {
    numAdd (state, payload = { count: 1 }) {
      state.num += payload.count
    }
  },
  actions: {
    numAddSync ({ commit }, payload) {
      setTimeout(() => {
        commit('numAdd', payload)
      }, 1000)
    },
    numAddSync1 ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          commit('numAdd', payload)
          resolve()
        }, 1000)
      })
    }
  }
})
