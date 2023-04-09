import { createApp } from 'vue'
import "./css/style.sass"
import App from './App.vue'
import 'virtual:windi.css'
import 'ant-design-vue/dist/antd.dark.css';


createApp(App)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
