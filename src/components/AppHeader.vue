<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="absolute top-0 left-0 right-0 z-10 p-8 text-white">
    <div class="container max-w-4xl mx-auto flex items-center space-x-6">
      
      <RouterLink to="/" class="flex-shrink-0">
        <span class="block font-semibold text-lg tracking-wider">Du Yuan</span>
        <span class="block font-light text-sm tracking-widest">PHOTOGRAPHY</span>
      </RouterLink>

      <div class="h-12 border-l-2 border-white/75"></div>

      <nav class="flex-1">
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