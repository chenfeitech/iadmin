import {loginApi} from "@/views/system/login/api/api";
import router from "@/router";
import {message} from "ant-design-vue";
import {baseApi} from "../../api/base-api";
import {encrypt, RSAEncrypt} from "../../util/crypt";
import _ from "lodash";

export default {
    namespaced:true,
    state:{
        /* 记录当前用户信息 */
        user:{},
        token:'',
    },
    mutations:{
        clearAll(state){
            state.user = []
            state.token = ''
        },
        setUser(state,res){
            state.user = res.user
            state.token = res.token
        },
        setUserInfo(state,user){
            state.user = user
        },
        setMenus(state,menus){
          state.menus = menus
        },
        setRoutes(state, routes) {
            state.routes = routes
        },

    },
    actions:{
        async login({commit, dispatch, rootGetters, getters}, loginForm) {
            // 深复制一份，要不然直接改变loginForm页面上的数字也会变
            const loginData = _.cloneDeep(loginForm)
            await baseApi.getRSAKey().then(async (res) => {
                const publicKey = res.data.publicKey
                loginData.password = RSAEncrypt(publicKey, loginForm.password)
                loginData.redisKey = res.data.redisKey
                return await loginApi.login(loginData).then(async (res) => {
                    commit('setUser', res.data)
                    await dispatch('router/SetAsyncRouter', {}, {root: true})
                    router.push({path: res.data.user.role.default_router})
                    return true
                }).catch((err) => {
                    return false
                })
            })
        },
        async logout({commit}) {
            commit('clearAll')
            commit('router/clearAll',null,{root:true})
            commit('tabs/clearAll',null,{root:true})
            localStorage.clear()
            router.push({name: 'login'})
        }
    },
    getters: {
        // 获取动态路由
        token(state) {
            return state.token?state.token:undefined
        },
        user(state) {
            return state.user?state.user:undefined
        },
        userRealName(state){
            return state.user?state.user.real_name:undefined
        },
        userRoleName(state){
            return state.user.role? state.user.role.name:''
        },
        userId(state){
            return state.user? state.user.id:undefined
        },
        defaultRouter(state){
            return state.user? state.user.role.default_router:undefined
        },
        userPhone(state){
            return state.user?state.user.phone:undefined
        }
    }
}
