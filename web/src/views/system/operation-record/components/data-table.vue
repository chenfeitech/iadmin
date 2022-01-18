<template>
  <data-count-row :count="queryData.pagination.total"></data-count-row>
  <a-table :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"  :scroll="{ x: 2000}"
           :customRow="customRow" :columns="columns" :data-source="data" :pagination="queryData.pagination" row-key="id" @change="handleTableChange" :loading="loading">
  </a-table>
</template>
<script>
import DataCountRow from "@/components/data-count/data-count-row";
import {defineComponent, onMounted, ref, inject, provide} from 'vue';
import {sysOperationRecordApi} from "../api/api";
import * as util from "@/util/function";
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: '请求ip',
    dataIndex: 'ip',
    width: 100,
  },
  {
    title: '发起用户',
    dataIndex: 'user.real_name',
    width: 100,
  },
  {
    title: '请求路径',
    dataIndex: 'path',
    ellipsis: true,
  },
  {
    title: '请求body',
    dataIndex: 'body',
    ellipsis: true,
  },
  {
    title: '请求方法',
    dataIndex: 'method',
    width: 100,
  },
  {
    title: '代理',
    dataIndex: 'agent',
    ellipsis: true,
  },
  {
    title: '请求状态',
    dataIndex: 'status',
    width: 100,
    customRender: ({text, record, index}) => {
      if(text===200)
        return <a-tag color="success">{text}</a-tag>
      else
        return <a-tag color="success">{text}</a-tag>
    },
  },
  {
    title: '延迟(ms)',
    dataIndex: 'latency',
    width: 100,
    customRender: ({text, record, index}) => {
      return (text/1000/1000).toFixed(2)
    },
  },
  {
    title: '响应body',
    dataIndex: 'resp',
    ellipsis: true,
  },
  {
    title: '错误信息',
    dataIndex: 'error_message',
    width: 100,
    ellipsis: true,
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
      await sysOperationRecordApi.getList(queryData.value).then((res)=>{
        data.value = res.data.list;
        queryData.value.pagination.total = res.data.total
      });
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