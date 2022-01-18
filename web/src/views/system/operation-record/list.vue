<template>
  <i-container-card>
    <card title="数据筛选">
      <a-form layout="inline">
        <a-form-item label="请求路径">
          <a-input v-model:value="queryData.path"></a-input>
        </a-form-item>
        <a-form-item label="请求方法">
          <a-select
              v-model:value="queryData.method"
              style="width: 150px"
          >
            <a-select-option value="GET">GET</a-select-option>
            <a-select-option value="POST">POST</a-select-option>
            <a-select-option value="PUT">PUT</a-select-option>
            <a-select-option value="DELETE">DELETE</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="请求状态">
          <a-input v-model:value="queryData.status"></a-input>
        </a-form-item>
        <a-form-item label="创建时间">
          <i-date-picker v-model:piker-date="queryData.createdAt" ref="IDatePicker"></i-date-picker>
        </a-form-item>
      </a-form>
      <div class="query-btn-row">
        <a-button type="primary" style="margin-right: 10px" @click="queryDataFun">
          <template #icon><SearchOutlined /></template>
          搜索
        </a-button>
        <a-button @click="clearQuery">清空</a-button>
      </div>
    </card>
    <card title="数据列表">
      <div class="data-table-btn-row">
        <a-space>
          <a-button @click="openExcelOutDialog"><template #icon><UploadOutlined /></template>批量导出</a-button>
          <a-dropdown>
            <template #overlay>
              <a-menu @click="startRefresh">
                <a-menu-item key="2">2秒</a-menu-item>
                <a-menu-item key="5">5秒</a-menu-item>
                <a-menu-item key="10">10秒</a-menu-item>
                <a-menu-item key="0">停止</a-menu-item>
              </a-menu>
            </template>
            <a-button>
              <RedoOutlined />{{intervalKey==="0"||!intervalKey?'':intervalKey+"秒"}}
              <DownOutlined />
            </a-button>
          </a-dropdown>
          <a-button type="danger" @click="deleteBatch">批量删除</a-button>
        </a-space>
      </div>
      <data-table ref="dataTable"></data-table>
    </card>
  </i-container-card>
  <i-excel-out-dialog ref="excelOutDialog" @emitExcelOut="excelOut"></i-excel-out-dialog>
</template>

<script>
import IContainerCard from "@/components/i-container/i-container-card";
import card from "@/components/i-card/i-card"
import IDatePicker from "@/components/i-date-picker/i-date-picker";
import dataTable from "./components/data-table"
import {createVNode, provide, ref} from "vue";
import {
  DownloadOutlined,
  UploadOutlined,
  SearchOutlined,
  DownOutlined,
  RedoOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons-vue'
import {message, Modal, notification} from "ant-design-vue";
import {sysOperationRecordApi} from "./api/api";
import IExcelOutDialog from "../../../components/i-excel-dialog/i-excel-out-dialog";
import {downloadNotification} from "../../../util/function";

export default {
  name: "list",
  components:{
    IExcelOutDialog,
    IContainerCard,card,IDatePicker,DownloadOutlined,UploadOutlined,SearchOutlined,DownOutlined,RedoOutlined,dataTable},
  setup() {
    const dataTable = ref();
    const IDatePicker = ref();
    // 批量导出子组件
    const excelOutDialog = ref();
    const interval = ref(null);
    const intervalKey = ref(null);
    const queryData = ref({
      path:null,
      method:null,
      status:null,
      createdAt: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
    })
    const reloadDataTable = function (){
      dataTable.value.getList()
    }
    provide('queryData',queryData)
    const deleteBatch = function (){
      const selectedRowKeys = dataTable.value.selectedRowKeys
      if(selectedRowKeys.length===0){
        Modal.info({
          title: '请先选择要删除的条目',
        });
        return
      }
      Modal.confirm({
        title: '你确定要删除这些条目吗？',
        icon: createVNode(ExclamationCircleOutlined),
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        async onOk() {
          await sysOperationRecordApi.deleteBatch({ids:selectedRowKeys}).then((res)=>{
            message.success(res.msg);
          })
          reloadDataTable();
        },
      });
    }
    const startRefresh = function (val){
      intervalKey.value = val.key
      if(interval){
        clearInterval(interval.value)
        if(val.key==="0"){
          return
        }
        interval.value = setInterval(function () {reloadDataTable()},val.key*1000)
      }
    }
    const clearQuery = function (){
      queryData.value = {
        realName:'',
        phone:'',
        createdAt:[],
        pagination:{
          current:1,
          pageSize:10,
          total:0,
        },
      }
      IDatePicker.value.initValue();
      reloadDataTable()
    }
    const queryDataFun = function (){
      queryData.value.pagination.current = 1
      reloadDataTable()
    }
    const openExcelOutDialog = function (){
      excelOutDialog.value.showModal();
    }
    const excelOut = async function (excelOutConfig) {
      downloadNotification();
      const data = {
        sysOperationRecordSearch: queryData.value,
        excelOutConfig: excelOutConfig,
      }
      await sysOperationRecordApi.excelOut(data)
    }
    return{
      queryData,
      queryDataFun,
      clearQuery,
      startRefresh,
      reloadDataTable,
      deleteBatch,
      dataTable,
      IDatePicker,
      intervalKey,
      openExcelOutDialog,
      excelOut,
      excelOutDialog
    }
  }
}
</script>

<style scoped>

</style>