<template>
  <div class="user-name-content">
    <a-tag color="#1e3c72">
      <template #icon>
        <UserOutlined/>
      </template>
      <span>{{ userRoleName }}</span>
    </a-tag>
    <a-dropdown placement="bottomCenter">
      <span style="margin-left: 5px">{{ userName }}</span>
      <template #overlay>
        <a-menu style="width: 100px;right: 20px">
          <a-menu-item @click="goToCenter">
            <a>
              <UserSwitchOutlined style="margin-right: 5px"/>
              个人中心
            </a>
          </a-menu-item>
          <a-menu-item @click="logout">
            <a>
              <LoginOutlined style="margin-right: 5px"/>
              注销
            </a>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<script>
import {useStore} from "vuex"
import {computed} from "vue";
import {useRouter} from "vue-router"
export default {
  name: "i-header-user",
  components: {

  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const userName = computed(() => {
      return store.getters['user/userRealName']
    })
    const userRoleName = computed(() => {
      return store.getters['user/userRoleName']
    })
    const logout = function () {
      store.dispatch('user/logout')
    }
    const goToCenter = function (){
      router.push({name:'center'})
    }
    return {
      logout,
      userName,
      userRoleName,
      goToCenter
    }
  }
}
</script>

<style scoped>
.user-name-content {
  display: flex;
  line-height: 24px;
}

/deep/ .ant-tag {
  font-size: 14px;
  line-height: 24px;
}
</style>
