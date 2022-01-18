<template>
  <a-range-picker v-model:value="value" :ranges="ranges" @change="changeDate" valueFormat="YYYY-MM-DD"/>
</template>

<script>
import {ref, toRef, reactive, watch} from "vue";
import moment from "moment";

export default {
  name: "i-date-picker",
  props:{
    pikerDate:Array
  },
  setup(props,ctx){
    const value = ref(props.pikerDate)
    const ranges = {
      // '今天': [moment(), moment().add(1,'day')],
      '今天': [moment(), moment()],
      '近7天': [moment().day(-7),moment()],
      '近一个月': [moment().day(-30), moment()],
      '近三个月': [moment().day(-90), moment()],
      '近一年': [moment().day(-365), moment()],
    }
    const changeDate = function (){
      const list = [];
      list.push(moment(value.value[0],'YYYY-MM-DD').valueOf())
      list.push(moment(value.value[1],'YYYY-MM-DD').valueOf())
      ctx.emit("update:pikerDate",list)
    }
    const initValue = function (){
      value.value = []
      ctx.emit("update:pikerDate",[])
    }
    return{
      value,
      ranges,
      changeDate,
      initValue
    }
  }
}
</script>

<style scoped>

</style>