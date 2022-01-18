<template>
  <a-drawer width="640" placement="right" :closable="true" :visible="addVisible" @close="onClose" title="新增接口">
    <p :style="pStyle">必填信息</p>
    <a-row>
      <a-col :span="24">
        <a-form-item label="接口描述">
          <a-input v-model:value="formTemp.description"/>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-form-item label="请求路径">
          <a-input v-model:value="formTemp.path" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="12">
        <a-form-item label="请求方法">
          <a-select
              v-model:value="formTemp.method"
              style="width: 150px"
          >
            <a-select-option value="GET">GET</a-select-option>
            <a-select-option value="POST">POST</a-select-option>
            <a-select-option value="PUT">PUT</a-select-option>
            <a-select-option value="DELETE">DELETE</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="接口分组">
          <a-input v-model:value="formTemp.apiGroup"/>
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
import {defineComponent,inject,ref} from 'vue';
import {sysApiApi} from "../api/api";
import {message} from "ant-design-vue";
export default defineComponent({
  setup(props,ctx) {
    const addVisible = inject('addVisible')
    const formTemp = ref({
      description:'',
      path:'/api/',
      method:'GET',
      apiGroup:'',
    })
    const pStyle = {
      fontSize: '16px',
      color: 'rgba(0,0,0,0.85)',
      lineHeight: '24px',
      display: 'block',
      marginBottom: '16px',
    };
    const onClose = () => {
      addVisible.value = false
    };
    const add = async function (){
      await sysApiApi.addApiInfo(formTemp.value).then((res)=>{
        message.success(res.msg);
      });
      ctx.emit('reloadDataTable')
    }
    return {
      addVisible,
      pStyle,
      onClose,
      add,
      formTemp
    };
  },
});
</script>
<style scoped>
/deep/ .ant-form-item {
  margin-bottom: 10px;
}
</style>