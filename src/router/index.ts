import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import PortraitsView from '../views/PortraitsView.vue'
import LandscapeView from '../views/LandscapeView.vue'
import JourneyView from '../views/JourneyView.vue'
//import JourneyDetailView from '../views/JourneyDetailView.vue'
import BlogView from '../views/BlogView.vue'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/about', name: 'About', component: AboutView },
  { path: '/portraits', name: 'Portraits', component: PortraitsView },
  { path: '/landscape', name: 'Landscape', component: LandscapeView },
  { path: '/journey', name: 'Journey', component: JourneyView },
  //{ 
  //  path: '/journey/:slug',
  //  name: 'JourneyDetail',
  //  component: JourneyDetailView
  //},
  { path: '/blog', name: 'Blog', component: BlogView },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router