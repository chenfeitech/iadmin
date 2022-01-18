<template>
  <a-layout style="height: 100%;overflow: hidden;">
    <!--  侧边  -->
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible theme="light">
        <!--  侧边头部   -->
        <div class="logo">
          <img src="../assets/logo.png"  alt="">
          <div v-show="!collapsed">iAdmin</div>
        </div>
        <!--  侧边菜单栏  -->
        <i-menu class="layout-sider__body"></i-menu>
        <!--  侧边底部版权信息    -->
        <div class="version-content" v-show="!collapsed">
          <div>Version {{version}}</div>
          <div>版权所有@iAdmin</div>
        </div>
    </a-layout-sider>
    <!--  主体  -->
    <a-layout>
      <!--  主体头部  -->
      <a-layout-header class="layout-header">
        <div class="layout-header__left">
          <menu-unfold-outlined
              v-if="collapsed"
              class="trigger"
              @click="() => (collapsed = !collapsed)"
          />
          <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
          <!--    面包屑      -->
          <div class="crumbs-content">
            <a-breadcrumb>
              <a-breadcrumb-item v-for="(item,index) in crumbs" :key="index">{{item}}</a-breadcrumb-item>
            </a-breadcrumb>
          </div>
        </div>
        <div class="layout-header__right">
          <!-- 显示用户名 -->
          <i-header-user></i-header-user>
        </div>
      </a-layout-header>
      <!--  Tab标签栏    -->
      <i-tabs></i-tabs>
      <!--  主体内容  -->
      <a-layout-content class="i-container-main-body">
        <transition name="slide" mode="out-in">
          <router-view />
        </transition>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,

} from '@ant-design/icons-vue';
import {computed, defineComponent, nextTick, provide, ref} from 'vue';
import IHeaderUser from "./components/i-header-user";
import ITabs from "./components/i-tabs"
import IMenu from "./components/i-menu";
import {onBeforeRouteUpdate} from "vue-router";
import {useStore} from "vuex";
export default defineComponent({
  components: {
    IMenu,
    ITabs,
    IHeaderUser,
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
  },

  setup() {
    const version = process.env.VUE_APP_VERSION;
    const store = useStore();
    const crumbs = computed(()=>{
      return store.getters["router/menuCrumbs"]
    })
    const collapsed = ref(false)
    provide("menu-collapsed",collapsed)
    return {
      collapsed,
      crumbs,
      version
    };
  },
});
</script>
<style  scoped>
/deep/ .ant-layout{
  background-color: rgba(224, 234, 252, 0.1);
}
.slide-enter-active{
  transition: all .2s ease;
}
.slide-leave-active{
  transition: all .2s ease;

}
.slide-enter-from,
.slide-leave-to{
  transform: translateY(10px);
  opacity: 0;
}

.i-container-main-body{
  position: relative;
  z-index: 0;
}
.logo{
  height: 64px;
  color: #000;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  border-right: 1px solid #f0f0f0;
  background: #ffffff;  /* fallback for old browsers */
}
.logo img{
  width: 35px;
  height: 35px;
  margin-right: 10px;
}
.layout-sider__body{
  position: absolute;
  top: 64px;
  bottom: 64px;
  width: 100%;
  left: 0;
  overflow-y: auto;
  overflow-x: hidden;
}
.version-content{
  position: absolute;
  bottom: 0;
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 64px;
  font-size: 0.75rem !important;
  font-weight: 300 !important;
  color: rgba(0, 0, 0, 0.87);
  letter-spacing:0.0333333333em !important;
  line-height:1.25rem;
}
.layout-header__left{
  display: flex;
  flex-direction: row;
  align-items: center;
}
.crumbs-content{
  margin-left: 20px;
}
.layout-header__right{
  display: flex;
  flex-direction: row;
}
.layout-header{
  background-color: #fff;
  padding-left: 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
/deep/ .ant-layout-header{
  padding-right: 30px;
}
.user-name-content{
  cursor: pointer;
}
.user-name-menu{
  position: absolute;
  top: 30px;
  background-color: #fff;
  width: 80px;

}
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.3);
  margin: 16px;
}

.site-layout .site-layout-background {
  background: #fff;
}
::-webkit-scrollbar-track
{
  background: rgba(0,0,0,.1);
  border-radius: 5px;
}

::-webkit-scrollbar
{
  -webkit-appearance: none;
  width: 0px;
  height: 10px;
}

::-webkit-scrollbar-thumb
{
  cursor: pointer;
  border-radius: 5px;
  background: rgba(0,0,0,.10);
  transition: color .2s ease;
}
</style>
