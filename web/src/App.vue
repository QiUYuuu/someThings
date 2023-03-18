<template>
  <div id="containter">
    <div id="header">
      <div class="header-content">
        <div>LOGO图标</div>
        <div class="tabs">
          <el-input
            class="search"
            v-model="inputValue"
            placeholder="Please input"
          />
          <div class="links">
            <el-link target="_blank">
              <router-link style="font-size: 17px" to="/"
                >vue2/vue3
              </router-link>
            </el-link>
            <el-link target="_blank">
              <router-link style="font-size: 17px" to="/">css</router-link>
            </el-link>
          </div>
        </div>
      </div>
    </div>
    <div id="main">
      <div class="slide">slide</div>
      <div class="content">
        <div class="route">
          <router-view></router-view>
        </div>
      </div>
    </div>
    <div id="footer">footer</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const inputValue = ref('');
</script>

<style scoped lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#containter {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  height: 100%;
}

#header {
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  width: 100%;
  height: 5%;
  border-bottom: 1px solid #e5e5e5;

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    width: 80%;
  }

  .tabs {
    display: flex;
    width: 40%;
    flex-wrap: nowrap;
    justify-content: space-between;

    .search {
      width: 30%;
    }

    .links {
      display: flex;
      width: 70%;
      flex-wrap: nowrap;
      justify-content: space-around;
    }
  }
}

#main {
  display: flex;
  width: 80%;
  height: 90%;
  flex-wrap: nowrap;

  .slide {
    width: 15%;
    border-right: 1px solid #e5e5e5;
    border-left: 1px solid #e5e5e5;
  }

  .content {
    display: flex;
    flex-wrap: wrap;
    width: 85%;
    padding: 0 5%;
    border-right: 1px solid #e5e5e5;

    .route {
      width: 100%;
    }

  }
}

#footer {
  width: 100%;
  height: 5%;
  border-top: 1px solid #e5e5e5;

}

</style>
