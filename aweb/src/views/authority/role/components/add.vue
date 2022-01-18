<template>
  <a-drawer width="640" placement="right" :closable="true" :visible="addVisible" @close="onClose" title="新增角色">
    <p :style="pStyle">必填信息</p>
    <a-row>
      <a-col :span="12">
        <a-form-item label="角色名">
          <a-input v-model:value="formTemp.name"/>
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
import {sysRoleApi} from "../api/api";
import {message} from "ant-design-vue";
export default defineComponent({
  setup(props,ctx) {
    const addVisible = inject('addVisible')
    const formTemp = ref({
      name:''
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
      await sysRoleApi.addRoleInfo(formTemp.value).then((res)=>{
        message.success(res.msg)
      })
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