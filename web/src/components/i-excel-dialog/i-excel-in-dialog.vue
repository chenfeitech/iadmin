<template>
  <div>
    <a-modal v-model:visible="visible" title="批量导入" @ok="handleOk" okText="批量导入预览">
      <a-button @click="downloadTemplate">下载模板</a-button>
      <div style="margin-top: 15px">
        <a-upload
            v-model:file-list="fileList"
            name="file"
            :multiple="false"
            :before-upload="beforeUpload"
            @change="change"
        >
          <a-button type="primary">
            <upload-outlined></upload-outlined>
            选择文件
          </a-button>
        </a-upload>
      </div>
      <div style="height: 15px"></div>
      <a-typography-text type="warning" style="font-size: 12px;">单次上传的文件请不要超过3M！目前只支持XLSX格式！</a-typography-text>
    </a-modal>
  </div>
</template>

<script>
// 批量导入的弹框
import {ref, toRefs} from "vue";
import FileUpload from "../i-file-upload/file-upload";
import {message} from "ant-design-vue";

export default {
  name: "i-excel-in-dialog",
  components: {FileUpload},
  setup(props,ctx){
    const visible = ref(false);
    const fileList = ref([]);
    const showModal = () => {
      // 初始化
      fileList.value = []
      visible.value = true;
    };
    // beforeUpload 返回false将会手动上传
    const beforeUpload = file => {
      fileList.value = [...fileList.value, file];
      return false;
    };
    const handleOk = e => {
      if(fileList.value.length>0){
        visible.value = false;
        // 调用父组件的导入方法，并把文件传过去
        ctx.emit('emitExcelInPreview',fileList.value[0])
      }
      else
        message.warn('请选择一个文件！')
    };
    const downloadTemplate = function (){
      // 调用父类的下载模板的方法
      ctx.emit('emitDownloadTemplate')
    }
    // 监听文件改变事件实现只允许上传一个文件
    const change = function (){
      if(fileList.value.length>1){
        message.warn('只能选择一个文件！')
        fileList.value.pop();
      }
    }
    return{
      visible,
      fileList,
      showModal,
      handleOk,
      downloadTemplate,
      beforeUpload,
      change
    }
  }
}
</script>

<style scoped>
</style>