<script setup>
import { logsStore } from '@/stories/logs';
import { computed } from 'vue';
import CardStatictic from '@/components/dashboard/CardStatictic.vue';
const log = logsStore();
const ok = computed(() => log.getOkCount);
const okPrev = computed(() => log.getOkCountPrev);
const warn = computed(() => log.getWarnCount);
const warnPrev = computed(() => log.getWarnCountPrev);
const error = computed(() => log.getErrorCount);
const errorPrev = computed(() => log.getErrorCountPrev);
const inProccess = computed(() => log.getInProccessCount);
const isLoaded = computed(() => log.isLoaded);
</script>

<template>
  <div class="col-span-12 grid grid-cols-12 gap-x-6">
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
      <CardStatictic :isLoaded="isLoaded" :title="'В процессе ...'" :currentValue="inProccess" :basecolor="'blue'" :iconname="'pi-file-import'"></CardStatictic>
    </div>
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
      <CardStatictic :isLoaded="isLoaded" :title="'Успешно обработано'" :currentValue="ok" :prevValue="okPrev" :prevText="' предыдущий час'" :basecolor="'green'" :iconname="'pi-check-circle'"></CardStatictic>
    </div>
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
      <CardStatictic :isLoaded="isLoaded" :title="'Предупреждения'" :currentValue="warn" :prevValue="warnPrev" :prevText="' предыдущий час'" :basecolor="'yellow'" :iconname="'pi-exclamation-circle'"></CardStatictic>
    </div>
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
      <CardStatictic :isLoaded="isLoaded" :title="'Ошибки'" :currentValue="error" :prevValue="errorPrev" :prevText="' предыдущий час'" :basecolor="'red'" :iconname="'pi-exclamation-triangle'"></CardStatictic>
    </div>
    <div class="bg-blue-100 dark:bg-blue-400/10 text-blue-500 bg-green-100 dark:bg-green-400/10 text-green-500 bg-yellow-100 dark:bg-yellow-400/10 text-yellow-500 bg-red-100 dark:bg-red-400/10 text-red-500"></div>
  </div>
</template>
