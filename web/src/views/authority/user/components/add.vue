<template>
  <a-drawer width="640" placement="right" :closable="true" :visible="addVisible" @close="onClose" title="新增用户">
    <p :style="pStyle">必填信息</p>
    <a-row>
      <a-col :span="12">
        <a-form-item label="真实姓名">
          <a-input v-model:value="formTemp.real_name"/>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="手机号">
          <a-input v-model:value="formTemp.phone"/>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-form-item label="用户角色">
          <a-select
              v-model:value="formTemp.role_id"
              style="width: 200px"
          >
            <a-select-option :value="item.id" v-for="(item,index) in roleAll">{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    <a-typography-text type="warning">新用户默认密码为：123456</a-typography-text>
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
import {defineComponent, inject, onMounted, ref} from 'vue';
import {sysUserApi} from "../api/api";
import {isPhone} from "@/util/function";
import {message} from "ant-design-vue";
import {sysRoleApi} from "../../role/api/api";
export default defineComponent({
  setup(props,ctx) {
    const addVisible = inject('addVisible')
    const roleAll = ref([])
    const formTemp = ref({
      real_name:'',
      phone:'',
      role_id:''
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
    const getRoleAll = async function () {
      let res = await sysRoleApi.getList({
        current: 1,
        pageSize: 999,
      })
      roleAll.value = res.data.list;
    }
    const add = async function (){
      if(!isPhone(formTemp.value.phone)){
        return message.error('手机号格式不正确，请重新输入！')
      }
      await sysUserApi.addUserInfo(formTemp.value).then((res)=>{
        message.success(res.msg);
      });
      // onClose();
      ctx.emit('reloadDataTable')
    }
    onMounted(()=>{
      getRoleAll()
    })
    return {
      addVisible,
      pStyle,
      onClose,
      add,
      formTemp,
      roleAll
    };
  },
});
</script>
<style scoped>
/deep/ .ant-form-item {
  margin-bottom: 10px;
}
</style>