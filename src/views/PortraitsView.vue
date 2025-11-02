<script setup lang="ts">
import { ref } from 'vue'
import MasonryWall from '@yeger/vue-masonry-wall'

// --- 灯箱逻辑 (不变) ---
const selectedImage = ref<string | null>(null)
function openImage(src: string) {
  selectedImage.value = src
}
function closeImage() {
  selectedImage.value = null
}

// --- 图片列表 (修改) ---
// 1. 为每张图片添加 "liked: false" 状态
const imageGallery = ref([
  { id: 1, src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto-format&fit=crop', alt: 'Man in shadow', liked: false },
  { id: 2, src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto-format&fit=crop', alt: 'Woman with hat', liked: false },
  { id: 3, src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=800&auto-format&fit=crop', alt: 'Woman smiling', liked: false },
  { id: 4, src: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=800&auto-format&fit=crop', alt: 'Man in jacket', liked: false },
  { id: 5, src: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto-format&fit=crop', alt: 'Man with beard', liked: false },
  { id: 6, src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto-format&fit=crop', alt: 'Man with glasses', liked: false },
])

// --- 新增功能函数 ---

// 2. 点赞功能
// (event: Event) 确保我们能调用 event.stopPropagation()
function toggleLike(event: Event, id: number) {
  event.stopPropagation() // 阻止点击图标时打开灯箱
  const image = imageGallery.value.find(img => img.id === id)
  if (image) {
    image.liked = !image.liked
  }
}

// 3. 下载功能
function downloadImage(event: Event, src: string, alt: string) {
  event.stopPropagation() // 阻止点击图标时打开灯箱
  
  // 使用 fetch 获取图片数据
  fetch(src)
    .then(response => response.blob())
    .then(blob => {
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      // 使用 alt 文本作为默认文件名
      link.download = alt.replace(/\s+/g, '_') || 'download.jpg'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)
    })
    .catch(console.error)
}

// 4. 分享功能
async function shareImage(event: Event, src: string, alt: string) {
  event.stopPropagation() // 阻止点击图标时打开灯箱
  
  const shareData = {
    title: alt,
    text: `来看看这张很棒的照片: ${alt}`,
    url: src,
  }

  try {
    // 尝试使用 Web Share API
    if (navigator.share) {
      await navigator.share(shareData)
    } else {
      // Fallback: 复制到剪贴板
      await navigator.clipboard.writeText(src)
      alert('图片链接已复制到剪贴板！')
    }
  } catch (err) {
    console.error('分享失败:', err)
    // 如果用户取消了分享, 我们不需要弹窗
    if ((err as Error).name !== 'AbortError') {
      // 最终 Fallback
      alert('无法自动分享，请手动复制链接: ' + src)
    }
  }
}

</script>

<template>
  <div class="pt-48 px-8 pb-24 text-white max-w-3xl mx-auto">
    
    <h1 class="text-3xl font-semibold mb-6">PORTRAITS</h1>
    <p class="mb-12 text-gray-300">
      I'm a paragraph. Click here to add your own text and edit me. It's easy. Just click “Edit Text” or double click me and you can start adding your own content and make changes to the font. Feel free to drag and drop me anywhere you like on your page. I’m a great place for you to tell a story and let your users know a little more about you.
    </p>

    <masonry-wall
      :items="imageGallery"
      :column-width="300" 
      :gap="16"
      class="group"
    >
      <template #default="{ item }">
        <div 
          :key="item.id"
          @click="openImage(item.src)"
          class="relative cursor-pointer 
                 transition-all duration-300 group-hover:opacity-50 hover:!opacity-100 hover:scale-105"
        >
          <img :src="item.src" :alt="item.alt" class="w-full h-auto block rounded" />

          <div 
            class="absolute bottom-0 left-0 right-0 p-4 
                   bg-gradient-to-t from-black/60 to-transparent
                   flex justify-between items-center
                   opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <button 
              @click="toggleLike($event, item.id)"
              :class="item.liked ? 'text-red-500' : 'text-white'"
              class="hover:opacity-75 transition-colors"
            >
              <font-awesome-icon :icon="item.liked ? ['fas', 'heart'] : ['far', 'heart']" class="h-5 w-5" />
            </button>
            
            <div class="flex space-x-4">
              <button 
                @click="downloadImage($event, item.src, item.alt)"
                class="text-white hover:text-gray-300 transition-colors"
              >
                <font-awesome-icon :icon="['fas', 'download']" class="h-5 w-5" />
              </button>
              
              <button 
                @click="shareImage($event, item.src, item.alt)"
                class="text-white hover:text-gray-300 transition-colors"
              >
                <font-awesome-icon :icon="['fas', 'share']" class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </template>
    </masonry-wall>
  </div>

  <Transition
    enter-active-class="transition-opacity duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="selectedImage"
      @click="closeImage"
      class="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-black/80 p-4"
    >
      <Transition
        appear
        enter-active-class="transition-transform duration-300 ease-out"
        enter-from-class="scale-90"
        enter-to-class="scale-100"
        leave-active-class="transition-transform duration-200 ease-in"
        leave-from-class="scale-100"
        leave-to-class="scale-90"
      >
        <img
          :src="selectedImage"
          @click.stop
          class="max-h-full max-w-full rounded-lg"
        />
      </Transition>
    </div>
  </Transition>
</template>