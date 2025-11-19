
<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, Comment } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { getArticleBySlug, getRecentArticles, } from '@/api/contentService'
import { marked } from 'marked' 
import { Motion } from "motion-v";
import AuroraBackground from '@/components/ui/aurora-background/AuroraBackground.vue';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
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

onMounted(async () => {
  document.body.classList.add('article-detail-page')
  // 动态导入 Waline 客户端
  // 使用 @ts-ignore 来绕过 TypeScript 对外部 URL 模块的类型检查
  // 如果需要更严格的类型支持，请在项目中添加一个全局声明文件（例如 src/types/waline.d.ts）
  // @ts-ignore
  const walineModule = await import('https://unpkg.com/@waline/client@v2/dist/waline.mjs')
    .catch((e) => {
      console.warn('Waline 动态导入失败:', e);
      return null;
    });

  // 初始化 Waline（如果导入成功）
  if (walineModule && (walineModule as any).init) {
    const { init } = walineModule as any;
    init({
      el: '#waline', // 确保这个 ID 和模板中的 DIV 匹配
      serverURL: 'https://waline-photoportfolio-website.vercel.app/', // 示例：'https://your-waline-server.com'
      // ... 其他配置 ...
    });
  }
});
//取消标签——导航栏变色
onUnmounted(() => {
  document.body.classList.remove('article-detail-page')
})

