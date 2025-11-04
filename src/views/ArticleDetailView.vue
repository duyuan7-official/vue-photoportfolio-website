<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import axios from 'axios'
import { marked } from 'marked' 

const STRAPI_URL = 'http://8.137.176.118:1337' // 确保这是你的正确 IP
const route = useRoute()

// --- 1. (更新) 定义 "Recent Post" 接口 ---
interface Post {
  id: number
  title: string
  content: string
  coverImageUrl: string
  author: string
  date: string
  read_time_minutes: number
  updatedAt: string // (新)
}
interface RecentPost {
  id: number
  title: string
  slug: string
  coverImageUrl: string
}

const post = ref<Post | null>(null)
const recentPosts = ref<RecentPost[]>([]) // (新)
const isLoading = ref(true)

// --- 2. (更新) 创建一个函数来获取数据 ---
async function fetchArticle(slug: string) {
  isLoading.value = true
  post.value = null // 清空旧数据
  recentPosts.value = [] // 清空旧数据

  try {
    // --- (请求 1: 获取当前文章) ---
    const response = await axios.get(`${STRAPI_URL}/api/articles`, {
      params: {
        'filters[slug][$eq]': slug,
        'populate': 'cover_image' // (保持简单)
      }
    })

    const dataArray = response.data.data
    if (!dataArray || dataArray.length === 0) throw new Error('未找到该文章')
    
    const item = dataArray[0]
    post.value = {
      id: item.id,
      title: item.title,
      content: item.content,
      coverImageUrl: item.cover_image ? `${STRAPI_URL}${item.cover_image.url}` : '',
      author: item.author,
      date: new Date(item.publishedAt).toLocaleDateString('zh-CN', { 
          year: 'numeric', month: 'long', day: 'numeric' 
      }),
      read_time_minutes: item.read_time_minutes,
      updatedAt: new Date(item.updatedAt).toLocaleDateString('zh-CN'), // (新)
    }

    // --- (请求 2: 获取最新文章) ---
    const recentResponse = await axios.get(`${STRAPI_URL}/api/articles`, {
      params: {
        'populate': 'cover_image',
        'filters[slug][$ne]': slug, // (关键: 排除当前文章)
        'pagination[limit]': 3,
        'sort': 'publishedAt:desc' // (获取最新的)
      }
    })
    
    const recentDataArray = recentResponse.data.data || []
    recentPosts.value = recentDataArray.map((item: any) => {
      if (!item.cover_image || !item.cover_image.url || !item.title) return null
      return {
        id: item.id,
        title: item.title,
        slug: item.slug,
        coverImageUrl: `${STRAPI_URL}${item.cover_image.url}`
      }
    }).filter((item: RecentPost | null) => item !== null)

  } catch (error: any) {
    console.error('从 Strapi 获取文章详情失败:', error);
    if (error.response && error.response.data && error.response.data.error) {
      console.error("Strapi 错误详情:", error.response.data.error);
    }
  } finally {
    isLoading.value = false
  }
}

// (Markdown 转换 - 不变)
const renderedContent = computed(() => {
  if (post.value && post.value.content) {
    return marked(post.value.content)
  }
  return ''
})

// --- 3. (新增) 监听路由变化 ---
// (当用户从一篇 "Recent Post" 点击到另一篇时, 重新获取数据)
watch(() => route.params.slug, (newSlug) => {
  if (newSlug) {
    fetchArticle(newSlug as string)
  }
}, { immediate: true }) // "immediate: true" 确保组件第一次加载时就运行

</script>

<template>
  <div class="pt-48 px-8 pb-24 text-white max-w-5xl mx-auto">
    
    <div v-if="isLoading" class="text-center text-gray-400">
      加载中...
    </div>

    <article v-if="post">
      
      <header class="mb-8">
        <div class="text-gray-400 text-sm flex items-center space-x-2">
          <span v-if="post.date">{{ post.date }}</span>
          <span v-if="post.date && post.read_time_minutes" class="mx-1">•</span>
          <span v-if="post.read_time_minutes">{{ post.read_time_minutes }} 分钟阅读</span>
        </div>
        
        <h1 class="text-4xl md:text-5xl font-bold text-left my-4">
          {{ post.title }}
        </h1>
        
        <div class="text-gray-500 text-sm">
          已更新: {{ post.updatedAt }}
        </div>
      </header>

      <div 
        v-html="renderedContent"
        class="prose prose-invert prose-lg max-w-3xl border-b mx-auto"
      ></div>

      <div class="flex space-x-4 py-8 border-b border-gray-700">
        <a href="#" class="text-gray-400 hover:text-white" title="分享到 Facebook">
          <font-awesome-icon :icon="['fab', 'facebook']" class="h-5 w-5" />
        </a>
        <a href="#" class="text-gray-400 hover:text-white" title="分享到 Twitter">
          <font-awesome-icon :icon="['fab', 'twitter']" class="h-5 w-5" />
        </a>
        <a href="#" class="text-gray-400 hover:text-white" title="分享到 LinkedIn">
          <font-awesome-icon :icon="['fab', 'linkedin']" class="h-5 w-5" />
        </a>
        <a href="#" class="text-gray-400 hover:text-white" title="复制链接">
          <font-awesome-icon :icon="['fas', 'link']" class="h-5 w-5" />
        </a>
      </div>

      <section class="mt-12" v-if="recentPosts.length > 0">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold">最新文章</h2>
          <RouterLink to="/article" class="text-sm text-gray-400 hover:text-white">
            查看全部
          </RouterLink>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RouterLink 
            v-for="recent in recentPosts" 
            :key="recent.id"
            :to="{ name: 'ArticleDetail', params: { slug: recent.slug } }"
            class="block group"
          >
            <div class="aspect-video overflow-hidden">
              <img 
                :src="recent.coverImageUrl" 
                :alt="recent.title" 
                class="w-full h-full object-cover 
                       transition-transform duration-500 ease-in-out group-hover:scale-105"
              />
            </div>
            <h3 class="mt-3 text-lg font-semibold group-hover:text-gray-300">{{ recent.title }}</h3>
          </RouterLink>
        </div>
      </section>

      <section class="mt-12">
        <h2 class="text-2xl font-semibold mb-6">留言</h2>
        <div class="text-center text-gray-500 border border-gray-700 rounded-lg p-12">
          <p>无法载入留言</p>
          <p class="text-sm mt-2">似乎有技术问题。请刷新页面重试。</p>
        </div>
      </section>

    </article>
  </div>
</template>

<style>
/* (样式 - 不变) */
.prose a {
  color: #fff;
  text-decoration: underline;
}
.prose a:hover {
  color: #ccc;
}
</style>