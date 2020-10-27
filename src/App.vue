<template>
  <div id="app">
    <h1>num1: {{$store.state.num1}}</h1>
    <h2>num2:{{$store.state.num2}}</h2>

    <button @click="handleAdd">mutation add</button>&nbsp;
    <button @click="handleTimeAdd">action add</button>
  </div>
</template>

<script>

export default {
  name: "App",
  methods: {
    handleAdd(){
      this.$store.commit('setNum', { num1:this.$store.state.num1+10, num2: this.$store.state.num2+20})
    },
    handleTimeAdd(){
      this.$store.dispatch('setTimeNum', { num1:this.$store.state.num1+10, num2: this.$store.state.num2+20})
    }
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
