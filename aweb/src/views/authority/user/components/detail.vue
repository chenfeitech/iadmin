<template>
  <a-drawer width="640" placement="right" :closable="true" :visible="detailConfig.visible" @close="onClose" title="用户信息">
    <p :style="pStyle">必填信息</p>
    <a-row>
      <a-col :span="12">
        <a-form-item label="真实姓名">
          <a-input v-model:value="copyDetail.real_name"/>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="手机号">
          <a-input v-model:value="copyDetail.phone"/>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-form-item label="用户角色">
          <a-select
              v-model:value="copyDetail.role_id"
              style="width: 200px"
          >
            <a-select-option :value="item.id" v-for="(item,index) in roleAll">{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    <a-divider dashed/>
    <p :style="pStyle">不可修改信息</p>
    <a-row>
      <a-col :span="24">
        <a-form-item label="ID">
          {{ copyDetail.id }}
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="12">
        <a-form-item label="创建时间">
          {{ createdAt}}
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="最后更新时间">
          {{ updatedAt }}
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
      <a-button type="primary" @click="update">保存修改</a-button>
    </div>
  </a-drawer>
</template>
<script>
import {computed, defineComponent, useContext, inject, watch, ref, onMounted} from 'vue';
import {formatTime} from "@/util/function";
import _ from "lodash";
import {sysUserApi} from "../api/api";
import {sysRoleApi} from "../../role/api/api";
import {message} from "ant-design-vue";
import {isPhone} from "@/util/function";
export default defineComponent({
  setup() {
    const ctx = useContext()
    const detailConfig = inject('detailConfig')
    const copyDetail = ref({})
    const roleAll = ref([])
    const createdAt = computed(()=>{
      return formatTime(detailConfig.value.info.created_at)
    })
    const updatedAt = computed(()=>{
      return formatTime(detailConfig.value.info.updated_at)
    })
    const getRoleAll = async function () {
      await sysRoleApi.getList({
        current: 1,
        pageSize: 999,
      }).then((res)=>{
        roleAll.value = res.data.list;
      })
    }
    const pStyle = {
      fontSize: '16px',
      color: 'rgba(0,0,0,0.85)',
      lineHeight: '24px',
      display: 'block',
      marginBottom: '16px',
    };
    const onClose = () => {
      detailConfig.value.visible= false
    };
    watch(detailConfig.value,(newProps, oldProps) => {
      if(detailConfig.value.visible){
        // 深复制
        copyDetail.value = _.cloneDeep(detailConfig.value.info)
      }
    })
    const update = async function (){
      copyDetail.value.role = null;
      if(!isPhone(copyDetail.value.phone)){
        return message.error('手机号格式不正确，请重新输入！')
      }
      await sysUserApi.updateUserInfo(copyDetail.value).then((res)=>{
        message.success(res.msg);
      });
      ctx.emit('reloadDataTable')
      // onClose();
    }
    onMounted(()=>{
      getRoleAll()
    })
    return {
      copyDetail,
      detailConfig,
      pStyle,
      onClose,
      update,
      createdAt,
      updatedAt,
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