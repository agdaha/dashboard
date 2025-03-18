<script setup>
import { onBeforeMount, computed, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import wsService from '@/services/ws.service'
import { authStore } from '@/stories/auth'
import { logsStore } from '@/stories/logs'

import TopBar from '@/components/TopBar.vue'
import SideBar from '@/components/SideBar.vue'

const router = useRouter()
const authstore = authStore()
const logstore = logsStore()
const toast = useToast()
const visible = ref(false)
const sysinfo = ref({})

const username = computed(()=>authstore.userName)

const toggleMenu = () => {
  visible.value = !visible.value
}

const logOut = () => {
  authstore.logOut()
  router.push('/auth/login')
}

const updateSysInfo = (data) => {
  sysinfo.value.cpu = data.cpu
  sysinfo.value.mem = data.mem
  sysinfo.value.disk = data.disk
}

onBeforeMount(() => {
  logstore.clear()
  wsService.addEventListener('log', logstore.addText)
  wsService.addEventListener('remove', logstore.removeOld)
  wsService.addEventListener('cpu', updateSysInfo)
  wsService.addEventListener('error', onWsError)
  wsService.connect()
})

onUnmounted(() => {
  wsService.removeEventListener('log', logstore.addText)
  wsService.removeEventListener('remove', logstore.removeOld)
  wsService.removeEventListener('cpu', updateSysInfo)
  wsService.removeEventListener('error', onWsError)
  wsService.disconnect()
})

const onWsError = ()=>{
  if (!authstore.checkValid()){
    router.push('/auth/login')
  } else {
    toast.add({ severity: 'error', summary: "Ошибка соединения", life: 3000 })
  }
}

const reconnect = ()=>{
  logstore.clear()
  wsService.connect()
}
</script>

<template>
  <TopBar :sysinfo="sysinfo" :username="username" @toggleMenu="toggleMenu" @logOut="logOut" @reconnect="reconnect"/>
  <SideBar v-model="visible" />
  <div class="layout-main-container">
    <div class="layout-main">
      <router-view>
      </router-view>
    </div>
  </div>
</template>

<style>
.layout-main-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: space-between;
  padding: 5rem 3rem 0 3rem;
  transition: margin-left var(--layout-section-transition-duration);
}

.layout-main {
  flex: 1 1 auto;
  margin: auto;
  min-width: 70%;
}
</style>
