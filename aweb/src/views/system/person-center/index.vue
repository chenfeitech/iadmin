<template>
  <i-container-full>
    <div class="center-content">
      <div class="left-content">
        <Icon :style="{ fontSize: '106px' }">
          <template #component="svgProps">
            <svg viewBox="0 0 1024 1024" width="5em" height="5em" fill="currentColor" v-bind="svgProps">
              <path
                  d="M99.096 315.634s-82.58-64.032-82.58-132.13c0-66.064 33.032-165.162 148.646-148.646 83.37 11.91 99.096 165.162 99.096 165.162l-165.162 115.614zM924.906 315.634s82.58-64.032 82.58-132.13c0-66.064-33.032-165.162-148.646-148.646-83.37 11.91-99.096 165.162-99.096 165.162l165.162 115.614z"
                  fill="#6B676E"
                  p-id="1143"
              />
              <path
                  d="M1024 561.548c0 264.526-229.23 429.42-512.002 429.42S0 826.076 0 561.548 283.96 66.064 512.002 66.064 1024 297.022 1024 561.548z"
                  fill="#FFEBD2"
                  p-id="1144"
              />
              <path
                  d="M330.324 842.126c0 82.096 81.34 148.646 181.678 148.646s181.678-66.55 181.678-148.646H330.324z"
                  fill="#E9D7C3"
                  p-id="1145"
              />
              <path
                  d="M644.13 611.098C594.582 528.516 561.55 512 512.002 512c-49.548 0-82.58 16.516-132.13 99.096-42.488 70.814-78.73 211.264-49.548 247.742 66.064 82.58 165.162 33.032 181.678 33.032 16.516 0 115.614 49.548 181.678-33.032 29.18-36.476-7.064-176.93-49.55-247.74z"
                  fill="#FFFFFF"
                  p-id="1146"
              />
              <path
                  d="M611.098 495.484c0-45.608 36.974-82.58 82.58-82.58 49.548 0 198.194 99.098 198.194 165.162s-79.934 144.904-148.646 99.096c-49.548-33.032-132.128-148.646-132.128-181.678zM412.904 495.484c0-45.608-36.974-82.58-82.58-82.58-49.548 0-198.194 99.098-198.194 165.162s79.934 144.904 148.646 99.096c49.548-33.032 132.128-148.646 132.128-181.678z"
                  fill="#6B676E"
                  p-id="1147"
              />
              <path
                  d="M512.002 726.622c-30.06 0-115.614 5.668-115.614 33.032 0 49.638 105.484 85.24 115.614 82.58 10.128 2.66 115.614-32.944 115.614-82.58-0.002-27.366-85.556-33.032-115.614-33.032z"
                  fill="#464655"
                  p-id="1148"
              />
              <path
                  d="M330.324 495.484m-33.032 0a33.032 33.032 0 1 0 66.064 0 33.032 33.032 0 1 0-66.064 0Z"
                  fill="#464655"
                  p-id="1149"
              />
              <path
                  d="M693.678 495.484m-33.032 0a33.032 33.032 0 1 0 66.064 0 33.032 33.032 0 1 0-66.064 0Z"
                  fill="#464655"
                  p-id="1150"
              />
            </svg>
          </template>
        </Icon>
      </div>
      <div class="right-content">
        <div class="title">基本信息</div>
        <div class="item">
          <div class="label">真实姓名</div>
          <a-input v-model:value="realName"/>
        </div>
        <div class="item">
          <div class="label">手机号</div>
          <a-input v-model:value="phone"/>
        </div>
        <div class="item">
          <div class="label">角色</div>
          <a-input disabled v-model:value="userRoleName"/>
        </div>
        <div style="height: 20px"></div>
        <a-button type="primary" style="float: right;" @click="updateBasicInfo">修改基本信息</a-button>
        <div style="height: 20px"></div>
        <a-divider  dashed />
        <div class="title">修改密码</div>
        <div class="item">
          <div class="label">旧密码</div>
          <a-input  type="password" v-model:value="oldPassword"/>
        </div>
        <div class="item">
          <div class="label">新密码</div>
          <a-input  type="password" v-model:value="newPassword"/>
        </div>
        <div class="item">
          <div class="label">重复新密码</div>
          <a-input  type="password" v-model:value="confirmPassword"/>
        </div>
        <div style="height: 20px"></div>
        <a-button type="primary" style="float: right" @click="updatePassword">确认修改</a-button>
        <div style="height: 20px"></div>
      </div>
    </div>
  </i-container-full>
</template>

<script>
import Icon from '@ant-design/icons-vue';
import IContainerFull from "@/components/i-container/i-container-full";
import {computed, reactive, toRefs} from "vue";
import {useStore} from "vuex";
import {centerApi} from "./api/api";
import {message} from "ant-design-vue";
import {baseApi} from "../../../api/base-api";
import _ from "lodash";
import {RSAEncrypt} from "../../../util/crypt";
export default {
  name: "index",
  components: {IContainerFull,Icon},
  setup(){
    const store = useStore()
    const basicInfo = reactive({
      realName:store.getters['user/userRealName'],
      phone:store.getters['user/userPhone']
    })
    const userRoleName = computed(()=>{
      return store.getters['user/userRoleName']
    })
    const passwordForm = reactive({
      oldPassword:'',
      newPassword:'',
      confirmPassword:'',
    })
    const updatePassword = async function () {
      await baseApi.getRSAKey().then(async (res) => {
        const passwordData = {}
        const publicKey = res.data.publicKey
        passwordData.oldPassword = RSAEncrypt(publicKey, passwordForm.oldPassword)
        passwordData.newPassword = RSAEncrypt(publicKey, passwordForm.newPassword)
        passwordData.confirmPassword = RSAEncrypt(publicKey, passwordForm.confirmPassword)
        passwordData.redisKey = res.data.redisKey
        await centerApi.updatePassword(passwordData).then((res) => {
          message.success(res.msg)
        })
      })

    }
    const updateBasicInfo = async function (){
      await centerApi.updateUserBasicInfo(basicInfo).then((res)=>{
        message.success(res.msg)
        store.commit('user/setUserInfo',res.data)
      })
    }
    return{
      ...toRefs(basicInfo),
      userRoleName,
      ...toRefs(passwordForm),
      updatePassword,
      updateBasicInfo
    }
  }
}
</script>

<style scoped>
.center-content{
  display: flex;
  /* 居中， 两边留白 */
  margin:0 auto;
  width: 70%;
  padding-top: 40px;
}
.left-content{
  width: 20%;
  display: flex;
  justify-content: center;
}
.right-content{
  width: 70%;
}
.title{
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 20px;
}
.item{
  display: flex;
  border: 1px solid #f0f0f0;
  width: 100%;
  height: 45px;
  line-height: 45px;
}
.label{
  background-color: #fafafa;
  width: 25%;
  color: rgba(0,0,0,.85);
  text-align: right;
  padding-right: 20px;
}

/deep/ .ant-input{
  border-radius: 0;
  border: 1px solid rgba(239, 241, 246, 0.5);
}
</style>