<script setup lang="ts">
// 我们不需要在这里导入 AppFooter, 
// 因为它已经在 App.vue 中被全局加载了
 import TrueFocus from '@/components/TextAnimations/TrueFocus/TrueFocus.vue';
 //修改TrueFocus的字体样式x需要在 TrueFocus.vue 组件中进行更改
</script>

<template>
  <div class="pt-32 px-8 pb-24 text-white max-w-5xl mx-auto">
    
    <div class="pt-2 text-sm mb-6 justify-left flex font-thin">
      <TrueFocus
        sentence="About Us"
        :manualMode="false"
        :blurAmount="5"
        borderColor="green"
        :animationDuration="0.5"
        :pauseBetweenAnimations="1"
        
        />
    </div>
    <p class="mb-4 text-gray-300">
      I'm a title. Click here to add your own text and edit me. I'm a paragraph. Click here to add your own text and edit me. It's easy. Just click “Edit Text” or double click me and you can start adding your own content and make changes to the font. Feel free to drag and drop me anywhere you like on your page. I’m a great place for you to tell a story and let your users know a little more about you.
    </p>
    <p class="text-gray-300">
      This is a great space to write long text about your company and your services. You can use this space to go into a little more detail about your company. Talk about your team and what services you provide. Tell your visitors the story of how you came up with the idea for your business and what makes you different from your competitors. Make your company stand out and show your visitors who you are. Tip: Add your own image by double clicking the image and clicking Change Image.
    </p>

    <div class="flex space-x-6 mt-12">
      
      <a href="#" class="flex items-center space-x-2 text-sm text-gray-300 hover:text-white transition-colors">
        <font-awesome-icon :icon="['fab', 'x-twitter']" class="h-4 w-4" />
        <span>Follow me on X</span>
      </a>
      
      <a href="#" class="flex items-center space-x-2 text-sm text-gray-300 hover:text-white transition-colors">
        <font-awesome-icon :icon="['fab', 'telegram']" class="h-4 w-4" />
        <span>Contact me with Telegram</span>
      </a>
      
    </div>

  </div>
</template>