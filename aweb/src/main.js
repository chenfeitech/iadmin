import { createApp } from 'vue/dist/vue.esm-bundler'
import App from './App.vue'
import router from './router'
import store from './store'

import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' //这个样式必须引入
/* ant for vue 2.0 */
import Antd, {notification} from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import { message } from 'ant-design-vue';
import * as Icons from "@ant-design/icons-vue";
message.config({
    maxCount: 3,
    duration: 2
})
const app = createApp(App);
app.config.productionTip = false;
app.config.globalProperties.$message = message;
app.use(Antd)
app.use(NProgress)
for(const i in Icons){
    app.component(i,Icons[i])
}
app.use(store).use(router).mount('#app')
