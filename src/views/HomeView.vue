<script setup lang="ts">
 import { ref } from 'vue';
 import MorphingText from '@/components/ui/morphing-text/MorphingText.vue';
 import FluidCursor from '@/components/ui/fluid-cursor/FluidCursor.vue';
 import Silk from '@/components/Backgrounds/Silk/Silk.vue';

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

//文本内容
  const morphingTexts = [
    "Hello!",
    "Welcome to my Photoportfolio.",
    "Wish you enjoy this!",
  ];
</script>

<template>
  <FluidCursor></FluidCursor>
  <div class="w-full min-h-screen overflow-hidden h-dvh relative">

    <Silk
    :color="'#d9c9e9'"/>

    <div class="absolute inset-0 px-4 md:px12 z-20 p-48 flex flex-col justify-center items-center text-4xl text-warp tracking-wider">
      <div class="max-w-4xl w-full">
        
        <!-- <CurvedLoop
        marquee-text="Welcome ✦ To ✦ Our ✦ Photography ✦ Portfolio ✦"
        :speed="2"
        :curve-amount="400"
        direction="left"
        :interactive="true"
        /> -->
        <MorphingText
          :texts="morphingTexts"
          :class="'text-white'"
        />
      </div>
      <div class="flex min-h64 items-center justify-center mt-36">
        <button class="text-2xl" id="homeButton">Get start</button>
        <!-- <RainbowButton :class="'backdrop-blur-lg'">Get Started</RainbowButton> -->
      </div>  
      

    </div>
    
  </div>
  

</template>

<style>
  /* From Uiverse.io by cssbuttons-io */ 
#homeButton {
 --glow-color: rgb(217, 176, 255);
 --glow-spread-color: rgba(191, 123, 255, 0.781);
 --enhanced-glow-color: rgb(231, 206, 255);
 --btn-color: rgb(100, 61, 136);
 border: .25em solid var(--glow-color);
 padding: 1em 3em;
 color: var(--glow-color);
 background-color: var(--btn-color);
 border-radius: 3em;
 outline: none;
 box-shadow: 0 0 1em .25em var(--glow-color),
        0 0 4em 1em var(--glow-spread-color),
        inset 0 0 .75em .25em var(--glow-color);
 text-shadow: 0 0 .5em var(--glow-color);
 position: relative;
 transition: all 0.3s;
}

#homeButton::after {
 pointer-events: none;
 content: "";
 position: absolute;
 top: 120%;
 left: 0;
 height: 100%;
 width: 100%;
 background-color: var(--glow-spread-color);
 filter: blur(2em);
 opacity: .7;
 transform: perspective(1.5em) rotateX(35deg) scale(1, .6);
}

#homeButton:hover {
 color: var(--btn-color);
 background-color: var(--glow-color);
 box-shadow: 0 0 1em .25em var(--glow-color),
        0 0 4em 2em var(--glow-spread-color),
        inset 0 0 .75em .25em var(--glow-color);
}

#homeButton:active {
 box-shadow: 0 0 0.6em .25em var(--glow-color),
        0 0 2.5em 2em var(--glow-spread-color),
        inset 0 0 .5em .25em var(--glow-color);
}

</style>