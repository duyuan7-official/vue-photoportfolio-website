import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import PortraitsView from '../views/PortraitsView.vue'
import DocumentaryView from '../views/DocumentaryView.vue'
import AlbumsView from '../views/AlbumsView.vue'
import BlogView from '../views/BlogView.vue'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/about', name: 'About', component: AboutView },
  { path: '/portraits', name: 'Portraits', component: PortraitsView },
  { path: '/documentary', name: 'Documentary', component: DocumentaryView },
  { path: '/albums', name: 'Albums', component: AlbumsView },
  { path: '/blog', name: 'Blog', component: BlogView },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router