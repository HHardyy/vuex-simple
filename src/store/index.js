/*
 * @version:
 * @Author: 黄炳圳
 * @Date: 2020-10-26 23:47:37
 * @Descripttion:
 */
import Vue from "vue";
// import Vuex from "vuex";
// import Vuex from "../vuex/index";
import Vuex from "../vuex/index";
// import logger from "vuex/dist/logger";

Vue.use(Vuex);

// 持久化插件
function persists(store) {
  let local = localStorage.getItem("vuex:state");
  if (local) {
    store.replaceState(JSON.parse(local));
  }

  store.subscribe((mutation, state) => {
    localStorage.setItem("vuex:state", JSON.stringify(state));
  });
}

const store = new Vuex.Store({
  plugins: [persists],
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
  modules: {
    a: {
      state: {
        a: 100
      },
      mutations: {
        setNum: (state, payload) => {
          state.a = payload.a;
        }
      },
      modules: {
        aChild: {
          namespace: true,
          state: {
            ac_a: 1
          },
          mutations: {
            setNum: (state, payload) => {
              state.ac_a = payload.ac_a;
            }
          }
        }
      }
    },
    b: {
      state: {
        b: 1
      }
    },
    e: {
      namespace: true,
      state: {}
    }
  }
});

// 注册模块

store.registerModule(["e"], {
  state: {
    modue: "hello"
  }
});

export default store;