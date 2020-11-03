/*
 * @version:
 * @Author: 黄炳圳
 * @Date: 2020-10-27 22:30:23
 * @Descripttion:
 */
import applyMixin from "./mixin";
import {
  forEach
} from "./utils";
import ModuleCollection from "./moudle/module-collection";

let Vue;

function installModule(store, state, path, module) {
  // 获取命名空间
  let namespace = store._modules.getNameSpace(path);

  if (path.length > 0) {
    let parent = path.slice(0, -1).reduce((memo, current) => {
      return memo[current];
    }, state);

    Vue.set(parent, path[path.length - 1], module.state);
  }

  module.forEachMutations((mutation, type) => {
    store._mutations[namespace + type] =
      store._mutations[namespace + type] || [];
    store._mutations[namespace + type].push(payload => {
      mutation.call(store, module.state, payload);
    });
  });

  module.forEachActions((action, type) => {
    store._actions[namespace + type] = store._actions[namespace + type] || [];
    store._actions[namespace + type].push(payload => {
      action.call(store, store, payload);
    });
  });

  module.forEachGetters((getter, type) => {
    store.wrapperGetters[type] = function () {
      return getter(module.state);
    };
  });

  module.forEachChild((child, key) => {
    installModule(store, state, path.concat(key), child);
  });
}

class Store {
  constructor(options) {
    // 1、收集模块，转换成一棵树
    this._modules = new ModuleCollection(options);

    //2、安装模块，将属性上的模块定义到store中
    let state = this._modules.root.state;
    this._mutations = {};
    this._actions = {};
    this.wrapperGetters = {};
    installModule(this, state, [], this._modules.root);

    //3、将状态放到实例中
    resetStoreVm(this, state);

    // 单独一个模块的时候实现原理
    // let state = options.state

    // this.getters = {}
    // const computed = {}
    // // 此时fn是用户自定义的function  demo：getters: { data: state => state.data }  fn = state => state.data, key = data
    // forEach(options.getters, (fn, key) => {
    //   // 将传入的getters放入计算属性
    //   computed[key] = () => { return fn(this.state) }

    //   // 取值的时候从实例上面取
    //   Object.defineProperty(this.getters, key, {
    //     get: () => { return this.vm[key] }
    //   });
    // });

    // this.vm = new Vue({
    //   data: { $$state: state },
    //   computed
    // });

    // // mutations 和 actions 采用的是发布订阅的模式，当用户调用commit或者dispatch时，就查找订阅的对应的方法，并执行
    // this._mutations = {};
    // forEach(options.mutations, (fn, key) => {
    //   this._mutations[key] = payload => fn.call(this, this.state, payload)
    // })

    // this._actions = {}
    // forEach(options.actions, (fn, key) => {
    //   this._actions[key] = payload => fn.call(this, this, payload)
    // })
  }
  // commit = (type, payload) => {
  //   this._mutations[type](payload);
  // };
  // dispatch = (type, payload) => {
  //   this._actions[type](payload);
  // };
  // get state() {
  //   return this.vm._data.$$state;
  // }
  commit = (type, payload) => {
    this._mutations[type].forEach(fn => fn(payload));
  };
  dispatch = (type, payload) => {
    this._actions[type].forEach(fn => fn(payload));
  };
  get state() {
    return this._vm._data.$$state;
  }
  registerModule(path, rawModule) {
    if (typeof path === "string") path = [path];
    // 注册模块
    this._modules.register(path, rawModule);

    // 安装模块
    installModule(this, this.state, path, rawModule.newModule);
    resetStoreVm(this, this.state);
  }
}

function resetStoreVm(store, state) {
  let oldVm = store._vm;
  let wrapperGetters = store.wrapperGetters;
  let computed = {};
  store.getters = {};
  forEach(wrapperGetters, (fn, key) => {
    computed[key] = function () {
      return fn();
    };

    Object.defineProperty(store.getters, key, {
      get: () => store._vm[key]
    });
  });

  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed
  });

  if (oldVm) {
    Vue.nextTick(() => oldVm.$destroyed);
  }
}

const install = _Vue => {
  Vue = _Vue;
  applyMixin(Vue);
};

export {
  Store,
  install
};