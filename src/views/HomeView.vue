<template>
  <div style="width: 100%; height: 600px; position: relative">
    <GradientText
    text="WelCome!"
    :colors="['#ffaa40', '#9c40ff', '#ffaa40']"
    :animation-speed="8"
    :show-border="false"
    class-name="your-custom-class"
  />
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
    />
  </div>

    
</template>

<script setup lang="ts">
 import LiquidEther from '../components/Backgrounds/LiquidEther/LiquidEther.vue'
 import GradientText from '../components/TextAnimations/GradientText/GradientText.vue'
</script>