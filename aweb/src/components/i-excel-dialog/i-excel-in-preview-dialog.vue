<template>
  <a-modal
      v-model:visible="visible"
      title="批量导入预览"
      @ok="handleOk"
      width="70%"
      :body-style="bodyStyle"
      style="top: 20px"
      ok-text="导入"
  >
    <div class="loading" v-show="isLoading">
      <a-spin></a-spin>
    </div>
    <table id="dataTableContent">
      <template v-for="(tr,trIndex) in dataList" :key="trIndex">
        <tr>
          <template v-for="(td,tdIndex) in tr" :key="tdIndex">
            <th v-if="trIndex===0" v-html="td"></th>
            <td v-else v-html="td"></td>
          </template>
        </tr>
      </template>
    </table>
  </a-modal>
</template>

<script>
// 批量导入预览全屏弹框
import {ref} from "vue";
import {message} from "ant-design-vue";

export default {
  name: "i-excel-in-preview-dialog",
  setup(props,ctx) {
    const visible = ref(false);
    const isLoading = ref(false);
    const allDataCorrect = ref(false);
    const fileName = ref("");
    const dataList = ref([[]]);
    const bodyStyle = {
      "max-height":"600px",
      "overflow-y":"auto"
    }
    const showModal = () => {
      visible.value = true;
      isLoading.value = true;
      dataList.value = [[]];
      fileName.value = "";
    };

    const handleOk = e => {
      if(allDataCorrect.value){
        visible.value = false;
        ctx.emit('emitExcelIn',fileName.value)
      }else{
        message.error("存在错误数据，不可导入!")
      }
    };

    const showDataTable = function (res) {
      dataList.value = res.dataList
      isLoading.value = false;
      fileName.value = res.saveFileName;
      allDataCorrect.value = res.allDataCorrect;
    }

    const hiddenModel = function (){
      visible.value = false;
    }
    return {
      visible,
      isLoading,
      showModal,
      handleOk,
      showDataTable,
      dataList,
      hiddenModel,
      allDataCorrect,
      bodyStyle
    };
  }
}
</script>
<style lang="scss" scoped>
.loading {
  display: flex;
  justify-content: center;
}

#dataTableContent {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td, th {
  border: 1px solid #ddd;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}

tr:hover {
  background-color: #ddd;
}

th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #4CAF50;
  color: white;
}
</style>