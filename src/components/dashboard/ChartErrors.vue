<script setup>
import { getCurrentInstance, computed, onMounted, watch, ref, watchEffect } from 'vue'
import { logsStore } from '@/stories/logs'

const chartData = ref(null)
const chartOptions = ref(null)

const logstore = logsStore()
const warn = computed(() => logstore.getWarnCount)
const errs = computed(() => logstore.getErrorCount)
const isLoaded = computed(() => logstore.isLoaded)
const datas = computed(() => logstore.getErrorsStat)

function setChartData() {
  const documentStyle = getComputedStyle(document.documentElement)

  return {
    labels: datas.value.labels,
    datasets: [
      {
        label: 'Предупреждения',
        backgroundColor: documentStyle.getPropertyValue('--p-primary-200'),
        data: datas.value.valuesWarn,
        barThickness: 64,
        borderColor: documentStyle.getPropertyValue('--p-primary-500'),
      },
      {
        label: 'Ошибки',
        backgroundColor: documentStyle.getPropertyValue('--p-primary-500'),
        data: datas.value.valuesError,

        barThickness: 64,
        borderColor: documentStyle.getPropertyValue('--p-primary-500'),
      },
    ],
  }
}

function setChartOptions() {
  const documentStyle = getComputedStyle(document.documentElement)
  const borderColor = documentStyle.getPropertyValue('--p-content-background')
  const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color')
  const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color')

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    scales: {
      x: {
        stacked: false,
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: 'transparent',
          borderColor: borderColor,
        },
      },
      y: {
        stacked: false,
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
          borderColor: borderColor,
          drawTicks: false,
        },
      },
    },
  }
}

const instance = getCurrentInstance()
const appState = computed(() => {
  return instance.appContext.config.globalProperties.$appState
})

watch([appState.value], () => {
  chartData.value = setChartData()
  chartOptions.value = setChartOptions()
})

watch([warn, errs, isLoaded], () => {
  chartData.value.labels = datas.value.labels
  chartData.value.datasets[0].data = datas.value.valuesWarn
  chartData.value.datasets[1].data = datas.value.valuesError
})

onMounted(() => {
  chartData.value = setChartData()
  chartOptions.value = setChartOptions()
})
</script>

<template>
  <div class="card">
    <div class="font-semibold text-2xl mb-4">Статистика ошибок и предупреждений</div>
    <Chart type="bar" :data="chartData" :options="chartOptions" class="h-96" />
  </div>
</template>
