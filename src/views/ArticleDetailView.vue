<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import axios from 'axios'
import { marked } from 'marked' 

const STRAPI_URL = 'http://8.137.176.118:1337' // 确保这是你的正确 IP
const route = useRoute()


//--- 定义 Comment 接口 ---
interface Comment {
    id: number
    author_name: string
    content: string
    createdAt: string
}

interface Post {
    id: number
    title: string
    content: string
    coverImageUrl: string
    author: string
    date: string
    read_time_minutes: number
    updatedAt: string // (新)
    comments: Comment[]
}

// --- 定义 "Recent Post" 接口 ---
interface RecentPost {
  id: number
  title: string
  slug: string
  coverImageUrl: string
}

const post = ref<Post | null>(null)
const recentPosts = ref<RecentPost[]>([]) // (新)
const isLoading = ref(true)

// --- 2. (新增) 评论表单的状态 ---
const newCommentName = ref('')
const newCommentText = ref('')
const isSubmitting = ref(false)

const isCommentFormVisible = ref(false)

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
        'populate': ['cover_image','comments'] // (保持简单)
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
      comments: (item.comments || []).sort((a: any,b: any)=>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
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

// --- ( ✨ 第 127 步: 新增分享功能 ✨ ) ---
//

// 辅助函数: 打开一个新窗口
function openShareWindow(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer,resizable=yes');
}

// 1. 分享到 qq
function shareToQQ() {
  if (!post.value) return;
  const currentUrl = window.location.href;
  const title = encodeURIComponent(post.value.title);
  const url = `https://connect.qq.com/widget/shareqq/index.html?summary=${title}&url=${encodeURIComponent(currentUrl)}`;
  openShareWindow(url);
}

// 2. 分享到 X (Twitter)
function shareOnXTwitter() {
  if (!post.value) return;
  const currentUrl = window.location.href;
  const text = encodeURIComponent(post.value.title);
  const url = `https://x.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${text}`;
  openShareWindow(url);
}

// 3. 分享到 LinkedIn
function shareOnLinkedIn() {
  if (!post.value) return;
  const currentUrl = window.location.href;
  const title = encodeURIComponent(post.value.title);
  const url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}&title=${title}`;
  openShareWindow(url);
}

// 4. 复制链接
async function copyLink() {
  const currentUrl = window.location.href;
  try {
    await navigator.clipboard.writeText(currentUrl);
    alert('链接已复制到剪贴板！');
  } catch (err) {
    console.error('复制链接失败:', err);
    alert('复制失败！');
  }
}

// --- ( 新增功能结束 ) ---

// --- 提交评论函数---
async function handleCommentSubmit() {
    if (!newCommentName.value.trim() || !newCommentText.value.trim() || !post.value)
        {
            alert('请填写你的昵称和评论内容')
            return
        }
    isSubmitting.value = true
    try {
    // (关键!) 发送 POST 请求到 /api/comments
    const response = await axios.post(`${STRAPI_URL}/api/comments`, {
      data: {
        author_name: newCommentName.value,
        content: newCommentText.value,
        article: post.value.id // <-- (关键!) 关联到当前文章
      }
        })

        //实时更新评论
        const newComment = response.data.data
        // (为了安全, 格式化一下)
        const formattedComment = {
        id: newComment.id,
        author_name: newComment.author_name,
        content: newComment.content,
        createdAt: newComment.createdAt
        }
        //添加到评论列表顶部
        post.value.comments.unshift(formattedComment)
        //清空表单
        newCommentName.value = ''
        newCommentText.value = ''
    } catch(error: any) {
        console.error('评论提交失败：',error);
        alert('评论提交失败!');
    } finally {
        isSubmitting.value = false
    }
}

// --- ( ✨ 2. 新增! 精确的时间格式化函数 ✨ ) ---
function formatPreciseDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false // 使用24小时制
  };
  return new Date(dateString).toLocaleString('zh-CN', options);
}

</script>

<template>
  <div class="pt-48 px-8 pb-24 text-white max-w-5xl mx-auto">
    
    <div v-if="isLoading" class="text-center text-gray-400">
      加载中...
    </div>

    <article v-if="post">
      
      <header class="mb-8">
        <h1 class="text-4xl md:text-5xl font-bold text-left my-4">
          {{ post.title }}
        </h1>
        </header>
      <div 
        v-html="renderedContent"
        class="prose prose-invert prose-lg max-w-3xl border-b mx-auto"
      ></div>
      <div class="flex space-x-4 py-8 border-b border-transparent">
        </div>
      <section class="mt-12" v-if="recentPosts.length > 0">
        </section>

      <section class="mt-12">
        
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-semibold">留言 ({{ post.comments.length }})</h2>
          
          <button 
            v-if="!isCommentFormVisible"
            @click="isCommentFormVisible = true"
            class="bg-white text-black py-2 px-5 font-semibold text-sm
                   hover:bg-gray-300 transition-colors"
          >
            发表留言
          </button>
        </div>
        
        <hr class="border-gray-700 mb-8" />
        
        <Transition
          enter-active-class="transition-opacity duration-300 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-200 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <form v-if="isCommentFormVisible" @submit.prevent="handleCommentSubmit" class="mb-12">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label for="comment-name" class="block text-sm font-medium text-gray-300 mb-1">昵称</label>
                <input 
                  v-model="newCommentName"
                  type="text" 
                  id="comment-name"
                  class="w-full bg-zinc-800 text-white rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                  required
                />
              </div>
            </div>
            <div>
              <label for="comment-text" class="block text-sm font-medium text-gray-300 mb-1">评论内容</label>
              <textarea 
                v-model="newCommentText"
                id="comment-text" 
                rows="4"
                class="w-full bg-zinc-800 text-white rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                required
              ></textarea>
            </div>
            <div class="mt-4 flex justify-end space-x-4">
              <button 
                type="button"
                @click="isCommentFormVisible = false"
                class="bg-zinc-700 text-white py-2 px-5 rounded-md font-semibold text-sm
                       hover:bg-zinc-600 transition-colors"
              >
                取消
              </button>
              <button 
                type="submit"
                :disabled="isSubmitting"
                class="bg-white text-black py-2 px-5 rounded-md font-semibold text-sm
                       hover:bg-gray-300 transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isSubmitting ? '提交中...' : '提交评论' }}
              </button>
            </div>
          </form>
        </Transition>

        <div class="mt-12">
          
          <div v-if="post.comments.length === 0 && !isCommentFormVisible" class="text-center text-gray-500">
            无法载入留言
          </div>
          
          <div 
            v-for="comment in post.comments" 
            :key="comment.id" 
            class="py-6"
          >
            <p class="text-lg text-gray-100">
              {{ comment.content }}
            </p>
            <hr class="border-gray-700 mt-2 mb-4" />
            <div class="text-right text-sm text-gray-500">
              <span>{{ comment.author_name }}</span>
              <span class="mx-1">发布于</span>
              <span>{{ formatPreciseDate(comment.createdAt) }}</span>
            </div>
          </div>

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