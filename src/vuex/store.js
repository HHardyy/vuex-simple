import applyMixin from './mixin'
import { forEach } from './utils'

let Vue
class Store {
  constructor (options) {
    let state = options.state

    this.getters = {}
    const computed = {}
    // 此时fn是用户自定义的function  demo：getters: { data: state => state.data }  fn = state => state.data, key = data
    forEach(options.getters, (fn, key) => {
      // 将传入的getters放入计算属性
      computed[key] = () => { return fn(this.state) }

      // 取值的时候从实例上面取
      Object.defineProperty(this.getters, key, {
        get: () => { return this.vm[key] } 
      })
    })

    this.vm = new Vue({
      data: { $$state: state },
      computed
    })

    // mutations 和 actions 采用的是发布订阅的模式，当用户调用commit或者dispatch时，就查找订阅的对应的方法，并执行
    this._mutations = {}
    forEach(options.mutations, (fn, key) => {
      this._mutations[key] = payload => fn.call(this, this.state, payload)
    })

    this._actions = {}
    forEach(options.actions, (fn, key) => {
      this._actions[key] = payload => fn.call(this, this, payload)
    })
  }
  commit = (type, payload) => {
    this._mutations[type](payload)
  }
  dispatch = (type, payload) => {
    this._actions[type](payload)
  }
  get state () {
    return this.vm._data.$$state
  }
}

const install = (_Vue) => {
  Vue = _Vue
  applyMixin(Vue)
}

export { Store, install }