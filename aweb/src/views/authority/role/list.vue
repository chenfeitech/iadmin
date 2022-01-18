<template>
  <i-container-card>
    <card title="数据列表">
      <div class="data-table-btn-row">
        <a-space>
        <a-button @click="openExcelOutDialog"><template #icon><UploadOutlined /></template>批量导出</a-button>
<!--          <a-button><template #icon><DownloadOutlined /></template>批量导入</a-button>-->
        <a-button type="danger" @click="deleteBatch">批量删除</a-button>
        <a-button type="primary" @click="openAdd">新增角色</a-button>
        </a-space>
      </div>
      <data-table ref="dataTable"></data-table>
    </card>
  </i-container-card>
  <detail @reloadDataTable="reloadDataTable"></detail>
  <add @reloadDataTable="reloadDataTable"></add>
  <authority @reloadDataTable="reloadDataTable"></authority>
  <i-excel-out-dialog ref="excelOutDialog" @emitExcelOut="excelOut"></i-excel-out-dialog>
</template>

<script>
import IContainerCard from "@/components/i-container/i-container-card";
import card from "@/components/i-card/i-card"
import {DownloadOutlined,UploadOutlined,SearchOutlined,DownOutlined,RedoOutlined} from '@ant-design/icons-vue'
import dataTable from "./components/data-table"
import detail from "./components/detail"
import authority from "./components/authority"
import add from "./components/add"
import {createVNode, defineComponent, provide, reactive, ref} from "vue";
import {message, Modal, notification} from "ant-design-vue";
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import {sysRoleApi} from "./api/api";

import IDatePicker from "@/components/i-date-picker/i-date-picker";
import IExcelOutDialog from "../../../components/i-excel-dialog/i-excel-out-dialog";
import {downloadNotification} from "../../../util/function";


export default defineComponent({
  name: "list",
  components: {
    IExcelOutDialog,
    IDatePicker, IContainerCard,card,dataTable,DownloadOutlined,UploadOutlined,detail,add,SearchOutlined,DownOutlined,RedoOutlined,authority},
  setup(){
    const queryData = ref({
        current:1,
        pageSize:10,
        total:0,
    })
    const detailConfig = ref({
      visible:false,
      info:{}
    });
    const authorityConfig = ref({
      visible:false,
      info:{}
    })
    const addVisible = ref(false);
    const dataTable = ref();
    // 批量导出子组件
    const excelOutDialog = ref();
    provide('detailConfig', detailConfig);
    provide('addVisible', addVisible);
    provide('authorityConfig', authorityConfig);
    provide('queryData',queryData)
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
          await sysRoleApi.deleteBatchRole({ids:selectedRowKeys}).then((res)=>{
            message.success(res.msg);
          });
          reloadDataTable();
        },
      });
    }
    const openExcelOutDialog = function (){
      excelOutDialog.value.showModal();
    }
    const excelOut = async function (excelOutConfig) {
      downloadNotification();
      const data = {
        pagination: queryData.value,
        excelOutConfig: excelOutConfig,
      }
      await sysRoleApi.excelOut(data)
    }
    return{
      reloadDataTable,
      dataTable,
      openAdd,
      deleteBatch,
      queryData,
      excelOutDialog,
      openExcelOutDialog,
      excelOut
    }
  }
})
</script>

<style lang="scss" scoped>
</style>