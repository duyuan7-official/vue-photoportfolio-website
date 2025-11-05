<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import JourneyGallery from '@/components/JourneyGallery.vue'
// 1. --- (新增) 导入 CardSwap ---
import CardSwap from '@/components/Components/CardSwap/CardSwap.vue'

// ( selectedJourneySlug, openJourney, closeJourney - 保持不变 )
const selectedJourneySlug = ref<string | null>(null)
function openJourney(slug: string) {
  selectedJourneySlug.value = slug
}
function closeJourney() {
  selectedJourneySlug.value = null
}

const STRAPI_URL = 'http://8.137.176.118:1337' // 确保这是你的正确 IP

// ( 接口 和 Refs - 保持不变 )
interface Journey {
  id: number, title: string, slug: string, date: string, coverImageUrl: string
}
const journeys = ref<Journey[]>([])
const isLoading = ref(true)

// ( onMounted 函数 - 保持不变 )
onMounted(async () => {
  isLoading.value = true
  try {
    const response = await axios.get(`${STRAPI_URL}/api/journeys`, {
      params: {
        'populate': 'cover_image',
        'sort': 'date:desc'
      }
    })
    const strapiData = response.data.data
    const dataArray = strapiData || [] 
    journeys.value = dataArray.map((item: any) => {
      if (!item.cover_image || !item.cover_image.url || !item.title) return null
      return {
        id: item.id,
        title: item.title,
        slug: item.slug,
        date: new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        coverImageUrl: `${STRAPI_URL}${item.cover_image.url}`
      }
    }).filter((item: Journey | null) => item !== null)
  } catch (error: any) {
    console.error('从 Strapi 获取旅程失败:', error);
    if (error.response && error.response.data && error.response.data.error) {
      console.error("Strapi 错误详情:", error.response.data.error);
    }
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="pt-32 px-8 pb-24 text-white max-w-5xl mx-auto">
    
    <h1 class="text-3xl font-semibold mb-2">CLIENTS</h1>
    <p class="mb-12 text-gray-300">
      Impress your clients by easily creating an album site that they'll love.
    </p>

    <div v-if="isLoading" class="text-center text-gray-400">
      加载中...
    </div>

    <div v-if="!isLoading && journeys.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <CardSwap
        v-for="journey in journeys" 
        :key="journey.id"
        @click="openJourney(journey.slug)"
        :show-border="false"
        class-name="rounded-lg shadow-lg cursor-pointer"
      >
        <template #main>
          <div class="aspect-[3/4] relative">
            <img 
              :src="journey.coverImageUrl" 
              :alt="journey.title" 
              class="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </template>
        
        <template #detail>
          <div class="aspect-[3/4] relative p-4 flex flex-col justify-start items-start bg-zinc-900 text-white">
            <h2 class="text-xl font-semibold">{{ journey.title }}</h2>
            <p class="text-sm text-gray-400">{{ journey.date }}</p>
            
            <p class="mt-auto text-xs italic opacity-70">
              点击查看相册
            </p>
          </div>
        </template>
      </CardSwap>
      </div>

    <div v-if="!isLoading && journeys.length === 0" class="text-center text-gray-400">
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
      v-if="selectedJourneySlug"
      @click="closeJourney"
      class="fixed inset-0 z-40 flex items-center justify-center bg-black/80 p-4"
    >
      <Transition
        appear
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 scale-90"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-90"
      >
        <div 
          @click.stop 
          class="relative w-full max-w-5xl h-[90vh] bg-zinc-900 rounded-lg shadow-xl flex flex-col"
        >
          <button 
            @click="closeJourney" 
            class="absolute top-3 right-3 z-50 p-1 rounded-full text-gray-400 hover:text-white hover:bg-zinc-700 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          
          <div class="flex-1 overflow-y-auto p-8 pt-16">
            <JourneyGallery 
              v-if="selectedJourneySlug"
              :key="selectedJourneySlug"
              :slug="selectedJourneySlug" 
              />
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>