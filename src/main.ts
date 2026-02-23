import { createApp } from 'vue'
import App from './App.vue'
import router from './router'  // 這裡會自動解析 index.ts

const app = createApp(App)
app.use(router)
app.mount('#app')