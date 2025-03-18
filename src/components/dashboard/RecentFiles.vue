<script setup>
import { logsStore } from '@/stories/logs'
import { computed, ref } from 'vue'

import FileService from '@/services/file.service'

const log = logsStore()
const fileDialog = ref(false)
const files = computed(() => log.getFiles.sort((a, b) => a.dt < b.dt))
const textFile = ref()

function viewFile(data) {
  FileService.getFile(data.filename).then((text) => { textFile.value = data.filename + '\n' + text })
  fileDialog.value = true;
}


</script>

<template>
  <div class="card">
    <div class="font-semibold text-xl mb-4">Последние файлы</div>
    <DataTable :value="files" :size="'small'" :rows="7" :paginator="true" responsiveLayout="scroll" sortField="dt"
      :sortOrder="-1">
      <Column field="source" header="Источник" :sortable="true" style="width: 15%">
        <template #body="slotProps">
          <router-link :to="{ name: 'detail', params: { source: slotProps.data.source } }"> {{ slotProps.data.source
            }}</router-link>
        </template>
      </Column>
      <Column field="filename" header="Имя файла" :sortable="true" style="width: 40%">
        <template #body="slotProps">
          <Tag :value="slotProps.data.filename" :severity="slotProps.data.warns > 0 ? 'warn' : 'secondary'" />
        </template>
      </Column>
      <Column field="dt" header="Время" :sortable="true" style="width: 35%">
        <template #body="slotProps">
          {{ slotProps.data.dt.toLocaleString() }}
        </template>
      </Column>
      <Column style="width: 15%" header="View">
        <template #body="slotProps">
          <Button icon="pi pi-search" type="button" class="p-button-text" @click="viewFile(slotProps.data)"></Button>
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="fileDialog" :style="{ width: '450px' }" header="Просмотр содержимого" :modal="true">
      <div class="flex items-center gap-4">
        <pre v-if="textFile">{{ textFile }}</pre>
      </div>
      <template #footer>
        <Button label="Закрыть" icon="pi pi-times" text @click="fileDialog = false" />
      </template>
    </Dialog>

  </div>
</template>
