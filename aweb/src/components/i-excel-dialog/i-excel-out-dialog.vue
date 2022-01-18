<template>
  <div>
    <a-modal v-model:visible="visible" title="批量导出" @ok="handleOk">
      <div class="item">
        <span>是否导出表头？</span><a-switch v-model:checked="hasTableHead" />
      </div>
      <div class="item">
        <span>是否导出全部数据？</span><a-switch v-model:checked="hasAllData" />
      </div>
    </a-modal>
  </div>
</template>

<script>
// 批量导出的弹框
import {reactive, ref, toRefs} from "vue";

export default {
  name: "i-excel-out-dialog",
  setup(props,ctx){
    const visible = ref(false);
    const excelOutConfig = reactive({
      // 是否导出表头
      hasTableHead: true,
      // 是否导出数据
      hasAllData: false,
    });
    const showModal = () => {
      visible.value = true;
    };

    const handleOk = e => {
      visible.value = false;
      ctx.emit('emitExcelOut',excelOutConfig)
    };
    return{
      visible,
      showModal,
      handleOk,
      ...toRefs(excelOutConfig)
    }
  }
}
</script>

<style scoped>
.item{
  height: 40px;
  display: flex;
  align-items: center;
}
</style>