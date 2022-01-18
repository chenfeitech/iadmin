import {loginApi} from "@/views/system/login/api/api";
import Router from "@/router"
import {nextTick} from "vue";

const centerRouter = {
      path: '/center',
      name: 'center',
      meta: {
        title: '个人中心',
        auth: true,
        keep_alive:true,
      },
      component: () => import('@/views/system/person-center/index')
}
const errorRouters = [
    {
        path: '/404',
        name: '404',
        meta: {
            title: '迷路了*。*',
            auth: true,
        },
        component: () => import('@/views/error/404')
    }
]
export default {
    namespaced: true,
    state: {
        asyncRoutersIn: [],
        asyncRoutersOut: [],
        asyncMenus: [],
        // 记录当前菜单选择项，防止刷新重置
        activeMenuSelect: [],
        // 记录当前菜单展开项，防止刷新重置
        activeMenuOpen: [],
        // 记录当前菜单面包屑
        menuCrumbs: [],
    },
    mutations: {
        clearAll(state) {
            state.asyncRoutersIn = [];
            state.asyncRoutersOut = [];
            state.asyncMenus = [];
            state.activeMenuSelect = [];
            state.activeMenuOpen = [];
            state.menuCrumbs = [];
        },
        // 设置框架内的动态路由
        setAsyncRouterIn(state, asyncRouters) {
            state.asyncRoutersIn = asyncRouters
        },
        // 设置框架外的动态路由
        setAsyncRouterOut(state, asyncRouters) {
            state.asyncRoutersOut = asyncRouters
        },
        // 设置菜单
        setAsyncMenus(state, asyncMenus) {
            state.asyncMenus = asyncMenus
        },
        setActiveMenuSelect(state, activeMenu) {
            state.activeMenuSelect[0] = activeMenu;
        },
        setActiveMenuOpen(state, openMenu) {
            state.activeMenuOpen = openMenu;
        },
        addActiveMenuOpen(state, addMenu) {
            if (!state.activeMenuOpen.some(value => {
                return value === addMenu[0]
            })) {
                state.activeMenuOpen.push(addMenu[0])
            }
        },
        setMenuCrumbs(state, menuCrumbs) {
            state.menuCrumbs = menuCrumbs;
        }
    },
    actions: {
        // 从后台获取动态路由
        async SetAsyncRouter({commit}) {
            const asyncRouterRes = await loginApi.getSysMenuByToken();
            const routers = asyncRouterRes.data.routes
            const asyncMenus = asyncRouterRes.data.menus
            commit('setAsyncMenus', asyncMenus)
            const asyncRoutersIn = []
            const asyncRoutersOut = []
            if (routers == null)
                return true
            routers.forEach(item => {
                if (item.path === '')
                    return
                let json = {
                    path: `${item.path}`,
                    name: item.name,
                    meta: {
                        title: item.title,
                        keep_alive: item.keep_alive,
                    },
                    component: () => import(`@/${item.Component}`)
                }
                if (item.full_page)
                    asyncRoutersOut.push(json)
                else
                    asyncRoutersIn.push(json)
            })
            commit('setAsyncRouterIn', asyncRoutersIn)
            commit('setAsyncRouterOut', asyncRoutersOut)
            asyncRoutersIn.forEach(item => {
                Router.addRoute("Layout", item)
            })
            asyncRoutersOut.forEach(item => {
                Router.addRoute(item)
            })
            // 将错误页面路由加入框架里
            errorRouters.forEach(item => {
                Router.addRoute("Layout", item)
            })
            // 将个人中心页面路径加入跨界里
            Router.addRoute("Layout",centerRouter)
            Router.push(Router.currentRoute.value.fullPath)
            return true
        }
    },
    getters: {
        // 获取动态路由
        asyncRoutersIn(state) {
            return state.asyncRoutersIn
        },
        asyncRoutersOut(state) {
            return state.asyncRoutersOut
        },
        asyncMenus(state) {
            return state.asyncMenus
        },
        activeMenuSelect(state) {
            return state.activeMenuSelect
        },
        activeMenuOpen(state) {
            return state.activeMenuOpen
        },
        menuCrumbs(state) {
            return state.menuCrumbs
        }
    }
}
