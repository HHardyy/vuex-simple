const applyMixin = (Vue) => {
  Vue.mixin({
    beforeCreate: vuexInit
  })
}

function vuexInit() {
  const options = this.$options

  if (options.store) {
    // vue-router: 把属性定义到根实例，所有组件都能拿到这个根实例，通过根实例获取属性
    // vuex: 给每个组件都定义一个$store属性，指向同一个人

    this.$store = options.store
  } else if (options.parent && options.parent.$store) {
    this.$store = options.parent.$store
  }
}

export default applyMixin