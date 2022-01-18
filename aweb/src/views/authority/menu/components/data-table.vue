<template>
  <data-count-row :count="total"></data-count-row>
  <a-table :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" :indentSize="30" :scroll="{ x: 2000}"
           :customRow="customRow" :columns="columns" :data-source="data" row-key="id" :loading="loading">
    <template #action="{ record }">
      <span>
        <a-button type="primary" @click.stop="addSubMenu(record)">添加子菜单</a-button>
      </span>
    </template>
  </a-table>
</template>
<script>
import DataCountRow from "@/components/data-count/data-count-row";
import {defineComponent, onMounted, ref, inject, provide} from 'vue';
import {sysMenuApi} from "../api/api";
import * as util from "@/util/function";
import {message} from "ant-design-vue";
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: '展示标题',
    dataIndex: 'title',
  },
  {
    title: '路由路径',
    dataIndex: 'path',
  },
  {
    title: '路由名称',
    dataIndex: 'name',
  },
  {
    title: '前端页面路径',
    dataIndex: 'Component',
  },
  {
    title: '展示顺序',
    dataIndex: 'order',
  },
  {
    title: '图标',
    dataIndex: 'icon',
  },
  {
    title: '是否在菜单显示',
    dataIndex: 'show_in_menu',
    customRender: ({text, record, index}) => {
      return text?'显示':'隐藏'
    },
  },
  {
    title: '是否使用Tab缓存',
    dataIndex: 'keep_alive',
    customRender: ({text, record, index}) => {
      return text?'使用':'不使用'
    },
  },
  {
    title: '是否全屏显示',
    dataIndex: 'full_page',
    customRender: ({text, record, index}) => {
      return text?'是':'否'
    },
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
    },
  },
  {
    title: '操作',
    key: 'action',
    width:120,
    // 固定列
    fixed: 'right',
    slots: {
      customRender: 'action',
    },
  },
];
export default defineComponent({
  components: {DataCountRow},
  setup() {
    const detailConfig = ref(inject('detailConfig'))
    const addConfig = inject('addConfig')
    const data = ref([])
    const total = ref(0)
    const selectedRowKeys = ref([])
    const loading = ref(false);

    const getList = async function () {
      loading.value = true;
      await sysMenuApi.getList().then((res)=>{
        data.value = res.data.list;
        total.value = res.data.total
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
    const addSubMenu = function (record){
      addConfig.value.visible = true
      addConfig.value.method = 1
      addConfig.value.parentRecord = record
    }
    onMounted(()=>{
      getList();
    })
    return {
      data,
      columns,
      loading,
      total,
      getList,
      customRow,
      selectedRowKeys,
      onSelectChange,
      addSubMenu
    };
  },
});
</script>