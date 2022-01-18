<template>
  <div class="scroll-content">
    <a-menu
        v-model:selectedKeys="selectedKeys"
        @click="selectMenu"
        @openChange="openMenu"
        mode="inline"
        theme="light"
        v-model:openKeys = "openKeys"
        :inline-collapsed="collapsed"
    >
      <template v-for="item in menus" :key="item.id">
        <template v-if="!item.children">
          <a-menu-item :key="item.path" v-if="item.show_in_menu">
              <component :is="item.icon" v-if="item.icon&&item.icon!==''"></component>
              <FileOutlined v-else/>
            <span>{{ item.title }}</span>
          </a-menu-item>
        </template>
        <template v-else>
          <sub-menu :menu-info="item" :key="item.id" v-if="item.show_in_menu"/>
        </template>
      </template>
    </a-menu>
  </div>
</template>
<script>
import {computed, defineComponent, inject, ref} from 'vue';
import {useStore} from "vuex";
import {onBeforeRouteUpdate, useRouter} from "vue-router"; // you can rewrite it to a single file component, if not, you should config vue alias to vue/dist/vue.esm-bundler.api

const SubMenu = {
  name: 'SubMenu',
  props: {
    menuInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  template: `
    <a-sub-menu :key="menuInfo.id" v-bind="$attrs">
    <template #title>
        <span>
          <component :is="menuInfo.icon" v-if="menuInfo.icon&&menuInfo.icon!==''"></component>
          <BarsOutlined v-else/>
          <span>{{ menuInfo.title }}</span>
        </span>
    </template>
    <template v-for="item in menuInfo.children" :key="item.id">
      <template v-if="!item.children">
        <a-menu-item :key="item.path" v-if="item.show_in_menu">
          <component :is="item.icon" v-if="item.icon&&item.icon!==''"></component>
          <FileOutlined v-else/>
          <span>{{ item.title }}</span>
        </a-menu-item>
      </template>
      <template v-else>
        <sub-menu :menu-info="item" :key="item.id" v-if="item.show_in_menu"/>
      </template>
    </template>
    </a-sub-menu>
  `,
  components: {},
};

export default defineComponent({
  setup() {
    const store = useStore();
    const router = useRouter();
    const openKeys = computed(()=>{
      return store.getters["router/activeMenuOpen"]
    })
    const selectedKeys = computed(()=>{
      return store.getters["router/activeMenuSelect"]
    })
    const collapsed = inject("menu-collapsed")
    const menus = computed(() => {
      return store.getters["router/asyncMenus"]
    })
    onBeforeRouteUpdate(to => {
      // 监控路由变化，路由发生变化，高亮对应的菜单
      // 用来记录路径和是否查找到节点
      // 这里用对象,因为函数参数是对象的时候是引用传值,如果是变量则为值传值!!!!
      const flag = {
        path: [],
        pathName:[],
        success: false
      };
      // 回溯法遍历树!!!!
      getIndexMenu(menus.value, to.path,flag)
      // 如果成功找到节点
      if(flag.success){
        // 调用setActiveMenuOpen，则每次只能展开一个菜单栏
        store.commit("router/setActiveMenuOpen",flag.path)
        // 若调用addActiveMenuOpen，则可以同时展开多个菜单栏
        // store.commit("router/addActiveMenuOpen",flag.path)
        // 设置面包屑路径
        store.commit("router/setMenuCrumbs",flag.pathName)
      }else{
        // 如果没有找到结果，可能该页面开启了keepAlive但不在菜单栏里
        // 菜单栏不再高亮并关闭所有打开的菜单
        store.commit("router/setActiveMenuSelect","")
        store.commit("router/setActiveMenuOpen",[])
        // 设置面包屑为页面标题
        store.commit("router/setMenuCrumbs",[to.meta.title])
      }
    })
    const selectMenu = function (val) {
      store.commit("router/setActiveMenuSelect",val.key)
      router.push(val.key)
    }
    const openMenu = function (value){
      store.commit("router/setActiveMenuOpen",value)
    }
    const getIndexMenu = function (menuItem, targetPath,flag) {
      // 遍历所有根节点
      for (let i = 0; i < menuItem.length; i++) {
        const item = menuItem[i]
        // 将节点ID写入路径列表里
        flag.path.push(item.id)
        // 将菜单名称写入列表里
        flag.pathName.push(item.title)
        if (item.hasOwnProperty('children') && item.children && item.children.length > 0) {
          // 递归遍历子节点
          getIndexMenu(item.children, targetPath,flag)
        } else {
          // 如果找到了目标节点，则保存改路径
          // 否则则会退出这层递归
          if (item.path === targetPath) {
            // 查找到对应的菜单，设为高亮
            store.commit("router/setActiveMenuSelect",targetPath)
            flag.success = true;
            break
          }
        }
        if(flag.success){
          return
        }
        // 运行到这说明该层没有找到对应的节点，该层递归错误，进行回溯
        flag.path.pop()
        flag.pathName.pop()
      }
    }
    return {
      selectedKeys,
      collapsed,
      selectMenu,
      menus,
      openKeys,
      openMenu
    }
  },

  components: {
    'sub-menu': SubMenu,
  },
});
</script>
<style scoped>
.scroll-content{
  overflow-y: auto;
  height: cal(100% - 64px);
  overflow-x: hidden;
  border-right: 1px solid #f0f0f0;
}
/deep/ .ant-menu-inline, .ant-menu-vertical, .ant-menu-vertical-left{
  border-right: none;
}
</style>