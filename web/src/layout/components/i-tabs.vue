<template>
  <div class="i-tabs__container">
    <a-tabs v-model:activeKey="activeKey" type="editable-card" @edit="onEdit" @change="changeTab" hide-add style="margin-bottom: -20px">
      <a-tab-pane v-for="pane in tabList" :key="pane.key" :tab="pane.title">
        {{ pane.content }}
      </a-tab-pane>
    </a-tabs>
    <div>
      <div class="btn" @click="closeAll">
        <CloseCircleOutlined style="margin-right: 5px;"/>
          关闭所有
        </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from 'vue-router'
import {
  CloseCircleOutlined
}from '@ant-design/icons-vue';
import {ref, watch, inject, getCurrentInstance, reactive, toRefs, computed} from 'vue'


export default {
  name: "i-tabs",
  components:{
    CloseCircleOutlined,
  },

  setup(){
    const store = useStore()
    const router = useRouter()
    const tabList = computed(()=>{
      return store.getters["tabs/tabs"]
    })
    const activeKey = computed(()=>{
      return store.getters["tabs/currentTabKey"]
    })
    const changeTab = function (targetKey){
      store.commit('tabs/changeTab',targetKey)
      for(let i=0; i<tabList.value.length; i++){
        let tab = tabList.value[i];
        if(tab.key === targetKey){
          router.push({path:tab.path,params:tab.params,query:tab.query})
          return
        }
      }
    }
    const onEdit = function (targetKey){
      store.dispatch('tabs/removeTab',targetKey)
    }
    const closeAll = function (){
      store.dispatch('tabs/closeAll')
    }
    return{
      activeKey,tabList,changeTab,closeAll,onEdit
    }
  },
}
</script>

<style scoped>
.i-tabs__container{
  background-color: white;
  height: 45px;
  border-bottom: 1px solid rgba(0,0,0,0.06);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

}
.btn{
  border: 1px solid rgba(0,0,0,0.1);
  border-bottom: none;
  cursor: pointer;
  height: 40px;
  width: 110px;
  text-align: center;
  line-height: 40px;
  padding:0 10px 0 10px;
  margin-right: 20px;
  margin-top: 4px;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
}
.btn:active{
  color: #1890ff;
}
/deep/ .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab{
  background-color: rgba(0,0,0,.02);
  margin-right: 0;
}
/deep/ .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab-active{
  background-color:rgba(64,158,255,.08);
  border-bottom: 1px solid rgba(0,0,0,0.01);

}
</style>
