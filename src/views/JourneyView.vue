<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getJourneys } from '@/api/contentService'
import JourneyGallery from '@/components/JourneyGallery.vue'
// 1. --- (导入 CardSwap - 保持不变) ---
import CardSwap from '@/components/Components/CardSwap/CardSwap.vue'
import TextType from '@/components/TextAnimations/TextType/TextType.vue'
import Aurora from '@/components/Backgrounds/Aurora/Aurora.vue'

// ( selectedJourneySlug, openJourney, closeJourney - 保持不变 )
const selectedJourneySlug = ref<string | null>(null)
function openJourney(slug: string) {
  selectedJourneySlug.value = slug
}
function closeJourney() {
  selectedJourneySlug.value = null
}

// 2. --- (修复!) 恢复你原来的 handleCardClick ---
// (这个函数只处理 *动画* 的点击, 不打开模态框)
const handleCardClick = (index: number) => {
  console.log(`Card ${index} clicked (this is the swap animation click)`);
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

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
    const response = await getJourneys()
    const strapiData = response.data.data
    const dataArray = strapiData || [] 
    journeys.value = dataArray.map((item: any) => {
      if (!item.cover_image || !item.cover_image.url || !item.title) return null
      return {
        id: item.id,
        title: item.title,
        slug: item.slug,
        date: new Date(item.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', 'day': 'numeric' }),
        coverImageUrl: `${API_BASE_URL}${item.cover_image.url}`
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
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<template>
  <div class="z-0 absolute fixed inset-0">
    <Aurora
      :color-stops="['#7cff67', '#171D22', '#7cff67']"
      :amplitude="1.0"
      :blend="0.5"
      :speed="1.0"
      :intensity="1.0"
      class="w-full h-full"
    />
  </div>

  <div class="relative w-full overflow-x-hidden">
  
  <div class="pt-32 px-8 pb-24 text-white max-w-5xl mx-auto">
    
    <div v-if="isLoading" class="text-center text-gray-400">
      加载中...
    </div>
    
    <div v-if="!isLoading && journeys.length === 0" class="text-center text-gray-400">
      未找到 'journey' 分类的图片。
      <br />
      请确保你已在 Strapi 中上传并**发布**了图片。
    </div>

    <div v-if="!isLoading && journeys.length > 0" class="flex flex-col lg:flex-row justify-between items-start gap-8">
      
      <div class="w-full lg:w-5/12 ">
        <TextType
          :text="['有一个想法，安慰着我：\n不管走到天涯海角，\n我离她都不会更远了。']"
          :typingSpeed="75"
          :as="'p'"
          :pauseDuration="1500"
          :showCursor="true"
          :loop="true"
          cursorCharacter="|"
          :class-name="'text-3xl text-left tracking-wide leading-relaxed relative mt-24 lg:absolute'"
        />
      </div>

      <div class="w-full relative lg:w-7/12 flex justify-center lg:block">

        <div class="relative h-[400px] mt-36 
                    lg:translate-x-16">
          <CardSwap
            :total-cards="journeys.length"
            :pause-on-hover="false"
            :width="550"  
            :height="300"
            :className="'bg-transparent border-none overflow-hidden '"
            @card-click="handleCardClick"
          >
            <template
              v-for="(journey, index) in journeys"
              :key="journey.id"
              v-slot:[`card-${index}`]
            >
              <div class="m-2 flex items-center">
                <i class="pi pi-circle-fill mr-2"></i>
                <span>{{ journey.title }} 于 {{ journey.date }}</span>
              </div>
              <div
                @click.stop="openJourney(journey.slug)"
                class="relative w-full h-full overflow-hidden cursor-pointer group"
              >
                <img
                  :src="journey.coverImageUrl"
                  :alt="journey.title"
                  class="absolute inset-0 w-300 h-full"
                />
              </div>
            </template>
          </CardSwap>
        </div>
      </div>
    </div>
    
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
      class="fixed backdrop-blur-lg inset-0 z-90 flex items-center justify-center "
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
          class="relative w-full h-full  back-blur-lg rounded-lg shadow-xl flex flex-col"
        >
          <button 
            @click="closeJourney" 
            class="absolute top-8 right-8 z-50 p-1 rounded-full text-white hover:text-white hover:bg-zinc-600 transition-colors"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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