// --- 2. (更新) 创建一个函数来获取数据 ---
async function fetchArticle(slug: string) {
  isLoading.value = true
  post.value = null // 清空旧数据
  recentPosts.value = [] // 清空旧数据

  try {
    // --- (请求 1: 获取当前文章) ---
    const response = await getArticleBySlug(slug)

    const dataArray = response.data.data
    if (!dataArray || dataArray.length === 0) throw new Error('未找到该文章')
    
    const item = dataArray[0]
    post.value = {
      id: item.id,
      title: item.title,
      content: item.content,
      coverImageUrl: item.cover_image ? `${API_BASE_URL}${item.cover_image.url}` : '',
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
    //更新浏览器标签
    document.title = `${item.title} | DuYuan's Photography`

    // --- (请求 2: 获取最新文章) ---
    const recentResponse = await getRecentArticles(slug)
    const recentDataArray = recentResponse.data.data || []
    recentPosts.value = recentDataArray.map((item: any) => {
      if (!item.cover_image || !item.cover_image.url || !item.title) return null
      return {
        id: item.id,
        title: item.title,
        slug: item.slug,
        coverImageUrl: `${API_BASE_URL}${item.cover_image.url}`
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
  <div class="relative w-full min-h-screen">
    
    <AuroraBackground class="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none" />

    <main class="relative z-10">
      
      <Motion
        as="div"
        :initial="{ opacity: 0, y: 40, filter: 'blur(10px)' }"
        :while-in-view="{
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
        }"
        :transition="{
          delay: 0.3,
          duration: 0.8,
          ease: 'easeInOut',
        }"
        class="relative flex flex-col items-center justify-center gap-4 px-4 "
      >
       
      
      <div class="pt-48 px-8 pb-24 text-white max-w-3xl mx-auto">
        
        <div v-if="isLoading" class="text-center text-gray-400">
          加载中...
        </div>

        <article 
        v-if="post"
        class="bg-[#fdfbf7] p-8 md:p-12 rounded-2xl shadow-2xl ring-1 ring-gray-900/5 mt-8 text-slate-800">
          
          <header class="mb-8">
            <div class="text-slate-600 text-sm flex items-center space-x-2">
              <span v-if="post.date">{{ post.date }}</span>
              <span v-if="post.date && post.read_time_minutes" class="mx-1">•</span>
              <span v-if="post.read_time_minutes">{{ post.read_time_minutes }} 分钟阅读</span>
            </div>
            
            <h1 class="text-4xl text-slate-900 md:text-5xl font-bold text-left my-4">
              {{ post.title }}
            </h1>
            
            <div class="text-gray-500 text-sm">
              已更新: {{ post.updatedAt }}
            </div>
          </header>

          <div 
            v-html="renderedContent"
            class="prose prose-invert prose-lg max-w-none border-b border-gray-700 pb-8"
          ></div>

          <div class="flex space-x-4 py-8 border-b border-gray-700">
            <a 
                href="#" 
                @click.prevent="shareToQQ"
                class="text-gray-400 hover:text-white" 
                title="分享到 QQ">
              <font-awesome-icon :icon="['fab', 'qq']" class="h-5 w-5" />
            </a>
            <a href="#" 
                @click.prevent="shareOnXTwitter"
                class="text-gray-400 hover:text-white"
                title="分享到 Twitter"
                >
              <font-awesome-icon :icon="['fab', 'x-twitter']" class="h-5 w-5" />
            </a>
            <a href="#" @click.prevent="shareOnLinkedIn" class="text-gray-400 hover:text-white" title="分享到 LinkedIn">
              <font-awesome-icon :icon="['fab', 'linkedin']" class="h-5 w-5" />
            </a>
            <a href="#" @click.prevent="copyLink" class="text-gray-400 hover:text-white" title="复制链接">
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
            <hr class="border-gray-700 mb-8" />
            <div id="waline" class="waline-theme"></div>
          </section>

        </article>
      </div>
      </Motion>
    </main>
  </div>
</template>

<style>
@import url('https://unpkg.com/@waline/client@v2/dist/waline.css');
/* (样式 - 不变) */
/* Markdown 文章配色方案：Deep Ocean (适配明亮背景) 
  直接覆盖 Tailwind Typography 的 CSS 变量
*/
.prose a:hover {
  color: #1d4ed8; /* 更深的蓝色 */
  text-decoration-thickness: 2px;
}
.prose {
  /* --- 核心文字 --- */
  --tw-prose-body: #334155;      /* 正文：深蓝灰 (Slate-700) - 柔和且清晰 */
  --tw-prose-headings: #0f172a;  /* 标题：午夜蓝 (Slate-900) - 强调权威感 */
  --tw-prose-lead: #475569;      /* 导语：中灰 (Slate-600) */

  /* --- 强调与链接 --- */
  --tw-prose-bold: #020617;      /* 加粗：近乎纯黑 (Slate-950) */
  --tw-prose-links: #2563eb;     /* 链接：宝蓝色 (Blue-600) - 醒目 */
  
  /* --- 列表与引用 --- */
  --tw-prose-counters: #64748b;  /* 有序列表序号 (Slate-500) */
  --tw-prose-bullets: #475569;   /* 无序列表圆点 (Slate-600) */
  --tw-prose-quotes: #1e293b;    /* 引用文字 (Slate-800) */
  --tw-prose-quote-borders: #cbd5e1; /* 引用左侧边框 (Slate-300) */

  /* --- 代码块 (保持暗色风格以突出代码) --- */
  --tw-prose-pre-bg: #1e293b;    /* 代码块背景：深蓝灰 */
  --tw-prose-pre-code: #f1f5f9;  /* 代码块文字：极浅灰 */
  
  /* --- 行内代码 (`code`) --- */
  --tw-prose-code: #dc2626;      /* 行内代码：深红色 (Red-600) - 类似 Notion 风格 */
  
  /* --- 分割线 --- */
  --tw-prose-hr: #cbd5e1;        /* 分割线：浅灰 (Slate-300) */
  
  /* --- 图片说明 --- */
  --tw-prose-captions: #64748b;  /* 图片底部文字 (Slate-500) */
}

/* --- 导航栏颜色覆盖 (仅在当前页面生效) --- */

/* 1. 强制把 header 里的链接(a), 文字(span/div), 图标(svg/i) 变色 */
body.article-detail-page header a,
body.article-detail-page header span,
body.article-detail-page header div,
body.article-detail-page header h1,
body.article-detail-page header h2,
body.article-detail-page nav a {
    color: #0f172a !important; /* Slate-900: 深午夜蓝 */
    transition: color 0.3s ease; /* 加个过渡动画更自然 */
}

/* 2. 处理 header 里的 svg 图标 (比如搜索、菜单图标) */
body.article-detail-page header svg,
body.article-detail-page header i {
    fill: #0f172a !important;
    color: #0f172a !important;
}

/* 3. 鼠标悬停时的颜色 (可选，比如变浅一点的灰) */
body.article-detail-page header a:hover {
    color: #475569 !important; /* Slate-600 */
}

/* --- (可选) 修正 Logo 颜色 --- */
/* 如果你的 Logo 是图片则不需要这句；如果是文字则需要 */
body.article-detail-page .logo-text-class { 
    color: #0f172a !important; 
}
/* 1. 导航文字上方的横线装饰条 */
/* 对应结构：nav -> ul -> li -> div (原本是 bg-white) */
body.article-detail-page header nav li div {
    background-color: #0f172a !important; /* Slate-900: 变为深午夜蓝 */
}

/* 2. Logo 和 导航 之间的竖线分隔符 */
/* 对应结构：<div class="h-12 border-l-2 border-white/75"> */
/* 我们利用 Tailwind 的类名作为选择器来覆盖它 */
body.article-detail-page header .border-white\/75 {
    border-color: #cbd5e1 !important; /* Slate-300: 变为浅灰色，比纯黑好看 */
    opacity: 1 !important; /* 重置透明度 */
}
</style>