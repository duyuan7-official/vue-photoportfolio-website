import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import PortraitsView from '../views/PortraitsView.vue'
import LandscapeView from '../views/LandscapeView.vue'
import JourneyView from '../views/JourneyView.vue'
//import JourneyDetailView from '../views/JourneyDetailView.vue'
import ArticleView from '../views/ArticleView.vue'
import ArticleDetailView from '@/views/ArticleDetailView.vue'


const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/about', name: 'About', component: AboutView, meta:{title:'About'} },
  { path: '/portraits', name: 'Portraits', component: PortraitsView, meta:{title:'Portraits'} },
  { path: '/landscape', name: 'Landscape', component: LandscapeView, meta:{title:'Landscape'} },
  { path: '/journey', name: 'Journey', component: JourneyView, meta:{title:'journey'} },
  //{ 
  //  path: '/journey/:slug',
  //  name: 'JourneyDetail',
  //  component: JourneyDetailView
  //},
  { path: '/article', name: 'Blog', component: ArticleView, meta:{title:'Articles'} },
  { 
    path: '/article/:slug',
    name: 'ArticleDetail',
    component: ArticleDetailView,
    
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  // 获取路由定义的 title，如果没有定义则使用默认标题
  const pageTitle = to.meta.title ? `${to.meta.title} | DuYuan's Photography` : "DuYuan's Photography"
  document.title = pageTitle as string
  next()
})

export default router