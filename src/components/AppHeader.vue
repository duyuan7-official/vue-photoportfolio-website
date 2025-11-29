<script setup lang="ts">
import { RouterLink } from 'vue-router'
// 1. --- (新增) 导入 useRoute ---
import { useRoute } from 'vue-router'

// 2. --- (新增) 获取当前路由信息 ---
const route = useRoute()
</script>

<template>
  <header class="absolute top-0 left-0 right-0 z-80 p-8 text-white bg-gray-500/20 backdrop-blur-lg drop-shadow-lg border-b border-white/10">
    <div class="container max-w-4xl mx-auto flex items-center">
      
      <RouterLink to="/" class="shrink-0 mr-3 text-right">
        <span class="block font-semibold text-3xl tracking-normal mix-blend-difference">Du Yuan</span>
        <span class="block font-normal text-lg tracking-widest">PHOTOGRAPHY</span>
      </RouterLink>

      <div class="h-12 border-l-2 border-white/75"></div>

      <nav class="flex-1 ml-6">
        <ul class="flex space-x-4">
          
          <li class="flex-1 text-center transition-opacity duration-300 hover:opacity-50 group">
            <div class="h-0.5 bg-white mb-1 transition-all duration-300 group-hover:h-px"></div>
            <RouterLink to="/" class="uppercase text-xs tracking-widest">Home</RouterLink>
          </li>
          
          <li class="flex-1 text-center transition-opacity duration-300 hover:opacity-50 group">
            <div class="h-0.5 bg-white mb-1 transition-all duration-300 group-hover:h-px"></div>
            <RouterLink to="/about" class="uppercase text-xs tracking-widest">About</RouterLink>
          </li>
          
          <li class="flex-1 text-center transition-opacity duration-300 hover:opacity-50 group">
            <div class="h-0.5 bg-white mb-1 transition-all duration-300 group-hover:h-px"></div>
            <RouterLink to="/portraits" class="uppercase text-xs tracking-widest">Portraits</RouterLink>
          </li>
          
          <li class="flex-1 text-center transition-opacity duration-300 hover:opacity-50 group">
            <div class="h-0.5 bg-white mb-1 transition-all duration-300 group-hover:h-px"></div>
            <RouterLink to="/landscape" class="uppercase text-xs tracking-widest">Landscape</RouterLink>
          </li>
          
          <li class="flex-1 text-center transition-opacity duration-300 hover:opacity-50 group">
            <div class="h-0.5 bg-white mb-1 transition-all duration-300 group-hover:h-px"></div>
            <RouterLink to="/journey" class="uppercase text-xs tracking-widest">Journey</RouterLink>
          </li>
          
          <li class="flex-1 text-center transition-opacity duration-300 hover:opacity-50 group">
            <div class="h-0.5 bg-white mb-1 transition-all duration-300 group-hover:h-px"></div>
            <RouterLink to="/article" class="uppercase text-xs tracking-widest">Article</RouterLink>
          </li>
          
        </ul>
      </nav>

    </div>
  </header>
</template>