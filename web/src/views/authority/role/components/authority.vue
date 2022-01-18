<template>
  <a-drawer
      width="640" placement="right" :closable="true" :visible="authorityConfig.visible" @close="onClose" title="权限配置"
  >
    <a-tabs v-model:activeKey="tabActiveKey">
      <a-tab-pane key="1" tab="角色菜单配置">
        <a-tree
            checkable
            :treeData="allMenuData"
            default-expand-all
            :replaceFields="{children:'children', title:'title', key:'id' }"
            @check="checkMenu"
            v-model:checkedKeys="selectedMenuKeys"
            style="margin-bottom: 50px"
        >
          <template v-slot:custom="item">
            <span>{{ item.title }}</span>
            <span style="right: 20px;float: right;position: absolute;color: rgb(230, 162, 60);font-size: 12px"
                  v-if="item.defaultRouter">首页</span>
            <span style="right: 20px;float: right;position: absolute;color: rgb(133, 206, 97);font-size: 12px" v-else
                  @click="setDefaultRouter(item.path)">设为首页</span>
          </template>
        </a-tree>
      </a-tab-pane>
      <a-tab-pane key="2" tab="角色接口配置" force-render>
        <a-tree
            checkable
            :tree-data="allApiData"
            default-expand-all
            :replaceFields="{children:'children', title:'description', key:'id' }"
            v-model:checkedKeys="selectedApiKeys"
            style="margin-bottom: 50px"
        >
        </a-tree>
      </a-tab-pane>
    </a-tabs>
    <div
        :style="{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
        zIndex: 1,
      }"
    >
      <a-button style="margin-right: 8px" @click="onClose">取消</a-button>
      <a-button type="primary" @click="save">保存修改</a-button>
    </div>
  </a-drawer>
</template>
<script>
import {sysMenuApi} from "../../menu/api/api";
import {defineComponent, inject, onMounted, ref, watch} from 'vue';
import {sysRoleApi} from "../api/api";
import {sysApiApi} from "../../api/api/api";
import {useStore} from "vuex";
import {message} from "ant-design-vue";

export default defineComponent({
  setup(props, ctx) {
    const authorityConfig = inject("authorityConfig")
    const tabActiveKey = ref('1')
    const allMenuData = ref([])
    const allApiData = ref([])
    const selectedMenuKeys = ref([])
    const selectedApiKeys = ref([])
    const checkedMenuKeys = ref([])
    const onClose = () => {
      authorityConfig.value.visible = false;
    };
    watch(authorityConfig.value, async () => {
      selectedMenuKeys.value = []
      selectedApiKeys.value = []
      await getCasbin()
      let menus = authorityConfig.value.info.menus
      // 防止选中了父节点直接全选子节点
      menus.map(item => {
        if (!menus.some(same => same.parentId === item.id)) {
          selectedMenuKeys.value.push(Number(item.id))
        }
      })
      // 自定义树的子节点（设置首页）
      processMenuTree(allMenuData.value)
    })
    const getMenuTree = async function () {
      await sysMenuApi.getList().then((res)=>{
        allMenuData.value = res.data.list;
      })
    }
    const processMenuTree = function (menus) {
      let defaultRouter = authorityConfig.value.info.default_router
      menus.map(item => {
        // 查找首页，并设置为不能修改
        if (defaultRouter === item.path) {
          item['defaultRouter'] = true
          item['disabled'] = true
        } else {
          item['defaultRouter'] = false
          item['disabled'] = false
        }
        // 子菜单不能设为首页
        // 未选定的菜单不能设为首页
        if (item.path !== '' && selectedMenuKeys.value.some(selectMenuID => {
          return item.id === selectMenuID
        })) {
          item['slots'] = {title: 'custom'}
        } else {
          item['slots'] = {}
        }
        if (item.hasOwnProperty('children') && item.children && item.children.length > 0)
          processMenuTree(item.children)
      })
    }
    const setDefaultRouter = async function (defaultRouter) {
      let data = {
        default_router: defaultRouter,
        role_id: authorityConfig.value.info.id
      };
      await sysRoleApi.setDefaultRouter(data).then((res)=>{
        changeDefaultRouter(allMenuData.value, defaultRouter)
        ctx.emit('reloadDataTable')
      })
    }
    const changeDefaultRouter = function (menus, defaultRouter) {
      menus.map(item => {
        if (item.path === defaultRouter) {
          item['defaultRouter'] = true
          item['disabled'] = true
        } else {
          item['defaultRouter'] = false
          item['disabled'] = false
        }
        if (item.hasOwnProperty('children') && item.children && item.children.length > 0)
          changeDefaultRouter(item.children, defaultRouter)
      })
    }
    const getApiTree = async function () {
      await sysApiApi.getTree().then((res)=>{
        Object.keys(res.data).forEach(function (key) {
          let item = {id: key + "组", description: key + "组", children: res.data[key]}
          allApiData.value.push(item)
        })
      })
    }
    const getCasbin = async function () {
      await sysRoleApi.getCasbin({roleId: authorityConfig.value.info.id.toString()}).then((res)=>{
        if(!res.data.paths){
          return
        }
        res.data.paths.map((item) => {
          allApiData.value.map(apiGroup => {
            apiGroup.children.map(api => {
              if (item.path === api.path && item.method === api.method) {
                selectedApiKeys.value.push(api.id)
              }
            })
          })
        })
      });
    }
    const save = async function () {
      if (tabActiveKey.value === '1') {
        let data = {role_id: authorityConfig.value.info.id, menus: []}
        checkedMenuKeys.value.forEach((v, k) => {
          let menuItem = {id: v}
          data.menus.push(menuItem)
        })
        await sysRoleApi.updateRoleMenuConfig(data).then((res)=>{
          message.success(res.msg);
          ctx.emit('reloadDataTable')
        })
      } else {
        selectedApiKeys.value = selectedApiKeys.value.filter(item => item.toString().indexOf('组') < 0)
        let data = {roleId: authorityConfig.value.info.id.toString(), casbinInfos: []}
        selectedApiKeys.value.map((item) => {
          allApiData.value.map(apiGroup => {
            apiGroup.children.map(api => {
              if(api.id===item){
                let apiItem = {method: api.method, path: api.path};
                data.casbinInfos.push(apiItem)
              }
            })
          })
        })
        await sysRoleApi.updateCasbin(data).then((res)=>{
          message.success(res.msg);
          ctx.emit('reloadDataTable')
        })
      }
    }
    const checkMenu = function (checkedKeys, e) {
      checkedMenuKeys.value = []
      checkedKeys.forEach(key => {
        checkedMenuKeys.value.push(key)
      })
      e.halfCheckedKeys.forEach(key => {
        checkedMenuKeys.value.push(key)
      })
    }
    onMounted(() => {
      getMenuTree()
      getApiTree()

    })
    return {
      authorityConfig,
      onClose,
      allMenuData,
      allApiData,
      selectedMenuKeys,
      selectedApiKeys,
      tabActiveKey,
      save,
      checkMenu,
      checkedMenuKeys,
      setDefaultRouter
    };
  },
});
</script>

