import { createApp } from 'vue'
import "./css/style.sass"
import App from './App.vue'
import 'virtual:windi.css'


createApp(App)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
