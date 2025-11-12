<script setup lang="ts">
import { ref, onMounted, computed} from 'vue'
import MasonryWall from '@yeger/vue-masonry-wall'
import { getJourneyBySlug } from '@/api/contentService';
import DomeGallery from '@/components/Components/DomeGallery/DomeGallery.vue'

const props = defineProps<{
  slug: string
}>()

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL // 确保这是你的正确 IP

interface ImageItem {
  id: number, src: string, alt: string, liked: boolean
}

// ( 4. 移除了 selectedImage, openImage, closeImage )
const imageGallery = ref<ImageItem[]>([])
const isLoading = ref(true)
const journeyTitle = ref('')
const journeyDate = ref('') 

// ( 5. onMounted - 保持不变 )
onMounted(async () => {
  isLoading.value = true
  try {
    const response = await getJourneyBySlug(props.slug)

    const journeyData = response.data.data[0] 
    if (!journeyData) throw new Error('未找到旅程')
    journeyTitle.value = journeyData.title
    journeyDate.value = new Date(journeyData.date).toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })

    imageGallery.value = journeyData.photos.map((item: any) => {
      if (!item.image || !item.image.url) return null
      return {
        id: item.id,
        src: `${API_BASE_URL}${item.image.url}`, 
        alt: item.alt, 
        liked: false
      }
    }).filter((item: ImageItem | null) => item !== null)
  } catch (error) {
    console.error('从 Strapi 获取旅程详情失败:', error)
  } finally {
    isLoading.value = false
  }
})

// --- 6. (新增) 计算属性 ---
// (将我们的 ImageItem[] 转换为 DomeGallery 需要的 string[])
const domeImageUrls = computed(() => {
  return imageGallery.value.map(image => image.src)
})

// --- 7. (移除) toggleLike, downloadImage, shareImage 函数 ---
</script>

<template>
  <div>
    <p class="text-2xl text-right font-semibold mb-6 text-white fixed top-5 z-100"> {{ journeyDate }}<br></br>我们在<br></br>{{ journeyTitle }}</p>
    <div v-if="isLoading" class="text-center text-gray-400">
      加载中...
    </div>

    <div v-if="!isLoading && domeImageUrls.length > 0" class="w-full h-screen ">
      <DomeGallery
        :images="domeImageUrls"
        :fit="0.5"
        fit-basis="height"
        :min-radius="600"
        :segments="26"
        :drag-sensitivity="20"
        :enlarge-transition-ms="300"
        :grayscale="false"
        overlay-blur-color="#00000000"
        image-border-radius="25px"
        opened-image-width="250px"
        opened-image-height="350px"
        
      />
    </div>

    <div v-if="!isLoading && imageGallery.length === 0" class="text-center text-gray-400">
      这个旅程中还没有照片。
    </div>
  </div>

  </template>