<template>
  <div class="card-bg">
    <div class="card-title-bg">
      {{ title }}
    </div>
    <div class="card-content-bg">
      <slot/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'cardCom',
  props: {
    title: ''
  }
}
</script>

<style scoped>
.card-bg{
  background-color: white;
  width: 100%;
  margin-top: 30px;
  margin-bottom: 50px;
}
.card-title-bg{
  position: relative;
  top: -20px;
  left: 20px;
  background: #1e3c72;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to bottom, #2a5298, #1e3c72);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to bottom, #2a5298, #1e3c72); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  border-color:#2c74f2 ;
  color:#fff;
  height:35px;
  border-radius:4px;
  text-align: center;
  line-height: 35px;
  /* 宽度自适应 */
  width: auto;
  display: inline-block;
  padding: 0 15px 0 15px;
  box-shadow:0px 6px 6px -3px rgb(0 0 0 / 20%), 0px 10px 14px 1px rgb(0 0 0 / 14%), 0px 4px 18px 3px rgb(0 0 0 / 12%);
}
.card-content-bg{
  padding: 0px 20px 20px 20px;
}
</style>
