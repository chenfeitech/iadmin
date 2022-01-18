<template>
  <div id="app">
    <a-config-provider :locale="locale">
      <router-view/>
    </a-config-provider>
  </div>

</template>
<script>
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import {useStore} from 'vuex'
import {defineComponent, onBeforeMount, onMounted} from "vue";
export default defineComponent({
  setup(){
    const locale = zhCN
    return{
      locale
    }
  }

});
</script>
<style>
.data-table-btn-row{
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.query-btn-row{
  display: flex;
  flex-direction: row;
  margin-top: 20px;
}
/deep/ .ant-btn-primary{
  background-color:#1e3c72;
}
#app{
  width: 100%;
  height: 100%;
}
/*优化滚动条样式*/
::-webkit-scrollbar-track
{
  background: rgba(0,0,0,.1);
  border-radius: 5px;
}

::-webkit-scrollbar
{
  -webkit-appearance: none;
  width: 6px;
  height: 10px;
}

::-webkit-scrollbar-thumb
{
  cursor: pointer;
  border-radius: 5px;
  background: rgba(0,0,0,.10);
  transition: color .2s ease;
}
</style>
