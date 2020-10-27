import Vue from "vue";
// import Vuex from "vuex";
import Vuex from "../vuex/index";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    num1: 10,
    num2: 20
  },
  mutations: {
    setNum: (state, payload) => {
      state.num1 = payload.num1;
      state.num2 = payload.num2;
    }
  },
  actions: {
    setTimeNum: ({
      commit
    }, payload) => {
      commit("setNum", payload);
    }
  },
  modules: {}
});