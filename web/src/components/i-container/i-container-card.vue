<template>
  <div class="i-container-card">
    <template v-if="$slots.header" class="i-container-card__header" ref="header">
      <slot name="header"/>
    </template>
    <div v-else class="i-container-card__header" ref="header">
      {{$route.meta.title}}
    </div>
    <div class="i-container-card__body">
      <div class="i-container-card__body-card">
        <slot/>
      </div>
    </div>
    <template v-if="$slots.footer" class="i-container-card__footer" ref="footer">
      <slot name="footer"/>
    </template>
    <div v-else class="i-container-card__footer" ref="footer">
      @iAdmin {{version}} version
    </div>
  </div>
</template>

<script>
export default {
  name: "i-container-card",
  setup(){
    const version = process.env.VUE_APP_VERSION;
    return{
      version
    }
  }
}
</script>

<style scoped>
.i-container-card{
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.i-container-card__header{
  font-size: 16px;
  padding: 10px;
  color: rgba(0,0,0,0.38);
}
.i-container-card__body{
  position: relative;
  flex-grow: 1;
  overflow: auto;
}
.i-container-card__body-card{
  position: relative;
  margin-left: 10px;
  margin-right: 10px;
}
.i-container-card__footer{
  padding: 10px 15px 10px 10px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  font-size: 0.75rem !important;
  text-align: right;
  font-weight: 300 !important;
  color: rgba(0, 0, 0, 0.87);
  letter-spacing:0.0333333333em !important;
  line-height:1.25rem;
}
</style>
