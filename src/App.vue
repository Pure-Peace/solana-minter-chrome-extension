<template>
  <div id="app">
    <div id="head">
      <img src="../public/icons/38.png" />
      <div class="title">
        <div>Solana Minter Extension</div>
      </div>
    </div>
    <div id="content">
      <router-view />
    </div>
    <div id="nav">
      <router-link to="/">Detect</router-link>
      <router-link to="/task">Task</router-link>
      <router-link to="/settings">Settings</router-link>
    </div>
  </div>
</template>

<script>
export default {
  async created () {
    await this.$bus.initialPrograms()
  }
}
</script>

<style lang="scss">
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: #ddd;
  border-radius: 10px;
}

#head {
  height: 66px;
  user-select: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px;
  background-color: #d5f5e3;
  .title {
    font-size: 18px;
    font-weight: lighter;
    display: flex;
    flex: 1;
    justify-content: center;
  }

  img {
    -webkit-user-drag: none;
  }
}

#content {
  height: calc(550px - 66px - 64px);
  overflow: auto;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 550px;
  width: 450px;
}

#nav {
  user-select: none;
  -webkit-user-drag: none;
  display: flex;
  align-items: center;
  height: 64px;
  background-color: #eaf2f8;

  a {
    display: block;
    -webkit-user-drag: none;
    line-height: 64px;
    width: calc(100% / 3);
    height: 100%;
    padding: 0 10px;
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #ffffff;
      background-color: #b0d9f5;
      text-shadow: 0 2px 2px #404040;
    }
  }
}
</style>
