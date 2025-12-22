import { createApp } from 'vue'

import App from './App.vue'
import * as i18n from './i18n'
import router from './router'
import './styles/main.css'
import 'uno.css'

const app = createApp(App)

app.use(router) // use router
app.use(i18n) // use i18n
app.mount('#app')
