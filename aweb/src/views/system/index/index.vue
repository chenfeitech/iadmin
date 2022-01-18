<template>
  <i-container-full>
    <div class="container">
      <div style="height: 30px"></div>
      <a-typography-title :level="3">iAdmin</a-typography-title>
      <a-typography-title :level="3">Thanks you~</a-typography-title>
      <div style="height: 100px"></div>
    </div>
  </i-container-full>
</template>

<script>
import IContainerFull from "../../../components/i-container/i-container-full";
import {defineComponent} from "vue";
export default defineComponent({
  name: "index",
  components: {IContainerFull}
})
</script>

<style scoped>
.container{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
