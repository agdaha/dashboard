<script setup>
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'
import MyLogo from '@/components/MyLogo.vue'
import { isOnline } from '@/services/ws.service'


const emit = defineEmits(['toggleMenu', 'logOut', 'reconnect'])

const props = defineProps(['sysinfo', 'username'])

function getStatus(value) {
  if (!value) {
    return 'secondary'
  } else if (value < 80) {
    return 'info'
  } else if (value < 95) {
    return 'warn'
  } else {
    return 'danger'
  }
}

</script>

<template>
  <Toolbar class="topbar">
    <template #start>
      <div>
        <Button @click="$emit('toggleMenu')">
          <i class="pi pi-bars"></i>
        </Button>
      </div>
    </template>

    <template #center>
      <div class="inline-flex gap-9 justify-between">
        <MyLogo />
        <div class="inline-flex gap-2 items-center justify-center">

          <Tag :severity="getStatus(props.sysinfo.cpu)">ЦПУ: {{ props.sysinfo.cpu }} %</Tag>

          <Tag :severity="getStatus(props.sysinfo.mem)">ОЗУ: {{ props.sysinfo.mem }}%</Tag>

          <Tag :severity="getStatus(props.sysinfo.disk)">Диск: {{ props.sysinfo.disk }}%</Tag>
          <Tag v-if="isOnline" severity="success">Online</Tag>
          <div v-else>
            <Tag severity="danger" class="cursor-pointer" @click="$emit('reconnect')">offline</Tag>
            <!-- <span> <- нажимте для возобноления соединения</span> -->
          </div>
        </div>
      </div>
    </template>

    <template #end>
      <div class="inline-flex gap-10">
        <ThemeSwitcher />
        <div class="flex list-none m-0 p-0 gap-2 items-center">
          <span class="font-semibold text-xl">{{ props.username }}</span>
          <Button @click="$emit('logOut')"
            class="inline-flex w-8 h-8 p-0 items-center justify-center surface-0 dark:surface-800 border border-surface-200 dark:border-surface-600 rounded">
            <i class="pi pi-sign-out"></i>
          </Button>
        </div>
      </div>
    </template>
  </Toolbar>
</template>

<style scoped>
.topbar {
  position: fixed;
  height: 4rem;
  z-index: 997;
  left: 0;
  top: 0;
  width: 100%;
  padding: 0 2rem;
  transition: left var(--layout-section-transition-duration);
  display: flex;
  align-items: center;
}
</style>
