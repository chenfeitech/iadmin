<template>
  <div class="bg">
    <div class="center-content">
      <div class="register-bg">
        <div class="title">iAdmin</div>
        <div class="form-content">
          <a-form :model="registerForm">
            <a-form-item>
              <a-input v-model:value="registerForm.phone" placeholder="手机号">
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input v-model:value="registerForm.realName" placeholder="真实姓名">
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input v-model:value="registerForm.password" type="password" placeholder="密码">
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input v-model:value="registerForm.passwordCheck" type="password" placeholder="确认密码">
              </a-input>
            </a-form-item>
          </a-form>
        </div>
        <div class="code-row">
          <a-input v-model:value="registerForm.captcha" placeholder="验证码" @keyup.enter.native="register" style="height: 50px;  border-radius: 8px;">
          </a-input>
          <a-image
              :preview="false"
              @click="getCode"
              :src="codeImgSrc"
              style="height: 50px;width: 110px;border-radius: 8px;"
          ></a-image>
        </div>

          <a-button class="register-btn"
                    :loading="loadingRegister"
                    @click="register"
                    type="primary">
            注册
          </a-button>
        <div style="height: 10px"></div>
        <a-button type="link" @click="goToLogin">返回登录</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent, onMounted, reactive, ref} from "vue";
import {loginApi} from "./api/api";
import {useRouter} from "vue-router"
import {message} from "ant-design-vue";
import {isPhone} from "../../../util/function";
import {baseApi} from "../../../api/base-api";
import {RSAEncrypt} from "../../../util/crypt";
import _ from "lodash";
export default defineComponent({
  name: "register",
  setup(){
    const router = useRouter()
    const number = ref(1)
    const registerForm = reactive({
      phone:'',
      realName:'',
      password:'',
      passwordCheck:'',
      captcha:'',
      captchaId:'',
    })
    const codeImgSrc = ref('')
    const loadingRegister = ref(false)
    const getCode = async function (){
      let res = await loginApi.getCode();
      codeImgSrc.value = res.data.picPath;
      registerForm.captchaId = res.data.captchaId;
    }
    const register = async function (){
      loadingRegister.value = true;
      if(!validate()){
        loadingRegister.value = false;
        return
      }
      await baseApi.getRSAKey().then(async (res) => {
        // 深复制一份，要不然直接改变loginForm页面上的数字也会变
        const registerData = _.cloneDeep(registerForm)
        const publicKey = res.data.publicKey
        registerData.password = RSAEncrypt(publicKey, registerForm.password)
        registerData.passwordCheck = RSAEncrypt(publicKey, registerForm.passwordCheck)
        registerData.redisKey = res.data.redisKey
        await loginApi.register(registerData).then((res) => {
          loadingRegister.value = false;
          message.loading({content: '即将跳转登录页面', key: 'msg'});
          setTimeout(async () => {
            message.success({content: '跳转成功', key: 'msg'});
            await router.push({path: '/login'})
          }, 1000);
        },function (err){
          loadingRegister.value = false;
          getCode();
        })
      })

    }
    const validate = function (){
      if(!isPhone(registerForm.phone)){
        message.error('手机号格式不正确，请重新输入！')
        return false
      }
      if(registerForm.passwordCheck!==registerForm.password){
        message.error('两次密码输入不一致，请重新输入！')
        return false
      }
      return true
    }
    const goToLogin = function (){
      router.push({name:'login'})
    }
    onMounted(()=>{
      getCode();
    })
    return{
      number,
      codeImgSrc,
      registerForm,
      register,
      getCode,
      goToLogin,
      loadingRegister
    }
  }
})
</script>

<style scoped>
.bg {
  width: 100%;
  height: 100%;
  /*background-color: #f0f2f5;*/
  /*background: #654ea3;  !* fallback for old browsers *!*/
  /*background: -webkit-linear-gradient(to right, #eaafc8, #654ea3);  !* Chrome 10-25, Safari 5.1-6 *!*/
  /*background: linear-gradient(to right, #eaafc8, #654ea3); !* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ *!*/
  /*background: #D3CCE3;  !* fallback for old browsers *!*/
  /*background: -webkit-linear-gradient(to right, #E9E4F0, #D3CCE3);  !* Chrome 10-25, Safari 5.1-6 *!*/
  /*background: linear-gradient(to right, #E9E4F0, #D3CCE3); !* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ *!*/
  background: #E0EAFC;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to left, #CFDEF3, #E0EAFC);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to left, #CFDEF3, #E0EAFC); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

}
.center-content {
  background-color: white;
  width: 396px;
  height: 570px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .1), 0 8px 16px rgba(0, 0, 0, .1);
}
.register-bg{
  /*background-color: ;*/
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.title {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
}

/deep/ .ant-input{
  width: 300px;
  height: 50px;
  border-radius: 8px;
}
.register-btn {
  width: 300px;
  margin-top: 20px;
  height: 40px;
  border-radius: 8px;
  font-size: 16px;
}
.code-row {
  display: flex;
  width: 300px;
}

</style>
