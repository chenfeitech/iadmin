<template>
  <div class="content">
    <a-upload
        v-model:file-list="fileList"
        :multiple="true"
        @change="handleChange"
        :custom-request="uploadFile"
    >
      <a-button>
        <upload-outlined></upload-outlined>
        选择文件上传
      </a-button>
    </a-upload>
  </div>

</template>

<script>
import {UploadOutlined} from '@ant-design/icons-vue';
import {defineComponent, ref, watch} from 'vue';
import {baseApi} from "../../api/base-api";

export default defineComponent({
  components: {
    UploadOutlined,
  },
  props:{
    fileList:{
      type:Array,
      default:null
    }
  },
  setup(props,ctx) {
    const fileList = ref(props.fileList);
    const handleChange = info => {

      // if (info.file.status !== 'uploading') {
      // }
      //
      // if (info.file.status === 'done') {
      // } else if (info.file.status === 'error') {
      //
      // }else if(info.file.status === 'remove'){
      // }

    };
    watch(fileList
    ,(newValue,oldValue)=>{
      ctx.emit("update:fileList",newValue)
    })
    const uploadFile = async function (data) {
      const formData = new FormData()
      formData.append('file', data)
      await baseApi.uploadFile(formData).then((res)=>{
        data.onSuccess()
        fileList.value[fileList.value.length-1] = {
          uid: fileList.value.length,
          name: res.data.file.oldName,
          status: 'done',
          url: process.env.VUE_APP_FILE_URL + res.data.file.url,
          path: res.data.file.path,
        }
      }).catch(()=>{
        // 执行pop则会上传错误后不显示这个文件
        // fileList.value.pop()
        // 执行下面这行代码，则上传错误后会显示成红色文件
        fileList.value[fileList.value.length-1].status = 'error'
      })
    }
    return {
      fileList,
      handleChange,
      uploadFile,
    };
  },
});
</script>

<style scoped>
.content{
  /*max-width: 40%;*/
}
</style>