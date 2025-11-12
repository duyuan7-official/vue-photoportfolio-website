<script setup lang="ts">
  import { ref } from 'vue'
  
  const isWeChatModalOpen = ref(false)
  </script>



<template>
  <div class="fixed absolute bg-transparent bottom-0 left-0 right-0 p-8 text-gray-400 z-100">
    <div class="container max-w-5xl mx-auto flex justify-between items-center text-xs">
      
      <p class="text-gray-500">
        © 2035 by DuYuan&HeShan PHOTOGRAPHY. Powered and secured by DuYuan
      </p>
      
      <div class="flex space-x-4">
        
        <a a href="https://x.com/dy7_official" target="_blank" aria-label="Twitter" class="text-white hover:opacity-75 transition-opacity">
          <font-awesome-icon :icon="['fab', 'x-twitter']" class="h-4 w-4" />
        </a>
        
        
          <button
            @click="isWeChatModalOpen = true"
            aria-label="WeChat"
            class="text-white hover:opacity-75 transition-opacity">
            <font-awesome-icon :icon="['fab', 'weixin']" class="h-4 w-4" />
          </button>
  
        
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
      v-if="isWeChatModalOpen"
      @click="isWeChatModalOpen = false"
      class="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-black/80 p-4"
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
          class="relative bg-transparent p-6 rounded-lg shadow-xl max-w-xs w-full"
        >
          <img 
            src="/img/wechat-qr.jpeg" 
            alt="微信二维码" 
            class="w-full h-auto block rounded-md" 
          />
          <p class="mt-4 text-center text-gray-100 text-sm">
            使用微信扫一扫
          </p>
          
          <button 
            @click="isWeChatModalOpen = false"
            class="absolute -top-3 -right-3 p-1 rounded-full text-white bg-black/50 hover:bg-black"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </Transition>
    </div>
  </Transition>
</template>