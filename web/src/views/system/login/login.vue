<template>
  <div class="bg">
    <div class="center-content">
      <div class="login-bg">
        <div class="title">iAdmin</div>
        <div class="form-content">
          <a-form :model="loginForm">
            <a-form-item >
              <a-input v-model:value="loginForm.phone" placeholder="手机号" >
                <template #prefix>
                  <PhoneOutlined style="color: rgba(0, 0, 0, 0.25)"/>
                </template>
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input v-model:value="loginForm.password" type="password" placeholder="密码">
                <template #prefix>
                  <LockOutlined style="color: rgba(0, 0, 0, 0.25)"/>
                </template>
              </a-input>
            </a-form-item>
          </a-form>
        </div>
        <div class="code-row">
          <a-input v-model:value="loginForm.captcha" placeholder="验证码" @keyup.enter.native="login" style="height: 50px;  border-radius: 8px;">
            <template #prefix>
              <CodeOutlined style="color: rgba(0, 0, 0, 0.25)"/>
            </template>
          </a-input>
          <a-image
              :preview="false"
              @click="getCode"
              style="height: 50px;width: 110px;border-radius: 8px;"
              :src="codeImgSrc"
          ></a-image>
        </div>
        <a-button class="login-btn"
                  :loading="loadingLogin"
                  @click="login"
                  type="primary">
          登录
        </a-button>
        <div style="height: 10px"></div>
        <a-button type="link" @click="goToRegister">注册</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent, onMounted, reactive, ref} from "vue";
import {loginApi} from "./api/api";
import {useStore} from "vuex";
import {useRouter} from "vue-router"

export default defineComponent({
  name: "login",
  setup(props, ctx) {
    const store = useStore() //this.$store
    const router = useRouter()
    const loadingLogin = ref(false);
    const loginForm = reactive({
      phone: '',
      password: '',
      captcha: '',
      captchaId: '',
    })
    const codeImgSrc = ref('')
    const getCode = async function () {
      await loginApi.getCode().then((res)=>{
        codeImgSrc.value = res.data.picPath;
        loginForm.captchaId = res.data.captchaId;
      });
    }
    const login = async function () {
      loadingLogin.value = true;
      let res = await store.dispatch('user/login', loginForm)
      if(!res){
        await getCode();
      }
      loadingLogin.value = false;
    }
    const goToRegister = function () {
      router.push({path: '/register'})
    }
    onMounted(() => {
      getCode();
    })
    return {
      codeImgSrc,
      loginForm,
      login,
      goToRegister,
      getCode,
      loadingLogin
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
  height: 470px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .1), 0 8px 16px rgba(0, 0, 0, .1);
}

.login-bg {
  /*background-color: ;*/
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
/deep/ .ant-input-affix-wrapper{
  width: 300px;
  height: 50px;
  font-size: 20px;
  border-radius: 8px;
}
.title {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
}

.login-btn {
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
