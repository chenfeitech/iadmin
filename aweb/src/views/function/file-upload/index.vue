<template>
  <i-container-card>
    <card title="基础上传">
      <file-upload v-model:fileList="fileList"></file-upload>
      <div style="margin-top: 20px">
        {{fileList}}
      </div>
    </card>

  </i-container-card>
</template>

<script>
import IContainerCard from "../../../components/i-container/i-container-card";
import FileUpload from "@/components/i-file-upload/file-upload";
import {ref} from "vue";
import card from "@/components/i-card/i-card"
export default {
  name: "index",
  components:{
    FileUpload,
    IContainerCard,
    card
  },
  setup(){
    const fileList = ref([
      {
        uid: '1',
        name: '已经上传成功的文件.png',
        status: 'done',
        url: 'http://www.baidu.com/xxx.png',
      },
      {
        uid: '2',
        name: '父组件传过来的值.png',
        status: 'done',
        url: 'http://www.baidu.com/yyy.png',
      },
      {
        uid: '3',
        name: '上传失败的文件.png',
        status: 'error',
        response: 'Server Error 500',
        url: 'http://www.baidu.com/zzz.png',
      },
    ]);
    return{
      fileList
    }
  }
}
</script>

<style scoped>
</style>