import router from "@/router";
import {isObjectValueEqual} from '@/util/function'
export default {
    namespaced:true,
    state:{
        /* 记录标签页数组 */
        tabs: [],
        /* 记录当前标签页 */
        currentTabKey: 1,
    },
    mutations:{
        clearAll(state){
           state.tabs = [];
           state.currentTabKey = 1;
        },

        changeTab(state,targetKey){
            state.currentTabKey = targetKey
        },

        openPage(state, { name, params, query, fullPath, meta }){
            for(let i=0; i<state.tabs.length; i++){
                if(state.tabs[i].name === name && isObjectValueEqual(params,state.tabs[i].params) && isObjectValueEqual(query,state.tabs[i].query)){
                    state.currentTabKey = state.tabs[i].key
                    return
                }
            }
            //  新建一个Tab
            const new_tab = {
                title:meta.title?meta.title:'未命名页面',
                key:state.tabs.length+1,
                path:fullPath,
                params:params,
                query:query,
                name:name,
                meta:meta,
            }
            state.tabs.push(new_tab)
            state.currentTabKey = new_tab.key
        },

    },
    actions:{
        initTab({state,rootGetters}){
            state.currentTabKey = 1
            router.push({path:rootGetters["user/defaultRouter"]})
        },
        removeTab({commit, dispatch, rootGetters, state},targetKey){
            state.tabs = state.tabs.filter(pane => pane.key !== targetKey);
            state.currentTabKey = targetKey-1>0?targetKey-1:1;
            if(state.tabs.length===0){
                dispatch('initTab')
            }else{
                router.push(state.tabs[state.currentTabKey-1])
            }
        },
        closeAll({commit, dispatch, rootGetters, state}){
            state.tabs = state.tabs.filter(pane => pane.path === rootGetters["user/defaultRouter"]);
            dispatch('initTab')
        },
    },
    getters:{
        tabs(state){
            return state.tabs
        },
        currentTabKey(state){
            return state.currentTabKey
        },
    }
}
