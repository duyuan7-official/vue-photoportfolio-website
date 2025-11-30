<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { RouterLink } from 'vue-router'
import axios from 'axios'
import { getArticles } from '@/api/contentService'

// 确保 IP 地址正确
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

interface ArticlePost {
  id: number
  title: string
  slug: string
  coverImageUrl: string
  snippet: string
  author: string
  authorHeadshotUrl: string
  read_time_minutes: number
  date: string
}

const posts = ref<ArticlePost[]>([])
const isLoading = ref(true)
const searchTerm = ref('')//搜索关键词
const isSearchActive = ref(false)//控制搜索栏显示与否

async function fetchArticles() {
  isLoading.value = true
  try{
  const response = await getArticles(searchTerm.value)
  const strapiData = response.data.data
    const dataArray = strapiData || []
    
    posts.value = dataArray.map((item: any) => {
      if (!item.cover_image || !item.cover_image.url || !item.title) return null
      const authorData = item.author || {}
      const authorName = authorData.username || 'Unknown' // 假设 User 表有 username 字段
      let authorHeadshotUrl = ''
      if (authorData.headshot && authorData.headshot.url) {
         // 如果你字段名叫 headshot
         authorHeadshotUrl = `${API_BASE_URL}${authorData.headshot.url}`
      }
      return {
        id: item.id,
        title: item.title,
        slug: item.slug,
        coverImageUrl: `${API_BASE_URL}${item.cover_image.url}`,
        snippet: item.snippet,
        author: authorName,
        authorHeadshotUrl: authorHeadshotUrl,
        read_time_minutes: item.read_time_minutes,
        date: new Date(item.publishedAt).toLocaleDateString('zh-CN', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      }
    }).filter((item: ArticlePost | null) => item !== null)
}catch (error: any) {
    console.error('从 Strapi 获取文章失败:', error);
    if (error.response && error.response.data && error.response.data.error) {
      console.error("Strapi 错误详情:", error.response.data.error);
    }
  } finally {
    isLoading.value = false
  }
}

function clearSearch() {
  searchTerm.value = ''
  isSearchActive.value = false
  fetchArticles()
}

onMounted(() => {
  fetchArticles()
})

</script>

<template>
  <div class="pt-48 px-8 pb-24 text-white max-w-5xl mx-auto">
    
    <h1 class="text-3xl font-serif font-semibold mb-4 mix-blend-difference">Some Articles</h1>
    <div v-if="!isSearchActive" class="flex justify-between items-center border-b border-gray-700 pb-4 mb-12">
      <span class="text-lg mix-blend-difference">All Posts</span>
      <button @click="isSearchActive = true" class="text-gray-400 hover:text-white">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      </button>
    </div>
    <div v-else class="relative mb-12">
      <div class="flex items-center border-b border-gray-600">
        <svg class="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        <input 
          type="text" v-model="searchTerm" @keydown.enter="fetchArticles" 
          placeholder="搜寻"
          class="w-full bg-transparent text-white mix-blend-difference pl-3 pr-10 py-2 text-lg focus:outline-hidden" 
        />
      </div>
      <button @click="clearSearch" class="text-gray-400 hover:text-white absolute top-1/2 right-0 -translate-y-1/2">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>

    <div v-if="isLoading" class="text-center text-gray-400">
      加载中...
    </div>

    <div v-if="!isLoading" class="space-y-16">
      
      <div v-for="post in posts" :key="post.id">
        <div class="block grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          <RouterLink 
            :to="{ name: 'ArticleDetail', params: { slug: post.slug } }"
            class="block group overflow-hidden"
          >
            <div class="aspect-video overflow-hidden">
              <img 
                :src="post.coverImageUrl" 
                :alt="post.title" 
                class="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
              />
            </div>
          </RouterLink>

          <div class="relative flex flex-col h-full">
            
            <div class="flex items-center space-x-3">
              <template v-if="post.authorHeadshotUrl">
                <img 
                  :src="post.authorHeadshotUrl" 
                  alt="Author Avatar" 
                  class="w-10 h-10 rounded-full object-cover shrink-0" 
                  style="border: 1px solid #4B5563;"
                />
              </template>
              <template v-else>
                <svg class="w-10 h-10 shrink-0 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 17a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd"></path>
                </svg>
              </template>
              <div class="text-sm">
                <div v-if="post.author" class="text-white font-medium mix-blend-difference">{{ post.author }}</div>
                <div class="text-white mix-blend-difference flex items-center space-x-2">
                  <span v-if="post.date">{{ post.date }}</span>
                  <span v-if="post.date && post.read_time_minutes" class="mx-1">•</span>
                  <span v-if="post.read_time_minutes">{{ post.read_time_minutes }} 分钟阅读</span>
                </div>
              </div>
            </div>
            
            <RouterLink :to="{ name: 'ArticleDetail', params: { slug: post.slug } }" class="group mt-2">
              <h2 class="text-3xl font-semibold group-hover:text-gray-300 mix-blend-difference">{{ post.title }}</h2>
            </RouterLink>
            
            <RouterLink :to="{ name: 'ArticleDetail', params: { slug: post.slug } }" class="group">
              <p v-if="post.snippet" class="mt-4 text-gray-300 group-hover:text-gray-100 grow mix-blend-difference">
                {{ post.snippet }}
              </p>
            </RouterLink>

            <button class="absolute top-0 right-0 text-gray-400 hover:text-white">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
              </svg>
            </button>

            <div class="mt-auto pt-4 flex justify-between items-center text-sm text-gray-400">
              <div class="flex space-x-2 items-center">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                <span>0</span>
              </div>
              <div class="flex space-x-2 items-center">
                <span>0</span>
                <font-awesome-icon :icon="['far', 'heart']" class="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>