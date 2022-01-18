<template>
  <data-count-row :count="queryData.total"></data-count-row>
  <a-table :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
           :customRow="customRow" :columns="columns" :data-source="data" :pagination="queryData" row-key="id" @change="handleTableChange" :loading="loading">
    <template #action="{ record }">
      <span>
        <a-button type="primary" @click.stop="openAuthority(record)">权限配置</a-button>
      </span>
    </template>
  </a-table>
</template>
<script>
import DataCountRow from "@/components/data-count/data-count-row";
import {defineComponent, onMounted, ref, inject, provide} from 'vue';
import {sysRoleApi} from "../api/api";
import * as util from "@/util/function";
import {message} from "ant-design-vue";
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: '角色名',
    dataIndex: 'name',
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
    width:140,
    slots: {
      customRender: 'action',
    },
  },
];
export default defineComponent({
  components: {DataCountRow},
  setup() {
    const detailConfig = inject('detailConfig')
    const data = ref([])
    const selectedRowKeys = ref([])
    const loading = ref(false);
    const queryData = inject('queryData')
    const authorityConfig = inject("authorityConfig")
    const handleTableChange = function (pagination){
      queryData.value.current = pagination.current;
      getList();
    }
    const getList = async function () {
      loading.value = true;
      await sysRoleApi.getList(queryData.value).then((res)=>{
        data.value = res.data.list;
        queryData.value.total = res.data.total
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
      selectedRowKeys.value = rows;
    };
    const openAuthority = function (record){
      authorityConfig.value.visible = true;
      authorityConfig.value.info = record;
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
      openAuthority
    };
  },
});
</script>