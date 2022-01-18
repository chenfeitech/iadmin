<template>
  <div class="i-container-full">
<!--    <div v-if="$slots.header" class="i-container-full__header" ref="header">-->
<!--      <slot name="header"/>-->
<!--    </div>-->
<!--    <div v-else class="i-container-full__header" ref="header">-->
<!--      {{ $route.meta.title }}-->
<!--    </div>-->
    <div class="i-container-full__body">
      <div class="i-container-full__body-full"></div>
      <slot/>
    </div>
<!--    <div v-if="$slots.footer" class="i-container-full__footer" ref="footer">-->
<!--      <slot name="footer"/>-->
<!--    </div>-->
<!--    <div v-else class="i-container-full__footer" ref="footer">-->
<!--      @iadmin 1.1.0 version-->
<!--    </div>-->
  </div>
</template>

<script>
export default {
  name: "i-container-full"
}
</script>

<style scoped>
.i-container-full {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.i-container-full__body {
  padding: 10px;
  position: relative;
  flex-grow: 1;
  overflow: auto;
  /*background-color: #f0f2f5;*/
}

.i-container-full__body-full {
  position: relative;
  /*margin-left: 10px;*/
  /*margin-right: 10px;*/
}

.i-container-full__header {
  width: 100%;
  height: 45px;
  /*background: linear-gradient(#f2f2f2,#f2f2f2);*/
  border-bottom: 1px solid #f2f2f2;
  /*box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.02);*/
  line-height: 45px;
  padding-left: 10px;
  /*font-weight: bold;*/
  font-size: 16px;
  color: rgba(0, 0, 0, 0.38);
}

.i-container-full__footer {
  padding: 10px 25px 10px 10px;
  width: 100%;
  border-top: 1px solid #f2f2f2;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.02);
  font-size: 0.75rem !important;
  text-align: right;
  font-weight: 300 !important;
  color: rgba(0, 0, 0, 0.87);
  letter-spacing: 0.0333333333em !important;
  line-height: 1.25rem;
}
</style>