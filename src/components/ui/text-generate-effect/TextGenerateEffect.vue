<template>
  <div :class="cn('leading-snug tracking-wide', props.class)">
    <div ref="scope" class="flex flex-wrap justify-center"> <template v-for="(item, idx) in parsedItems" :key="idx">
        
        <div v-if="item === '\n'" class="w-full h-0 basis-full"></div>

        <span
          v-else
          class="inline-block opacity-0"
          :style="{
            filter: props.filter ? 'blur(10px)' : 'none',
            transition: `opacity ${props.duration}s, filter ${props.duration}s`,
          }"
        >
          {{ item }}
          <span v-if="!isChineseChar(item)">&nbsp;</span>
        </span>

      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type HTMLAttributes, onMounted, ref } from "vue";
import { cn } from "@/lib/utils";

const props = withDefaults(
  defineProps<{
    words: string;
    filter?: boolean;
    duration?: number;
    delay?: number;
    class?: HTMLAttributes["class"];
  }>(),
  { duration: 0.7, delay: 0, filter: true },
);

const scope = ref<HTMLElement | null>(null);

// 判断单个字符是否为中文
const isChineseChar = (char: string) => /[\u4e00-\u9fa5]/.test(char);

// 核心逻辑：处理字符串分割
const parsedItems = computed(() => {
  // 1. 先按换行符 \n 分割成多行，保留 \n 标记
  // split(/(\n)/) 会把分隔符也保留在数组中
  const segments = props.words.split(/(\n)/);
  
  const result: string[] = [];

  segments.forEach(segment => {
    if (segment === '\n') {
      result.push('\n');
      return;
    }

    // 2. 对每一段文本进行判断
    if (isChineseChar(segment)) {
      // 如果包含中文，则按“字”分割
      result.push(...segment.split(''));
    } else {
      // 如果是纯英文/其他，按“空格”分割
      // 过滤掉空字符串，防止多个空格导致的问题
      const words = segment.split(' ').filter(w => w.length > 0);
      result.push(...words);
    }
  });

  return result;
});

onMounted(() => {
  if (scope.value) {
    // 选择所有的 span (排除掉作为换行的 div)
    const spans = scope.value.querySelectorAll("span.inline-block");

    setTimeout(() => {
      spans.forEach((span: Element, index: number) => {
        const htmlSpan = span as HTMLElement;
        setTimeout(() => {
          htmlSpan.style.opacity = "1";
          htmlSpan.style.filter = props.filter ? "blur(0px)" : "none";
        }, index * 100); // 调整这里的时间间隔 (例如 100ms) 来控制打字速度
      });
    }, props.delay);
  }
});
</script>