<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { marked } from 'marked' // (确保你已 npm install marked)

const STRAPI_URL = 'http://8.137.176.118:1337' // 确保这是你的正确 IP
const route = useRoute()
const slug = route.params.slug as string

interface Post {
  id: number
  title: string
  content: string // Markdown
  coverImageUrl: string
}

const post = ref<Post | null>(null)
const isLoading = ref(true)

onMounted(async () => {
  isLoading.value = true
  try {
    // 1. (正确) 请求 /api/articles
    const response = await axios.get(`${STRAPI_URL}/api/articles`, {
      params: {
        'filters[slug][$eq]': slug,
        'populate': 'cover_image'
      }
    })

    // 2. (正确) 使用 response.data.data
    const dataArray = response.data.data
    
    if (!dataArray || dataArray.length === 0) {
      throw new Error('未找到该文章')
    }

    const item = dataArray[0] // 获取数组中的第一项

    // 3. (正确) 使用 V5 扁平结构
    post.value = {
      id: item.id,
      title: item.title,
      content: item.content,
      coverImageUrl: item.cover_image ? `${STRAPI_URL}${item.cover_image.url}` : ''
    }

  } catch (error: any) {
    console.error('从 Strapi 获取文章详情失败:', error);
    if (error.response && error.response.data && error.response.data.error) {
      console.error("Strapi 错误详情:", error.response.data.error);
    }
  } finally {
    isLoading.value = false
  }
})

// (关键!) 将 Markdown 字符串转换为 HTML
const renderedContent = computed(() => {
  if (post.value && post.value.content) {
    return marked(post.value.content)
  }
  return ''
})
</script>

<template>
  <div class="pt-48 px-8 pb-24 text-white max-w-5xl mx-auto">
    
    <div v-if="isLoading" class="text-center text-gray-400">
      加载中...
    </div>

    <article v-if="post">
      <img 
        v-if="post.coverImageUrl"
        :src="post.coverImageUrl" 
        :alt="post.title"
        class="w-full h-auto rounded object-cover mb-8"
      />
      
      <h1 class="text-4xl font-semibold mb-6">{{ post.title }}</h1>
      
      <div 
        v-html="renderedContent"
        class="prose prose-invert prose-lg max-w-none"
      ></div>
    </article>
  </div>
</template>

<style>
/* (重要!) Tailwind "prose" 的默认样式修改 
  我们让 Markdown 中的链接也变成白色
*/
.prose a {
  color: #fff;
  text-decoration: underline;
}
.prose a:hover {
  color: #ccc;
}
</style>