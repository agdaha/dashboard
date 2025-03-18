<script setup>
import {computed} from 'vue';

const props = defineProps(['title', 'currentValue', 'prevValue', 'prevText', 'basecolor', 'iconname', 'isLoaded']);

const bgColor = ['bg-' + props.basecolor + '-100', 'dark:bg-' + props.basecolor + '-400/10'];
const iconClass = ['text-' + props.basecolor + '-500 ', props.iconname];

</script>

<template>
  <div class="card mb-0 h-full">
    <div class="flex justify-between">
      <div>
        <span class="block text-muted-color font-medium mb-2 text-xl">{{ props.title }}</span>
        <div v-if="props.isLoaded" class="text-surface-900 dark:text-surface-0 font-medium text-3xl mb-2">{{ props.currentValue }}</div>
        <div v-else >
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="transparent" animationDuration=".5s" aria-label="Custom ProgressSpinner"/>
        загрузка...
        </div>
        <span class="text-surface-900 dark:text-surface-0 font-medium">{{ props.prevValue }} </span>
        <span class="text-muted-color"> {{ props.prevText }}</span>
      </div>
      <div class="flex items-center justify-center rounded-border" :class="bgColor" style="width: 5rem; height: 5rem">
        <i class="pi" :class="iconClass" style="font-size: 3rem"></i>
      </div>
    </div>
  </div>
</template>
