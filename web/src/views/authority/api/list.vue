<template>
  <i-container-card>
    <card title="数据筛选">
      <a-form layout="inline">
        <a-form-item label="接口描述">
          <a-input v-model:value="queryData.description">
          </a-input>
        </a-form-item>
        <a-form-item label="接口分组">
          <a-input v-model:value="queryData.apiGroup" >
          </a-input>
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
          <a-button @click="openExcelInDialog"><template #icon><DownloadOutlined /></template>批量导入</a-button>
        <a-button type="danger" @click="deleteBatch">批量删除</a-button>
        <a-button type="primary" @click="openAdd">新增接口</a-button>
        </a-space>
      </div>
      <data-table ref="dataTable"></data-table>
    </card>
  </i-container-card>
  <detail @reloadDataTable="reloadDataTable"></detail>
  <add @reloadDataTable="reloadDataTable"></add>
  <i-excel-out-dialog ref="excelOutDialog" @emitExcelOut="excelOut"></i-excel-out-dialog>
  <i-excel-in-dialog  ref="excelInDialog" @emitDownloadTemplate="downloadTemplate" @emitExcelInPreview="excelInPreview" ></i-excel-in-dialog>
  <i-excel-in-preview-dialog ref="excelInPreviewDialog" @emitExcelIn="excelIn" ></i-excel-in-preview-dialog>
</template>

<script>
import IContainerCard from "@/components/i-container/i-container-card";
import card from "@/components/i-card/i-card"
import {DownloadOutlined,UploadOutlined,SearchOutlined,DownOutlined,RedoOutlined} from '@ant-design/icons-vue'
import dataTable from "./components/data-table"
import detail from "./components/detail"
import add from "./components/add"
import {createVNode, defineComponent, provide, reactive, ref} from "vue";
import {message, Modal, notification} from "ant-design-vue";
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import {sysApiApi} from "./api/api";
import IDatePicker from "@/components/i-date-picker/i-date-picker";
import IExcelOutDialog from "../../../components/i-excel-dialog/i-excel-out-dialog";
import {downloadNotification} from "../../../util/function";
import IExcelInPreviewDialog from "../../../components/i-excel-dialog/i-excel-in-preview-dialog";
import IExcelInDialog from "../../../components/i-excel-dialog/i-excel-in-dialog";
import {sysUserApi} from "../user/api/api";
import {baseApi} from "../../../api/base-api";

export default defineComponent({
  name: "list",
  components: {
    IExcelInDialog,
    IExcelInPreviewDialog,
    IExcelOutDialog,
    IDatePicker, IContainerCard,card,dataTable,DownloadOutlined,UploadOutlined,detail,add,SearchOutlined,DownOutlined,RedoOutlined},
  setup(){
    const queryData = ref({
      description:'',
      apiGroup:'',
      method:'',
      createdAt:[],
      pagination:{
        current:1,
        pageSize:10,
        total:0,
      },
    })
    const detailConfig = ref({
      visible:false,
      info:{}
    });
    const addVisible = ref(false);
    const dataTable = ref();
    const IDatePicker = ref();
    // 批量导出子组件
    const excelOutDialog = ref();
    // 批量导入子组件
    const excelInDialog = ref();
    // 批量导入预览子组件
    const excelInPreviewDialog = ref();
    provide('detailConfig', detailConfig);
    provide('addVisible', addVisible);
    provide('queryData',queryData);
    const reloadDataTable = function (){
      dataTable.value.getList()
    }
    const openAdd = function (){
      addVisible.value = true
    }
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
          await sysApiApi.deleteBatchApi({ids:selectedRowKeys}).then((res)=>{
            message.success(res.msg);
          });;
          reloadDataTable();
        },
      });
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
    const openExcelInDialog = function (){
      excelInDialog.value.showModal();
    }
    const excelOut = async function (excelOutConfig) {
      downloadNotification();
      const data = {
        sysApiListSearch: queryData.value,
        excelOutConfig: excelOutConfig,
      }
      await sysApiApi.excelOut(data)
    }
    const downloadTemplate = async function () {
      downloadNotification();
      await baseApi.downloadExcelInTemplate('sys_api')
    }
    const excelInPreview = async function (data) {
      const formData = new FormData()
      formData.append('file', data.originFileObj)
      /* 显示批量导入预览的弹框 */
      excelInPreviewDialog.value.showModal();
      /* 请求接口 */
      await sysApiApi.excelInPreview(formData).then((res) => {
        // 显示表格
        excelInPreviewDialog.value.showDataTable(res.data)
      },function (res){
        // 发生错误 关闭弹框
        excelInPreviewDialog.value.hiddenModel();
      })
      /* 返回数据传给子组件显示 */
    }
    const excelIn = async function (saveFileName) {
      message.loading("批量导入中",0)
      await sysApiApi.excelIn(saveFileName).then((res)=>{
        // 取消加载中的message
        message.destroy()
        message.success(res.msg)
        // 重新加载数据
        reloadDataTable()
      },function (error){
        message.destroy()
        message.error(error)
      })
    }
    return{
      reloadDataTable,
      dataTable,
      openAdd,
      deleteBatch,
      queryData,
      clearQuery,
      queryDataFun,
      IDatePicker,
      openExcelOutDialog,
      excelOut,
      excelOutDialog,
      excelInDialog,
      excelInPreviewDialog,
      openExcelInDialog,
      downloadTemplate,
      excelInPreview,
      excelIn
    }
  }
})
</script>

<style lang="scss" scoped>
</style>