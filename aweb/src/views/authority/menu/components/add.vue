<template>
  <a-drawer width="640" placement="right" :closable="true" :visible="addConfig.visible" @close="onClose" :title="title">
    <p :style="pStyle">必填信息</p>
    <a-row>
      <a-col :span="12">
        <a-form-item label="展示标题">
          <a-input v-model:value="formTemp.title"/>
        </a-form-item>
      </a-col>

    </a-row>
    <a-row>
      <a-col :span="12">
        <a-form-item label="父菜单ID">
          <a-tree-select
              disabled
              placeholder=""
              v-model:value="formTemp.parentId"
          >
            <a-tree-select-node key="0" value="0" title="根节点" v-if="addConfig.method===0">
            </a-tree-select-node>
            <a-tree-select-node key="1" :value="addConfig.parentRecord.id" :title="addConfig.parentRecord.title" v-else>
            </a-tree-select-node>
          </a-tree-select>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="菜单层级">
          <a-input v-model:value="formTemp.menuLevel" disabled/>
        </a-form-item>
      </a-col>
    </a-row>
    <a-divider dashed/>
    <p :style="pStyle">可选信息</p>
    <a-row>
      <a-col :span="24">
        <a-form-item label="前端页面路径">
          <a-input addon-before="@/" v-model:value="formTemp.Component" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-form-item label="路由路径">
          <a-input  v-model:value="formTemp.path"/>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-form-item label="路由名称（英文）">
          <a-input  v-model:value="formTemp.name"/>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-form-item label="是否在菜单栏显示">
          <a-select
              v-model:value="formTemp.show_in_menu"
              style="width: 120px"
          >
            <a-select-option :value=true>显示</a-select-option>
            <a-select-option :value=false>隐藏</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-form-item label="是否开启Tab缓存">
          <a-select
              v-model:value="formTemp.keep_alive"
              style="width: 120px"
          >
            <a-select-option :value=true>开启</a-select-option>
            <a-select-option :value=false>关闭</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-form-item label="是否全屏显示">
          <a-select
              v-model:value="formTemp.full_page"
              style="width: 120px"
          >
            <a-select-option :value=true>是</a-select-option>
            <a-select-option :value=false>否</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="12">
        <a-form-item label="图标">
          <a-input v-model:value="formTemp.icon"/>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="展示顺序">
          <a-input v-model:value="formTemp.order" type="number"/>
        </a-form-item>
      </a-col>
    </a-row>

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
      <a-button type="primary" @click="add">新增</a-button>
    </div>
  </a-drawer>
</template>
<script>
import {computed, defineComponent, inject, onMounted, ref, watch} from 'vue';
import {sysMenuApi} from "../api/api";
import {message} from "ant-design-vue";
export default defineComponent({
  setup(props,ctx) {
    const addConfig = inject('addConfig')
    const title = computed(()=>{
      if(addConfig.value.method === 0)
        return "新增根菜单"
      if(addConfig.value.method === 1)
        return "添加子菜单"
    })
    const formTemp = ref({
      title:'',
      path:'',
      icon:'',
      name:'',
      order:0,
      keep_alive:true,
      full_page:false,
      Component:'',
      show_in_menu:true,
      parentId:0,
      menuLevel:1
    })
    watch(addConfig.value,()=>{
      if(addConfig.value.method === 1){
        formTemp.value.menuLevel = addConfig.value.parentRecord.menuLevel+1;
        formTemp.value.parentId = addConfig.value.parentRecord.id;
      }
    })
    const pStyle = {
      fontSize: '16px',
      color: 'rgba(0,0,0,0.85)',
      lineHeight: '24px',
      display: 'block',
      marginBottom: '16px',
    };
    const onClose = () => {
      addConfig.value.visible = false
    };
    const add = async function (){
      await sysMenuApi.addMenuInfo(formTemp.value).then((res)=>{
        message.success(res.msg)
      })
      ctx.emit('reloadDataTable')
    }
    return {
      addConfig,
      pStyle,
      onClose,
      add,
      formTemp,
      title
    };
  },
});
</script>
<style scoped>
/deep/ .ant-form-item {
  margin-bottom: 10px;
}
</style>