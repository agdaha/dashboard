<script setup>
import { logsStore } from '@/stories/logs';
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ScrollTop from '@/components/ScrollTop.vue';

const logstore = logsStore();
const route = useRoute();
const router = useRouter();

const source = ref();
const dt = ref();
const sources = computed(() => logstore.getSources);
const logs = computed(() => logstore.getLogsBySource(source.value));

onMounted(() => {
  const name = route.params['source'];
  source.value = name;
});

const routeSource = () => {
  router.push({ name: 'detail', params: { source: source.value } });
};

const exportCSV = () => {
  dt.value.exportCSV();
};

const rowStyle = (data) => {
  if (data.errors.length) {
    return {
      backgroundColor: '#ffe4e4'
    };
  }
  if (data.warns.length) {
    return {
      backgroundColor: '#fff7cc'
    };
  }
  return {};
};
</script>

<template>
  <div class="card">
    <div class="flex-auto">
      <span class="text-xl">Детализация по источнику: </span>
      <Select v-model="source" :options="sources" placeholder="Выберите источник" @change="routeSource" />
    </div>
    <DataTable :value="logs" ref="dt" tableStyle="min-width: 20rem" :rowStyle="rowStyle">
      <template #header>
        <div class="text-end pb-4">
          <Button icon="pi pi-external-link" label="Export" @click="exportCSV($event)" />
        </div>
      </template>
      <Column field="filename" header="Имя файла"></Column>
      <Column field="stage1" header="Этап 1 (получен)">
        <template #body="slotProps">
          {{ slotProps.data.stage1?.toLocaleString() }}
        </template>
      </Column>
      <Column field="stage2" header="Этап 2 (обработан)">
        <template #body="slotProps">
          {{ slotProps.data.stage2?.toLocaleString() }}
        </template>
      </Column>
      <Column field="errors" header="Ошибки">
        <template #body="slotProps">
          <div v-for="error in slotProps.data.errors" :key="error.time">{{ error.message }}</div>
        </template>
      </Column>
      <Column field="warns" header="Пердупреждения">
        <template #body="slotProps">
          <div v-for="warn in slotProps.data.warns" :key="warn.time">{{ warn.message }}</div>
        </template>
      </Column>
    </DataTable>
  </div>
  <ScrollTop />
</template>

<style scoped></style>
