import {createStore} from 'vuex'
import VuexPersistence from 'vuex-persist'
import tabs from "./module/tabs";
import user from "./module/user";
import router from "./module/router"
const vuexLocal = new VuexPersistence({
    storage: window.localStorage,
    modules: ['user','tabs','router']
})

export default createStore({
    modules: {
        tabs,
        user,
        router,
    },
    plugins:[vuexLocal.plugin]
})
