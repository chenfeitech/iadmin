<template>
  <div><span class="title pl-4 ">{{count}}</span> 条数据
    <hr  class="divider">
  </div>
</template>

<script>
export default {
  name: "data-count-row",
  props:{
    count:{
      type:Number,
      default:0,
    }
  }
}
</script>

<style scoped>
.title{
  font-size:1.2rem;
  font-weight:500;
  /*line-height: 2rem;*/
  letter-spacing:0.0125em;
  font-family:"Roboto", sans-serif;
  padding-left: 10px;
}
.divider{
  flex:1 1 0px;
  height:0;
  border: 0 solid rgba(0, 0, 0, 0.09);
  border-top-width: thin;
  margin-bottom: 2px;
}
</style>
