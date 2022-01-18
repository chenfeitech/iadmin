<template>
  <data-count-row :count="queryData.pagination.total"></data-count-row>
  <a-table :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
           :customRow="customRow" :columns="columns" :data-source="data" :pagination="queryData.pagination" row-key="id" @change="handleTableChange" :loading="loading">
  </a-table>
</template>
<script>
import DataCountRow from "@/components/data-count/data-count-row";
import {defineComponent, onMounted, ref, inject, provide} from 'vue';
import {sysApiApi} from "../api/api";
import * as util from "@/util/function";
import {message} from "ant-design-vue";
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: '接口描述',
    dataIndex: 'description',
  },
  {
    title: '请求路径',
    dataIndex: 'path',
  },
  {
    title: '请求方法',
    dataIndex: 'method',
  },  {
    title: '接口分组',
    dataIndex: 'apiGroup',
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
      await sysApiApi.getList(queryData.value).then((res)=>{
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
      selectedRowKeys.value = rows;
    };
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
      onSelectChange
    };
  },
});
</script>