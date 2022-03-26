import { createApp } from 'vue'
import App from './App.vue'
import Maska from 'maska'
import 'bulma/css/bulma.css'

const app = createApp(App)

app.use(Maska)

app.mount('#app')
