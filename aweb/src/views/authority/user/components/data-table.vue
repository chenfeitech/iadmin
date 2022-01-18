<template>
  <data-count-row :count="queryData.pagination.total"></data-count-row>
  <a-table :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
           :customRow="customRow" :columns="columns" :data-source="data" :pagination="queryData.pagination" row-key="id" @change="handleTableChange" :loading="loading">
    <template #action="{ record }">
      <span>
        <a-space>
        <a-button type="primary" @click.stop="resetPassword(record)">重置密码</a-button>
        </a-space>
      </span>
    </template>
  </a-table>
</template>
<script>
import DataCountRow from "@/components/data-count/data-count-row";
import {defineComponent, onMounted, ref, inject, provide, createVNode} from 'vue';
import {sysUserApi} from "../api/api";
import * as util from "@/util/function";
import {message, Modal} from "ant-design-vue";
import {ExclamationCircleOutlined} from "@ant-design/icons-vue";
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: '真实姓名',
    dataIndex: 'real_name',
  },
  {
    title: '手机号',
    dataIndex: 'phone',
  },
  {
    title: '用户角色',
    dataIndex: 'role.name',
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    customRender: ({text, record, index}) => {
      return util.formatTime(text)
    },
  },
  {
    title: '最后更新时间',
    dataIndex: 'updated_at',
    customRender: ({text, record, index}) => {
      return util.formatTime(text)
    }
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    slots: {
      customRender: 'action',
    },
  }
];
export default defineComponent({
  components: {DataCountRow},
  setup() {
    const detailConfig = inject('detailConfig')
    const data = ref([])
    const selectedRowKeys = ref([])
    const loading = ref(false);
    const queryData = inject('queryData')
    const handleTableChange = function (pagination){
      queryData.value.pagination.current = pagination.current;
      getList();
    }
    const getList = async function () {
      loading.value = true;
      await sysUserApi.getList(queryData.value).then((res)=>{
        data.value = res.data.list;
        queryData.value.pagination.total = res.data.total
      })
      loading.value = false;
    }
    const customRow= function (record, index){
      return {
        onClick: (event) => {
          detailConfig.value.visible = true
          detailConfig.value.info = record
        },       // 点击行
      };
    }
    const onSelectChange = rows => {
      console.log('selectedRowKeys changed: ', rows);
      selectedRowKeys.value = rows;
    };
    const resetPassword = function (record){
      const userId = record.id
      Modal.confirm({
        title: '你确定要重置密码吗？',
        icon: createVNode(ExclamationCircleOutlined),
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        async onOk() {
          await sysUserApi.resetPassword(userId).then((res) => {
            message.success(res.msg);
          });
        },
      });
    }
    onMounted(()=>{
      getList();
    })
    return {
      data,
      columns,
      loading,
      queryData,
      handleTableChange,
      getList,
      customRow,
      selectedRowKeys,
      onSelectChange,
      resetPassword
    };
  },
});
</script>