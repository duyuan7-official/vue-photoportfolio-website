<script setup lang="ts">
 import { ref, onMounted } from 'vue';
 import LiquidEther from '../components/Backgrounds/LiquidEther/LiquidEther.vue'
 import CurvedLoop from '@/components/TextAnimations/CurvedLoop/CurvedLoop.vue';

  const enableBlur = ref(true)
  const baseOpacity = ref(0.1) // 0 = 完全透明
  const baseRotation = ref(14) // 文本从 15 度旋转进入
  const blurStrength = ref(8) // 8px 的模糊
  const containerClassName = ref('my-scroll-container')
  const textClassName = ref('my-text-class')
  const rotationEnd = ref() // 结束时旋转归 0

  // 3. (定义) 这是 Vue 中处理 DOM 引用的方式
  const containerRef = ref<HTMLElement | null>(null)
  const scrollText = 'Welcome to my photography portfolio. Explore the world through my lens as I capture moments that tell stories, evoke emotions, and showcase the beauty of life.';
  // 4. (定义) 定义一个空的回调函数
  const wordAnimationEnd = ref()

// (可选) 这是一个重新渲染动画的函数
  const rerenderKey = ref(0)  
  function rerender() {
    rerenderKey.value++ // 改变 key 会强制 Vue 重新渲染组件
  }
</script>

<template>
  <div class="w-full min-h-screen overflow-hidden h-dvh relative">

    <LiquidEther
      :colors="['#48FF28', '#A2FFC6', '#9EF19E']"
      :mouseForce="20"
      :cursorSize="100"
      :isViscous="false"
      :viscous="30"
      :iterationsViscous="32"
      :iterationsPoisson="32"
      :resolution="0.5"
      :isBounce="false"
      :autoDemo="true"
      :autoSpeed="0.5"
      :autoIntensity="2.2"
      :takeoverDuration="0.25"
      :autoResumeDelay="3000"
      :autoRampDuration="0.6"
      class="absolute z-0 inset-0"
    />

    <div class="absolute inset-0 px-4 md:px12 z-20 p-48 flex justify-center items-center text-4xl text-warp tracking-wider">
      <div class="max-w-4xl w-full">
        
        <CurvedLoop
        marquee-text="Welcome ✦ To ✦ Our ✦ Photography ✦ Portfolio ✦"
        :speed="2"
        :curve-amount="400"
        direction="left"
        :interactive="true"
        />
      </div>  

      

    </div>
    
  </div>
  

</template>