<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MasonryWall from '@yeger/vue-masonry-wall'
import axios from 'axios'

// 你的 Strapi 服务器地址
const STRAPI_URL = 'http://8.137.176.118:1337'

interface ImageItem {
  id: number
  src: string
  alt: string
  liked: boolean
}

const hoveredItemId = ref<number | null>(null) // --- (新增) 用于跟踪被悬停的图片 ID ---
const selectedImage = ref<string | null>(null)
const imageGallery = ref<ImageItem[]>([])
const isLoading = ref(true)

function openImage(src: string) {
  selectedImage.value = src
}
function closeImage() {
  selectedImage.value = null
}

onMounted(async () => {
  isLoading.value = true
  try {
    const response = await axios.get(`${STRAPI_URL}/api/photos`, {
      params: {
        'populate': 'image',
        // *** 修改这里的 category ***
        'filters[category][$eq]': 'landscape' // <-- 从 'documentary' 改为 'landscape'
      }
    })

    const strapiData = response.data.data
    
    imageGallery.value = strapiData.map((item: any) => {
      if (!item.image || !item.image.url) {
        return null 
      }
      
      return {
        id: item.id,
        src: `${STRAPI_URL}${item.image.url}`, 
        alt: item.alt, 
        liked: false
      }
    }).filter((item: ImageItem | null) => item !== null)
    
  } catch (error) {
    console.error('从 Strapi 获取图片失败:', error)
  } finally {
    isLoading.value = false
  }
})


// --- 功能函数 (完全不变) ---
function toggleLike(event: Event, id: number) {
  event.stopPropagation()
  const image = imageGallery.value.find(img => img.id === id)
  if (image) {
    image.liked = !image.liked
  }
}
async function downloadImage(event: Event, src: string, alt: string) {
  event.stopPropagation()
  fetch(src, { mode: 'cors' }) 
    .then(response => response.blob())
    .then(blob => {
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = alt.replace(/\s+/g, '_') || 'download.jpg'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)
    })
    .catch(console.error)
}
async function shareImage(event: Event, src: string, alt: string) {
  event.stopPropagation()
  const shareData = { title: alt, text: `来看看这张很棒的照片: ${alt}`, url: src }
  try {
    if (navigator.share) {
      await navigator.share(shareData)
    } else {
      await navigator.clipboard.writeText(src)
      alert('图片链接已复制到剪贴板！')
    }
  } catch (err) {
    // ...
  }
}

</script>

<template>
  <div class="pt-32 px-8 pb-24 text-white max-w-5xl mx-auto">
    
    <h1 class="text-3xl font-semibold mb-6">LANDSCAPE</h1>
    <p class="mb-12 text-gray-300">
      这里是风景摄影页面的描述文字。
    </p>

    <div v-if="isLoading" class="text-center text-gray-400">
      从 Strapi 加载中...
    </div>

    <masonry-wall
      v-if="!isLoading && imageGallery.length > 0"
      :items="imageGallery"
      :column-width="300" 
      :gap="16"
      @mouseleave="hoveredItemId = null"
    >
      <template #default="{ item }">
        <div 
          :key="item.id"
          @mouseenter="hoveredItemId = item.id"
          @mouseleave="hoveredItemId = null"
          @click="openImage(item.src)"
          class="relative cursor-pointer group/item"
          :class="[
            'transition-all duration-300',
            hoveredItemId === null
              ? 'opacity-100 scale-100' /* 状态A: 无悬停 */
              : hoveredItemId === item.id
                ? 'opacity-100 scale-105 z-10' /* 状态B: 这张被悬停 */
                : 'opacity-50 scale-100'  /* 状态C: 别的被悬停 */
          ]"
        >
          <img :src="item.src" :alt="item.alt" class="w-full h-auto block" />
          <div 
            class="absolute bottom-0 left-0 right-0 p-4 
                   bg-gradient-to-t from-black/60 to-transparent
                   flex justify-between items-center
                   opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"
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

    <div v-if="!isLoading && imageGallery.length === 0" class="text-center text-gray-400">
      未找到 'landscape' 分类的图片。
      <br />
      请确保你已在 Strapi 中上传并**发布**了图片。
    </div>
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