<template>
  <i-container-card>
    <a-form layout="vertical">
      <card title="日期时间段选择器">
        <a-form-item >
          <i-date-picker v-model:piker-date="date" ref="IDatePicker"></i-date-picker>
          <div class="inline-content">
            <div>【对应时间戳】{{date}}</div>
            <div style="width: 20px"></div>
            <a-button @click="initDatePicker">清空</a-button>
          </div>
        </a-form-item>
      </card>

      <card title="富文本编辑器">
        <a-form-item>
          <IRichEditor id="myEditor" ref="myEditor" v-model:value="richContent"></IRichEditor>
          <div class="inline-content">
            <div>【富文本值】{{richContent}}</div>
            <div style="width: 20px"></div>
            <a-button @click="initRichEditor">清空</a-button>
          </div>
          <div class="inline-content">
            <div v-html="richContent"></div>
          </div>
        </a-form-item>
      </card>

    </a-form>
  </i-container-card>
</template>

<script>
import {ref} from "vue";
import IDatePicker from "@/components/i-date-picker/i-date-picker";
import moment from "moment";
import IRichEditor from "@/components/i-rich-editor/i-rich-editor"
import IContainerCard from "../../../components/i-container/i-container-card";
import card from "@/components/i-card/i-card"
export default {
  name: "index",
  components: {IContainerCard, IRichEditor,IDatePicker,card},
  setup(){
    const date = ref([moment(),moment()]);
    const IDatePicker = ref();
    const initDatePicker = function (){
      IDatePicker.value.initValue();
    }
    const myEditor = ref();
    const richContent = ref('prop值')
    const initRichEditor = function (){
      myEditor.value.clear()
    }
    return{
      date,
      initDatePicker,
      IDatePicker,
      richContent,
      myEditor,
      initRichEditor
    }
  }
}
</script>

<style scoped>
.inline-content{
  display: flex;
  height: 30px;
  line-height: 30px;
  margin-top: 10px;
}
</style>