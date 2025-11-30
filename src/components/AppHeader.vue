<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import PillNav from '@/components/Components/PillNav/PillNav.vue';

const route = useRoute();
const currentPath = computed(() => route.path);

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Portraits', href: '/portraits' },
  { label: 'Landscape', href: '/landscape' },
  { label: 'Journey', href: '/journey' },
  { label: 'Article', href: '/article' },
];

const navConfig = {
  baseColor: 'rgba(255, 255, 255, 0.10)',
  pillColor: '#ffffff',
  pillTextColor: '#1f2937',
  hoveredPillTextColor: '#1f2937',
  logo: '/logo.png',
};
</script>

<template>
  <header class="absolute top-0 left-0 right-0 z-50 pointer-events-none mx-auto">
    <div class="flex flex-col w-full">
      <div class="flex items-center justify-between px-6 py-5 md:px-24 pointer-events-auto">
        
        <RouterLink 
          to="/" 
          class="flex flex-col md:pl-46 z-50 select-none mix-blend-difference text-black hover:opacity-80 transition-opacity group"
        >
          <span class="text-4xl font-normal tracking-widest font-serif mix-blend-difference leading-none">
            DuYuan
          </span>
        <div class="flex items-center -mt-2 pl-[2px] text-white/90 group-hover:text-white transition-colors">
          <div class="w-12 h-[1px] mt-1 bg-white mix-blend-difference group-hover:bg-white transition-colors"></div>
          <span class="text-[20px] md:text-[16px] font-serif font-light mt-1 pl-[4px] text-black transition-colors">
            Photography
          </span>
        </div>
        </RouterLink>

        <div class="flex-shrink-0">
          <PillNav
            :items="navItems"
            :logo="navConfig.logo"
            logo-alt="Du Yuan Photography"
            :active-href="currentPath"
            :base-color="navConfig.baseColor"
            :pill-color="navConfig.pillColor"
            :pill-text-color="navConfig.pillTextColor"
            :hovered-pill-text-color="navConfig.hoveredPillTextColor"
          />
        </div>
      </div>

      <div class="w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
    </div>
  </header>
</template>