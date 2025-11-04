import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faXTwitter,faWeixin,faQq,faTelegram,faFacebook,faLinkedin} from '@fortawesome/free-brands-svg-icons'
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons' 
import { faDownload,faShare,faHeart as faHeartSolid, faLink } from '@fortawesome/free-solid-svg-icons'

library.add(faXTwitter,faWeixin,faQq,faFacebook,faLinkedin,faTelegram,faHeartRegular,faDownload,faShare,faLink,faHeartSolid)

const app = createApp(App)

app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
