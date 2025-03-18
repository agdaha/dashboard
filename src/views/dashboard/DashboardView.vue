<script setup>
import Statistics from '@/components/dashboard/Statistics.vue';
import RecentFiles from '@/components/dashboard/RecentFiles.vue';
import ChartErrors from '@/components/dashboard/ChartErrors.vue';

</script>

<template>
  <div class="grid grid-cols-12 gap-6">

    <Statistics />
    <div class="col-span-12 xl:col-span-6">
      <RecentFiles/>
    </div>
    <div class="col-span-12 xl:col-span-6">
      <div>
        <ChartErrors/>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
